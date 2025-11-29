"use client"

import { useState, useEffect } from "react"

export default function Captcha({ onVerify, resetTrigger = 0 }) {
  const [captchaText, setCaptchaText] = useState("")
  const [captchaId, setCaptchaId] = useState("")
  const [answer, setAnswer] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateCaptcha()
    setIsVerified(false)
    setAnswer("")
    setError("")
  }, [resetTrigger])

  const generateCaptcha = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5001/api/auth/captcha")
      if (response.ok) {
        const data = await response.json()
        setCaptchaText(data.captchaText)
        setCaptchaId(data.captchaId)
        setIsVerified(false)
        setAnswer("")
        setError("")
        if (onVerify) {
          onVerify(false, null, null)
        }
      } else {
        setError("Failed to load CAPTCHA. Please refresh.")
      }
    } catch (error) {
      console.error("Error fetching CAPTCHA:", error)
      setError("Failed to load CAPTCHA. Please refresh.")
    }
    setLoading(false)
  }

  const handleAnswerChange = (e) => {
    const value = e.target.value.toUpperCase().trim()
    setAnswer(value)
    setError("")

    // Auto-verify when answer matches
    if (captchaId && value.length === captchaText.length) {
      if (value === captchaText) {
        setIsVerified(true)
        setError("")
        if (onVerify) {
          onVerify(true, captchaId, value)
        }
      } else {
        setIsVerified(false)
        if (onVerify) {
          onVerify(false, null, null)
        }
      }
    } else {
      setIsVerified(false)
      if (onVerify) {
        onVerify(false, null, null)
      }
    }
  }

  if (loading && !captchaText) {
    return (
      <div style={styles.captchaContainer}>
        <div style={styles.loading}>Loading CAPTCHA...</div>
      </div>
    )
  }

  return (
    <div style={styles.captchaContainer}>
      <div style={styles.captchaQuestion}>
        <div style={styles.captchaDisplay}>
          <span style={styles.captchaText}>{captchaText}</span>
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          style={styles.refreshButton}
          title="Generate new CAPTCHA"
          disabled={loading}
        >
          🔄
        </button>
      </div>
      <div style={styles.inputWrapper}>
        <input
          type="text"
          value={answer}
          onChange={handleAnswerChange}
          placeholder=""
          maxLength={captchaText.length}
          style={{
            ...styles.input,
            borderColor: isVerified ? "#4caf50" : error ? "#c62828" : "#ddd",
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontSize: "16px",
            fontWeight: "600",
            textAlign: "center",
          }}
          disabled={loading}
          required
        />
        {isVerified && (
          <span style={styles.successIcon}>✓ Verified</span>
        )}
      </div>
      {error && (
        <span style={styles.errorText}>{error}</span>
      )}
      <p style={styles.hint}>Enter the letters shown above (case-insensitive)</p>
    </div>
  )
}

const styles = {
  captchaContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "8px",
  },
  captchaQuestion: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "4px",
  },
  captchaDisplay: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  captchaText: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#111827",
    padding: "14px 24px",
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    border: "2px solid #d1d5db",
    letterSpacing: "6px",
    fontFamily: "Arial, Helvetica, sans-serif",
    textAlign: "center",
    minWidth: "180px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    userSelect: "none",
    display: "inline-block",
    lineHeight: "1.4",
  },
  refreshButton: {
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "20px",
    transition: "all 0.2s",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    padding: "12px",
    border: "2px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  successIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#4caf50",
    fontSize: "18px",
    fontWeight: "600",
  },
  errorText: {
    color: "#c62828",
    fontSize: "12px",
    marginTop: "-8px",
  },
  loading: {
    padding: "12px",
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
  },
  hint: {
    fontSize: "12px",
    color: "#666",
    margin: "0",
    fontStyle: "italic",
  },
}

