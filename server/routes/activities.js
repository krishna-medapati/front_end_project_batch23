const express = require("express")
const mongoose = require("mongoose")
const { auth, adminAuth } = require("../middleware/auth")
const Activity = require("../models/Activity")
const User = require("../models/User")
const Event = require("../models/Event")

const router = express.Router()

// Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find().populate("enrolledStudents", "name email").populate("createdBy", "name")
    res.json(activities)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/recommendations/:userId", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId)
    
    const user = await User.findById(userId).populate("enrolledActivities")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get enrolled activity IDs (handle both ObjectId and string)
    const enrolledActivityIds = user.enrolledActivities.map((a) => {
      const id = a._id || a
      return id.toString ? id.toString() : id
    })
    
    // Get unique categories from enrolled activities
    const enrolledCategories = [...new Set(
      user.enrolledActivities
        .map((a) => a.category)
        .filter(Boolean)
    )]

    let recommendations = []

    if (enrolledCategories.length > 0) {
      // User has enrolled activities - recommend similar activities
      recommendations = await Activity.find({
        _id: { $nin: enrolledActivityIds },
      category: { $in: enrolledCategories },
    })
      .limit(5)
        .populate("enrolledStudents", "name email")
        .lean()
      
      console.log(`📊 Found ${recommendations.length} recommendations based on enrolled categories: ${enrolledCategories.join(', ')}`)
    }

    // If no recommendations found (or user has no enrolled activities), show popular/available activities
    if (recommendations.length === 0) {
      recommendations = await Activity.find({
        _id: { $nin: enrolledActivityIds },
      })
        .sort({ currentEnrollment: -1 }) // Sort by enrollment (popular activities first)
        .limit(5)
        .populate("enrolledStudents", "name email")
        .lean()
      
      console.log(`📊 Showing ${recommendations.length} popular activities (user has no enrolled activities)`)
    }

    // Ensure all required fields are present
    const processedRecommendations = recommendations.map(activity => ({
      ...activity,
      currentEnrollment: activity.currentEnrollment || 0,
      maxCapacity: activity.maxCapacity || 0,
      category: activity.category || 'other',
      description: activity.description || '',
      enrolledStudents: activity.enrolledStudents || []
    }))

    console.log(`✅ Returning ${processedRecommendations.length} recommendations for user ${req.params.userId}`)
    
    res.json(processedRecommendations)
  } catch (error) {
    console.error("❌ Error fetching recommendations:", error)
    res.status(500).json({ message: error.message })
  }
})

// Create activity (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, description, category, schedule, maxCapacity, pointsPerAttendance } = req.body

    const activity = new Activity({
      name,
      description,
      category,
      schedule,
      maxCapacity,
      pointsPerAttendance: pointsPerAttendance || 10,
      createdBy: req.user.userId,
    })

    await activity.save()
    res.status(201).json(activity)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update activity (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.json(activity)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete activity (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id)
    res.json({ message: "Activity deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Register student for activity
router.post("/:id/register", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)

    if (activity.currentEnrollment >= activity.maxCapacity) {
      return res.status(400).json({ message: "Activity is full" })
    }

    if (activity.enrolledStudents.includes(req.user.userId)) {
      return res.status(400).json({ message: "Already registered" })
    }

    activity.enrolledStudents.push(req.user.userId)
    activity.currentEnrollment += 1
    await activity.save()

    const user = await User.findById(req.user.userId)
    user.enrolledActivities.push(req.params.id)
    await user.save()

    res.json({ message: "Registered successfully", activity })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Unregister student from activity
router.post("/:id/unregister", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)

    activity.enrolledStudents = activity.enrolledStudents.filter((id) => id.toString() !== req.user.userId)
    activity.currentEnrollment = Math.max(0, activity.currentEnrollment - 1)
    await activity.save()

    const user = await User.findById(req.user.userId)
    user.enrolledActivities = user.enrolledActivities.filter((id) => id.toString() !== req.params.id)
    await user.save()

    res.json({ message: "Unregistered successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
