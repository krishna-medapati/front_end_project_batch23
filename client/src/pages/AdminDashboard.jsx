"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import ActivityManagement from "../components/ActivityManagement"
import EventManagement from "../components/EventManagement"
import AnalyticsDashboard from "../components/AnalyticsDashboard"
import AttendanceManagement from "../components/AttendanceManagement"
import "../styles/dashboard.css"

export default function AdminDashboard() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("")
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalEvents: 0,
    totalStudents: 0,
    totalEnrollments: 0
  })
  const { token, user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/")
    } else {
      fetchActivities()
    }
  }, [token])

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/activities", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setActivities(data)
      
      // Calculate statistics
      const totalEvents = data.reduce((sum, activity) => {
        return sum + (activity.upcomingEvents?.length || 0)
      }, 0)
      
      const totalEnrollments = data.reduce((sum, activity) => {
        return sum + (activity.enrolledStudents?.length || 0)
      }, 0)
      
      setStats({
        totalActivities: data.length,
        totalEvents,
        totalStudents: new Set(data.flatMap(a => a.enrolledStudents?.map(s => s._id) || [])).size,
        totalEnrollments
      })
      
      setLoading(false)
    } catch (error) {
      console.error("Error fetching activities:", error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="header-text">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, <strong>{user?.name || "Administrator"}</strong>!</p>
          </div>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <button className="btn-logout" onClick={handleLogout} title="Sign out">
              <span className="btn-text">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="admin-stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Activities</span>
            </div>
            <div className="stat-body">
              <span className="stat-value">{stats.totalActivities}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Events</span>
            </div>
            <div className="stat-body">
              <span className="stat-value">{stats.totalEvents}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Active Students</span>
            </div>
            <div className="stat-body">
              <span className="stat-value">{stats.totalStudents}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Enrollments</span>
            </div>
            <div className="stat-body">
              <span className="stat-value">{stats.totalEnrollments}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-options-container">
        <div className="admin-options-select">
          <label htmlFor="admin-option-select" className="options-label">Select an option:</label>
          <select
            id="admin-option-select"
            className="admin-option-select"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
        >
            <option value="">-- Select an option --</option>
            <option value="activities">Manage Activities</option>
            <option value="events">Manage Events</option>
            <option value="analytics">Analytics</option>
            <option value="attendance">Attendance</option>
          </select>
        </div>
      </div>

      {activeTab && (
      <div className="admin-content">
        {activeTab === "activities" && (
          <ActivityManagement activities={activities} onActivityChange={fetchActivities} token={token} />
        )}
        {activeTab === "events" && <EventManagement activities={activities} token={token} />}
        {activeTab === "analytics" && <AnalyticsDashboard activities={activities} token={token} />}
        {activeTab === "attendance" && <AttendanceManagement activities={activities} token={token} />}
      </div>
      )}
    </div>
  )
}
