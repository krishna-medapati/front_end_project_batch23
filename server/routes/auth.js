const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const validator = require('email-validator')

const router = express.Router()

// Store CAPTCHA challenges in memory (in production, use Redis or similar)
const captchaStore = new Map()

// Generate CAPTCHA challenge (text-based with letters)
router.get("/captcha", (req, res) => {
  // Generate random 5-character string (letters and numbers, excluding confusing characters)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluding 0, O, I, 1 for clarity
  let captchaText = ''
  for (let i = 0; i < 5; i++) {
    captchaText += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  const captchaId = Math.random().toString(36).substring(7)
  
  // Store answer with expiration (5 minutes)
  captchaStore.set(captchaId, {
    answer: captchaText.toUpperCase(), // Store uppercase for case-insensitive comparison
    expiresAt: Date.now() + 5 * 60 * 1000
  })
  
  // Clean up expired CAPTCHAs
  for (const [id, data] of captchaStore.entries()) {
    if (data.expiresAt < Date.now()) {
      captchaStore.delete(id)
    }
  }
  
  res.json({ captchaId, captchaText })
})

// Validate CAPTCHA
const validateCaptcha = (captchaId, userAnswer) => {
  if (!captchaId || !userAnswer) {
    console.log("❌ CAPTCHA validation: Missing captchaId or userAnswer")
    return false
  }
  
  const captcha = captchaStore.get(captchaId)
  if (!captcha) {
    console.log("❌ CAPTCHA validation: CAPTCHA not found in store. ID:", captchaId)
    console.log("📋 Current CAPTCHA store size:", captchaStore.size)
    return false
  }
  
  // Check expiration
  if (captcha.expiresAt < Date.now()) {
    console.log("❌ CAPTCHA validation: CAPTCHA expired")
    captchaStore.delete(captchaId)
    return false
  }
  
  // Validate answer (case-insensitive)
  const expectedAnswer = captcha.answer.toUpperCase()
  const providedAnswer = userAnswer.toString().toUpperCase().trim()
  const isValid = expectedAnswer === providedAnswer
  
  if (!isValid) {
    console.log("❌ CAPTCHA validation: Answer mismatch. Expected:", expectedAnswer, "Got:", providedAnswer)
  } else {
    console.log("✅ CAPTCHA validation: Success")
  }
  
  // Delete used CAPTCHA
  if (isValid) {
    captchaStore.delete(captchaId)
  }
  
  return isValid
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, captchaId, captchaAnswer } = req.body

    // Validate email format
    if (!validator.validate(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" })
    }

    // Validate CAPTCHA
    if (!validateCaptcha(captchaId, captchaAnswer)) {
      return res.status(400).json({ message: "CAPTCHA verification failed. Please try again." })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if this is the first admin - auto-approve them
    let roleStatus = "approved"
    if (role === "admin" || role === "coordinator") {
      const adminCount = await User.countDocuments({ role: { $in: ["admin", "coordinator"] } })
      // If there are no admins yet, approve the first one, otherwise set to pending
      roleStatus = adminCount === 0 ? "approved" : "pending"
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      roleStatus,
    })
    await user.save()

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({ token, user: { id: user._id, name, email, role, roleStatus } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, captchaId, captchaAnswer } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Validate email format
    if (!validator.validate(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" })
    }

    // Validate CAPTCHA
    if (!validateCaptcha(captchaId, captchaAnswer)) {
      console.log("❌ CAPTCHA validation failed:", { captchaId, captchaAnswer })
      return res.status(400).json({ message: "CAPTCHA verification failed. Please try again." })
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      console.log("❌ User not found:", email)
      return res.status(400).json({ message: "Invalid email or password" })
    }

    if (user.roleStatus === "rejected") {
      return res.status(403).json({ message: "Your account has been rejected. Contact an administrator." })
    }

    if (user.roleStatus === "pending" && (user.role === "admin" || user.role === "coordinator")) {
      return res
        .status(403)
        .json({ message: "Your account is pending approval. Please wait for a coordinator to review." })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log("❌ Password mismatch for user:", email)
      return res.status(400).json({ message: "Invalid email or password" })
    }

    console.log("✅ Login successful for user:", email)
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role, roleStatus: user.roleStatus } })
  } catch (error) {
    console.error("❌ Login error:", error)
    res.status(500).json({ message: error.message || "Internal server error" })
  }
})

module.exports = router
