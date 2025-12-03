const express = require("express")
const mongoose = require("mongoose")
const { auth, adminAuth } = require("../middleware/auth")
const Event = require("../models/Event")
const Activity = require("../models/Activity")
const User = require("../models/User")
const { generateQRCode } = require("../utils/qrCodeGenerator")
const { sendAttendanceEmail } = require("../utils/emailService")

const router = express.Router()

// Test endpoint to verify database connection and event structure
router.get("/test/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }
    res.json({
      eventId: event._id,
      title: event.title,
      attendeesCount: event.attendees.length,
      attendees: event.attendees,
      rawEvent: event.toObject()
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get events for an activity (must be before /:id route)
router.get("/activity/:activityId", async (req, res) => {
  try {
    // Get the activity to access enrolled students (populated with user details)
    const activity = await Activity.findById(req.params.activityId)
      .populate('enrolledStudents', 'name email')
      .select('enrolledStudents currentEnrollment')
      .lean()
    
    const activityEnrollmentCount = activity?.currentEnrollment || 0
    const activityEnrolledStudents = activity?.enrolledStudents || []
    
    // First, get raw events to get accurate attendee counts from database
    const rawEvents = await Event.find({ activityId: req.params.activityId })
      .select('_id attendees')
      .lean()
    
    // Create a map of event ID to attendee count
    const attendeeCountMap = new Map()
    rawEvents.forEach(event => {
      const count = Array.isArray(event.attendees) ? event.attendees.length : 0
      attendeeCountMap.set(event._id.toString(), count)
    })
    
    // Now get events with populated data
    const events = await Event.find({ activityId: req.params.activityId })
      .populate("attendees", "name email")
      .populate("activityId", "name")
      .populate("attendance.studentId", "name email")
      .lean()
    
    // Process events to include accurate attendee counts from database
    const processedEvents = events.map(event => {
      const attendeesArray = Array.isArray(event.attendees) ? event.attendees : []
      const validAttendees = attendeesArray.filter(a => a !== null && a !== undefined)
      
      // Get the count from the database (more reliable than populated array)
      const eventAttendeesCount = attendeeCountMap.get(event._id.toString()) || 0
      
      // Also include activity enrollment info for context
      // If no one registered for the event specifically, show activity enrollment
      const displayCount = eventAttendeesCount > 0 ? eventAttendeesCount : activityEnrollmentCount
      
      console.log(`📋 Event "${event.title}": ${eventAttendeesCount} event registrations, ${activityEnrollmentCount} activity enrollments`)
      
      return {
        ...event,
        attendees: validAttendees,
        attendeesCount: eventAttendeesCount, // Actual event registrations
        activityEnrollmentCount: activityEnrollmentCount, // Activity enrollment count
        activityEnrolledStudents: activityEnrolledStudents // Students enrolled in the activity
      }
    })
    
    res.json(processedEvents)
  } catch (error) {
    console.error("❌ Error fetching events for activity:", error)
    res.status(500).json({ message: error.message })
  }
})

// Get a single event by ID (must be after specific routes)
router.get("/:id", async (req, res) => {
  try {
    // First get raw event to get accurate attendee count
    const rawEvent = await Event.findById(req.params.id).select('attendees activityId').lean()
    const rawAttendeeCount = Array.isArray(rawEvent?.attendees) ? rawEvent.attendees.length : 0
    
    // Get activity enrollment data if event has an activity
    let activityEnrollmentCount = 0
    let activityEnrolledStudents = []
    if (rawEvent?.activityId) {
      const activity = await Activity.findById(rawEvent.activityId)
        .populate('enrolledStudents', 'name email')
        .select('enrolledStudents currentEnrollment')
        .lean()
      activityEnrollmentCount = activity?.currentEnrollment || 0
      activityEnrolledStudents = activity?.enrolledStudents || []
    }
    
    // Then get event with populated data
    const event = await Event.findById(req.params.id)
      .populate("attendees", "name email")
      .populate("activityId", "name")
      .populate("attendance.studentId", "name email")
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }
    
    // Ensure attendees is always an array and filter out null values
    const eventObj = event.toObject()
    const validAttendees = Array.isArray(eventObj.attendees) 
      ? eventObj.attendees.filter(a => a !== null && a !== undefined)
      : []
    
    const processedEvent = {
      ...eventObj,
      attendees: validAttendees,
      attendeesCount: rawAttendeeCount, // Use database count
      activityEnrollmentCount: activityEnrollmentCount,
      activityEnrolledStudents: activityEnrolledStudents
    }
    
    res.json(processedEvent)
  } catch (error) {
    console.error("❌ Error fetching event:", error)
    res.status(500).json({ message: error.message })
  }
})

// Create event (admin or coordinator)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "coordinator") {
      return res.status(403).json({ message: "Only admin or coordinator can create events" })
    }

    const { activityId, title, description, date, time, location, capacity, pointsPerEvent } = req.body

    const event = new Event({
      activityId,
      title,
      description,
      date,
      time,
      location,
      capacity,
      pointsPerEvent: Number(pointsPerEvent) || 10,
    })

    await event.save()

    await Activity.findByIdAndUpdate(activityId, {
      $push: { upcomingEvents: event._id },
    })

    res.status(201).json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/analytics/:activityId", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "coordinator") {
      return res.status(403).json({ message: "Only admin or coordinator can view analytics" })
    }

    const events = await Event.find({ activityId: req.params.activityId })
    const activity = await Activity.findById(req.params.activityId).populate("enrolledStudents")

    const analytics = {
      totalRegistrations: activity.currentEnrollment || 0,
      totalEvents: events.length,
      eventDetails: events.map((event) => ({
        eventId: event._id,
        title: event.title,
        date: event.date,
        attendanceCount: event.attendance.length,
        registeredCount: event.attendees.length,
        attendanceRate:
          event.attendees.length > 0 ? ((event.attendance.length / event.attendees.length) * 100).toFixed(2) : 0,
      })),
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark attendance for a student
router.post("/:id/attendance", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "coordinator") {
      return res.status(403).json({ message: "Only admin or coordinator can mark attendance" })
    }

    const { studentId, status } = req.body
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    const existingAttendance = event.attendance.find((a) => a.studentId.toString() === studentId)
    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance already marked for this student" })
    }

    const pointsToAward = status === "present" ? event.pointsPerEvent : 0

    event.attendance.push({
      studentId,
      status: status || "present",
      presentDate: new Date(),
      pointsAwarded: pointsToAward,
    })

    await event.save()

    if (status === "present") {
      const user = await User.findById(studentId)
      user.points = Number(user.points || 0) + Number(pointsToAward)
      user.attendanceRecords.push({
        eventId: event._id,
        activityId: event.activityId,
        date: new Date(),
        pointsEarned: pointsToAward,
      })
      await user.save()
      
      // Send email notification if enabled
      if (user.emailNotifications) {
        await sendAttendanceEmail(user.email, user.name, event.title, pointsToAward)
      }
    }

    res.json({ message: `Attendance marked as ${status}`, event })
  } catch (error) {
    console.error("Error marking attendance:", error)
    res.status(500).json({ message: error.message })
  }
})

// Register for an event
router.post("/:id/attend", auth, async (req, res) => {
  try {
    // Validate userId
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    const userId = new mongoose.Types.ObjectId(req.user.userId)
    console.log(`🔵 Registration attempt: User ${userId} for Event ${req.params.id}`)

    // Check if event exists
    const eventBefore = await Event.findById(req.params.id)
    if (!eventBefore) {
      return res.status(404).json({ message: "Event not found" })
    }

    console.log(`📋 Event before update: "${eventBefore.title}" has ${eventBefore.attendees.length} attendees`)

    // Check if user is already registered
    const isRegistered = eventBefore.attendees.some(
      attendeeId => attendeeId.toString() === userId.toString()
    )

    if (isRegistered) {
      return res.status(400).json({ message: "Already registered" })
    }

    // Use findByIdAndUpdate with $addToSet for atomic operation
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { attendees: userId } }, // $addToSet prevents duplicates
      { new: true, runValidators: true } // Return updated document and run validators
    )

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found after update" })
    }

    // Verify the save worked by querying the database directly
    const savedEvent = await Event.findById(req.params.id)
    const attendeeCount = Array.isArray(savedEvent.attendees) ? savedEvent.attendees.length : 0
    
    console.log(`✅ Student ${userId} registered for event ${req.params.id}`)
    console.log(`📊 Event "${savedEvent.title}" now has ${attendeeCount} registered attendees in database`)
    console.log(`📝 Attendees array:`, savedEvent.attendees)

    // Verify the count increased
    if (attendeeCount <= eventBefore.attendees.length) {
      console.error(`⚠️ WARNING: Attendee count did not increase! Before: ${eventBefore.attendees.length}, After: ${attendeeCount}`)
    }

    // Return the event with populated attendees
    const populatedEvent = await Event.findById(req.params.id)
      .populate("attendees", "name email")
      .populate("activityId", "name")

    res.json({ 
      message: "Registered for event", 
      event: populatedEvent,
      attendeeCount: attendeeCount
    })
  } catch (error) {
    console.error("❌ Error registering for event:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      userId: req.user?.userId,
      eventId: req.params.id
    })
    res.status(500).json({ message: error.message || "Internal server error" })
  }
})

// Register via QR code
router.post("/register-qr/:qrToken", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    const userId = new mongoose.Types.ObjectId(req.user.userId)
    const event = await Event.findOne({ qrCode: req.params.qrToken })

    if (!event) {
      return res.status(404).json({ message: "Invalid QR code" })
    }

    console.log(`🔵 QR Registration attempt: User ${userId} for Event ${event._id}`)
    console.log(`📋 Event before update: "${event.title}" has ${event.attendees.length} attendees`)

    // Check if user is already registered
    const isRegistered = event.attendees.some(
      attendeeId => attendeeId.toString() === userId.toString()
    )

    if (isRegistered) {
      return res.status(400).json({ message: "Already registered for this event" })
    }

    // Use findByIdAndUpdate with $addToSet for atomic operation
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { $addToSet: { attendees: userId } },
      { new: true, runValidators: true }
    )

    // Verify the save worked
    const savedEvent = await Event.findById(event._id)
    const attendeeCount = Array.isArray(savedEvent.attendees) ? savedEvent.attendees.length : 0
    
    console.log(`✅ Student ${userId} registered via QR for event ${event._id}`)
    console.log(`📊 Event "${savedEvent.title}" now has ${attendeeCount} registered attendees`)
    console.log(`📝 Attendees array:`, savedEvent.attendees)

    // Return the event with populated attendees
    const populatedEvent = await Event.findById(event._id)
      .populate("attendees", "name email")
      .populate("activityId", "name")

    res.json({ 
      message: "Successfully registered via QR code", 
      event: populatedEvent,
      attendeeCount: attendeeCount
    })
  } catch (error) {
    console.error("❌ Error registering via QR code:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      userId: req.user?.userId,
      qrToken: req.params.qrToken
    })
    res.status(500).json({ message: error.message || "Internal server error" })
  }
})

module.exports = router
