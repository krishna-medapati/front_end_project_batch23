"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Captcha from "../components/Captcha"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("student")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [captchaId, setCaptchaId] = useState(null)
  const [captchaAnswer, setCaptchaAnswer] = useState(null)
  const [captchaReset, setCaptchaReset] = useState(0)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    // Validate CAPTCHA
    if (!captchaVerified) {
      setError("Please complete the CAPTCHA verification")
      return
    }

    setLoading(true)

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"
      const payload = isLogin 
        ? { email, password, captchaId, captchaAnswer } 
        : { name, email, password, role, captchaId, captchaAnswer }

      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed")
        setLoading(false)
        return
      }

      login(data.user, data.token)
      setLoading(false)

        if (data.user.role === "admin") {
          navigate("/admin")
        } else {
          navigate("/student")
        }
    } catch (err) {
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setEmail("")
    setPassword("")
    setName("")
    setCaptchaVerified(false)
    setCaptchaId(null)
    setCaptchaAnswer(null)
    setCaptchaReset(prev => prev + 1)
  }

  const handleCaptchaVerify = (verified, id, answer) => {
    setCaptchaVerified(verified)
    setCaptchaId(id)
    setCaptchaAnswer(answer)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{isLogin ? "Login" : "Sign Up"}</h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
                <input
                  type="text"
              placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              style={styles.input}
              disabled={loading}
                  required
                />
          )}

              <input
                type="email"
            placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            disabled={loading}
                required
              />

              <input
            type="password"
            placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={loading}
                required
          />

          {!isLogin && (
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
              style={styles.input}
                  disabled={loading}
                >
                  <option value="student">Student</option>
              <option value="admin">Admin</option>
                </select>
          )}

          <Captcha 
            onVerify={handleCaptchaVerify} 
            resetTrigger={captchaReset}
          />

          <button 
            type="submit" 
            style={styles.button} 
            disabled={loading || !captchaVerified}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={styles.toggle}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={toggleMode} style={styles.link}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "24px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "12px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    padding: "12px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    borderRadius: "4px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  toggle: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    background: "none",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
    padding: 0,
  },
}
# Updated
