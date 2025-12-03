const express = require("express")
const { auth, adminAuth } = require("../middleware/auth")
const User = require("../models/User")
const Event = require("../models/Event")

const router = express.Router()

// Get all users (admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role points enrolledActivities roleStatus")
      .populate("enrolledActivities", "name")
      .sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("enrolledActivities", "name category")
      .populate("attendanceRecords.eventId", "title date")
      .populate("attendanceRecords.activityId", "name")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update user profile
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, phone, alternativeEmail, profilePicture } = req.body

    console.log("🔍 Update Profile Debug:")
    console.log("req.user:", req.user)
    console.log("req.user.userId:", req.user.userId)
    console.log("req.params.id:", req.params.id)
    console.log("Match:", req.user.userId?.toString() === req.params.id.toString())

    // Use the userId from JWT token instead of params for security
    const userId = req.user.userId
    
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update allowed fields
    if (name) user.name = name
    if (phone !== undefined) user.phone = phone
    if (alternativeEmail !== undefined) user.alternativeEmail = alternativeEmail
    if (profilePicture !== undefined) user.profilePicture = profilePicture

    await user.save()

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      alternativeEmail: user.alternativeEmail,
      profilePicture: user.profilePicture,
      role: user.role,
      points: user.points,
    })
  } catch (error) {
    console.error("❌ Profile update error:", error)
    res.status(500).json({ message: error.message })
  }
})

router.get("/:id/registered-events", auth, async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.params.id })
      .select("_id title date time location pointsPerEvent")
      .populate("activityId", "name")

    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user leaderboard (top students by points)
router.get("/leaderboard/top", async (req, res) => {
  try {
    const topUsers = await User.find({ role: "student" }).select("name points").sort({ points: -1 }).limit(10)

    res.json(topUsers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update email notification preference
router.put("/:id/notifications", auth, async (req, res) => {
  try {
    const { emailNotifications } = req.body
    const userId = req.user.userId
    
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.emailNotifications = emailNotifications
    await user.save()

    res.json({ message: "Email notification preference updated", emailNotifications: user.emailNotifications })
  } catch (error) {
    console.error("❌ Notification preference update error:", error)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
