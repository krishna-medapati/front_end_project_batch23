"use client"

import { useState, useEffect } from "react"
import "../styles/components.css"

export default function EventManagement({ activities, token }) {
  const [formData, setFormData] = useState({
    activityId: "",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    pointsPerEvent: 10,
  })

  const [createdEvents, setCreatedEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (activities && activities.length > 0 && token) {
    fetchAllEvents()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities?.length, token])

  const fetchAllEvents = async () => {
    setIsRefreshing(true)
    try {
      const allEvents = []
      for (const activity of activities) {
        const response = await fetch(`http://localhost:5001/api/events/activity/${activity._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const events = await response.json()
          // Ensure attendees array is properly handled
          const processedEvents = events.map(event => {
            // Handle both populated (objects) and unpopulated (ObjectIds) attendees
            const attendeesArray = Array.isArray(event.attendees) ? event.attendees : []
            // Filter out null/undefined, but keep ObjectIds (strings or objects)
            const validAttendees = attendeesArray.filter(a => a !== null && a !== undefined)
            
            // Use attendeesCount from backend if available, otherwise calculate
            const attendeesCount = event.attendeesCount !== undefined 
              ? event.attendeesCount 
              : validAttendees.length
            
            return {
              ...event,
              attendees: validAttendees,
              attendeesCount: attendeesCount
            }
          })
          allEvents.push(...processedEvents)
        } else {
          console.error(`Failed to fetch events for activity ${activity._id}:`, response.statusText)
        }
      }
      setCreatedEvents(allEvents)
    } catch (error) {
      console.error("Error fetching events:", error)
      alert("Error refreshing events. Please try again.")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "pointsPerEvent" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          activityId: "",
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          capacity: "",
          pointsPerEvent: 10,
        })
        alert("Event created successfully")
        // Refresh events list to get updated data with populated attendees
        await fetchAllEvents()
      }
    } catch (error) {
      console.error("Error creating event:", error)
    }
  }

  const handleActivitySelect = (activityId) => {
    setFormData({
      ...formData,
      activityId: formData.activityId === activityId ? "" : activityId,
    })
  }

  const handleViewMembers = async (event) => {
    if (!event || !event._id) {
      console.error("Invalid event data:", event)
      alert("Unable to load event details. Please try again.")
      return
    }

    try {
      // Fetch the latest event data to ensure we have up-to-date attendees
      const response = await fetch(`http://localhost:5001/api/events/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const updatedEvent = await response.json()
        // Ensure attendees is always an array
        const processedEvent = {
          ...updatedEvent,
          attendees: Array.isArray(updatedEvent.attendees) ? updatedEvent.attendees : []
        }
        setSelectedEvent(processedEvent)
        setShowMembersModal(true)
      } else {
        // Fallback to the event data we already have
        const processedEvent = {
          ...event,
          attendees: Array.isArray(event.attendees) ? event.attendees : []
        }
        setSelectedEvent(processedEvent)
        setShowMembersModal(true)
      }
    } catch (error) {
      console.error("Error fetching event details:", error)
      // Fallback to the event data we already have
      const processedEvent = {
        ...event,
        attendees: Array.isArray(event.attendees) ? event.attendees : []
      }
      setSelectedEvent(processedEvent)
      setShowMembersModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowMembersModal(false)
    setSelectedEvent(null)
  }

  return (
    <div className="event-management-container">
      <div className="activities-selection-section">
        <h2>Select Activity</h2>
        <p className="section-description">Choose an activity to create an event for</p>
        {activities.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No activities available</p>
        ) : (
          <div className="activities-icons-grid">
            {activities.map((activity) => (
            <div
              key={activity._id}
              className={`activity-icon-card ${formData.activityId === activity._id ? "selected" : ""}`}
              onClick={() => handleActivitySelect(activity._id)}
            >
              <div className="activity-icon">
                <span className="icon-text">{activity.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="activity-name">{activity.name}</div>
            </div>
            ))}
          </div>
        )}
        </div>

      <div className="event-form-section">
        <h2>Create New Event</h2>
        {formData.activityId ? (
          <div className="selected-activity-info">
            Selected: <strong>{activities.find(a => a._id === formData.activityId)?.name}</strong>
          </div>
        ) : (
          <div className="no-activity-selected">
            Please select an activity above to create an event
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="activityId" value={formData.activityId} required />
        <div className="form-group">
          <label>Event Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Time</label>
            <input type="time" name="time" value={formData.time} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Capacity</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label>Points for Attendance</label>
            <input
              type="number"
              name="pointsPerEvent"
              value={formData.pointsPerEvent}
              onChange={handleInputChange}
              min="1"
            />
          </div>
        </div>

          <button type="submit" className="btn-primary" disabled={!formData.activityId}>
          Create Event
        </button>
      </form>
      </div>

      {createdEvents.length > 0 && (
        <div className="events-list-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Created Events</h2>
            <button 
              className="btn-refresh" 
              onClick={fetchAllEvents}
              disabled={isRefreshing}
              title="Refresh events list"
            >
              {isRefreshing ? "⏳ Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
          <div className="events-list-grid">
            {createdEvents.map((event) => {
              // Calculate the count to display
              const eventRegistrations = event.attendeesCount !== undefined 
                ? event.attendeesCount 
                : (Array.isArray(event.attendees) 
                    ? event.attendees.filter(a => a !== null && a !== undefined).length 
                    : 0)
              
              // Show activity enrollment if event has no registrations
              const activityEnrollment = event.activityEnrollmentCount || 0
              const displayCount = eventRegistrations > 0 ? eventRegistrations : activityEnrollment
              const isActivityEnrollment = eventRegistrations === 0 && activityEnrollment > 0
              
              return (
              <div key={event._id} className="event-card">
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="event-date">
                    {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                  </p>
                  <p className="event-location">{event.location}</p>
                  <p className="event-points">Points: {event.pointsPerEvent}</p>
                  <p className="event-capacity">Capacity: {event.capacity || "Unlimited"}</p>
                    <p className="event-registered" style={{ fontWeight: '600', color: '#4caf50', fontSize: '16px' }}>
                      {isActivityEnrollment ? (
                        <>
                          Activity Enrolled: <strong style={{ fontSize: '18px' }}>{displayCount}</strong>
                          <span style={{ fontSize: '12px', color: '#666', display: 'block', marginTop: '4px' }}>
                            (No event-specific registrations yet)
                          </span>
                        </>
                      ) : (
                        <>
                          Registered: <strong style={{ fontSize: '18px' }}>{displayCount}</strong>
                        </>
                      )}
                    </p>
                    <button
                      className="btn-view-members"
                      onClick={() => handleViewMembers(event)}
                    >
                      View {isActivityEnrollment ? 'Activity Members' : 'Registered Members'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showMembersModal && selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registered Members - {selectedEvent.title}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              {(() => {
                const eventAttendees = selectedEvent.attendees && Array.isArray(selectedEvent.attendees) 
                  ? selectedEvent.attendees.filter(a => a !== null && a !== undefined)
                  : []
                
                const activityEnrolled = selectedEvent.activityEnrolledStudents && Array.isArray(selectedEvent.activityEnrolledStudents)
                  ? selectedEvent.activityEnrolledStudents
                  : []
                
                const hasEventRegistrations = eventAttendees.length > 0
                const hasActivityEnrollment = activityEnrolled.length > 0
                
                if (hasEventRegistrations) {
                  // Show event-specific registrations
                  return (
                    <div className="members-list">
                      <p className="members-count">
                        Total Registered for Event: {eventAttendees.length}
                      </p>
                      <div className="members-table">
                        <div className="members-table-header">
                          <div className="member-col-name">Name</div>
                          <div className="member-col-email">Email</div>
                        </div>
                        {eventAttendees.map((attendee, index) => (
                          <div key={attendee._id || attendee || index} className="member-row">
                            <div className="member-col-name">
                              {attendee.name || (typeof attendee === 'string' ? 'User ID: ' + attendee : "Unknown")}
                            </div>
                            <div className="member-col-email">
                              {attendee.email || "N/A"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                } else if (hasActivityEnrollment) {
                  // Show activity-enrolled students (need to populate them)
                  return (
                    <div className="members-list">
                      <p className="members-count" style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                        No event-specific registrations. Showing students enrolled in the activity:
                      </p>
                      <p className="members-count">
                        Activity Enrollment: {selectedEvent.activityEnrollmentCount || activityEnrolled.length}
                      </p>
                      <div className="members-table">
                        <div className="members-table-header">
                          <div className="member-col-name">Name</div>
                          <div className="member-col-email">Email</div>
                        </div>
                        {activityEnrolled.map((studentId, index) => (
                          <div key={studentId._id || studentId || index} className="member-row">
                            <div className="member-col-name">
                              {studentId.name || (typeof studentId === 'string' ? 'User ID: ' + studentId : "Loading...")}
                            </div>
                            <div className="member-col-email">
                              {studentId.email || "N/A"}
                </div>
              </div>
            ))}
                      </div>
                      <p style={{ marginTop: '16px', padding: '12px', background: '#fff3cd', borderRadius: '6px', fontSize: '14px', color: '#856404' }}>
                        💡 Note: These students are enrolled in the activity but haven't registered for this specific event yet.
                      </p>
                    </div>
                  )
                } else {
                  return (
                    <p className="no-members">No members have registered for this event yet.</p>
                  )
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
