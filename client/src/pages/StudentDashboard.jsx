"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import ActivityCard from "../components/ActivityCard"
import NotificationPanel from "../components/NotificationPanel"
import RecommendationsSection from "../components/RecommendationsSection"
import PointsDisplay from "../components/PointsDisplay"
import "../styles/dashboard.css"

export default function StudentDashboard() {
  const [activities, setActivities] = useState([])
  const [enrolledActivities, setEnrolledActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [events, setEvents] = useState([])
  const [studentPoints, setStudentPoints] = useState(0)
  const { token, user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/")
    } else {
      fetchActivities()
      fetchUserPoints()
    }
  }, [token])

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/activities", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setActivities(data)
      setEnrolledActivities(data.filter((a) => a.enrolledStudents.some((s) => s._id === user.id)))

      const allEvents = []
      for (const activity of data) {
        if (activity.upcomingEvents && activity.upcomingEvents.length > 0) {
          allEvents.push(...activity.upcomingEvents)
        }
      }
      setEvents(allEvents)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching activities:", error)
      setLoading(false)
    }
  }

  const fetchUserPoints = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setStudentPoints(Number(data.points) || 0)
    } catch (error) {
      console.error("Error fetching user points:", error)
    }
  }

  const handleRegister = async (activityId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/activities/${activityId}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchActivities()
      }
    } catch (error) {
      console.error("Error registering:", error)
    }
  }

  const handleUnregister = async (activityId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/activities/${activityId}/unregister`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchActivities()
      }
    } catch (error) {
      console.error("Error unregistering:", error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  useEffect(() => {
    if (token && user?.id) {
      fetchUserPoints()
      const interval = setInterval(fetchUserPoints, 30000)
      return () => clearInterval(interval)
    }
  }, [token, user?.id])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    )
  }

  const displayedActivities = filter === "enrolled" ? enrolledActivities : activities

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="header-icon">🎓</div>
          <div className="header-text">
            <h1>Student Dashboard</h1>
            <p>Welcome back, <strong>{user?.name || "Student"}</strong>! 👋</p>
          </div>
        </div>
        <div className="header-right">
          <PointsDisplay points={studentPoints} userRole="student" />
          <div className="header-actions">
            <NotificationPanel token={token} />
            <button className="btn-logout" onClick={handleLogout} title="Sign out">
              <span className="btn-icon">🚪</span>
              <span className="btn-text">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {user?.id && (
        <RecommendationsSection userId={user.id} token={token} onRegister={handleRegister} />
        )}

        <div className="activities-section">
          <div className="section-header">
            <h2>
              <span className="section-icon">🎯</span>
              Activities
            </h2>
            <p className="section-subtitle">
              {filter === "all" 
                ? `Browse ${activities.length} available activity${activities.length !== 1 ? "ies" : "y"}`
                : `You're enrolled in ${enrolledActivities.length} activit${enrolledActivities.length !== 1 ? "ies" : "y"}`}
            </p>
          </div>
          <div className="filter-buttons">
            <button 
              className={`btn filter-btn ${filter === "all" ? "active" : ""}`} 
              onClick={() => setFilter("all")}
            >
              <span className="filter-icon">📚</span>
              All Activities
            </button>
            <button 
              className={`btn filter-btn ${filter === "enrolled" ? "active" : ""}`} 
              onClick={() => setFilter("enrolled")}
            >
              <span className="filter-icon">⭐</span>
              My Activities
            </button>
          </div>

          {displayedActivities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No activities found</h3>
              <p>
                {filter === "enrolled" 
                  ? "You haven't enrolled in any activities yet. Browse all activities to get started!"
                  : "No activities are available at the moment. Check back later!"}
              </p>
            </div>
          ) : (
            <div className="activities-grid">
              {displayedActivities.map((activity) => (
                <ActivityCard
                  key={activity._id}
                  activity={activity}
                  isEnrolled={enrolledActivities.some((a) => a._id === activity._id)}
                  onRegister={() => handleRegister(activity._id)}
                  onUnregister={() => handleUnregister(activity._id)}
                  userRole="student"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
