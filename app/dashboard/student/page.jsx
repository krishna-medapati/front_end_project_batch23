"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/app/config"

// Translation objects
const translations = {
  English: {
    studentDashboard: "Student Dashboard",
    logout: "Logout",
    notifications: "Notifications",
    myProfile: "My Profile",
    myActivities: "My Activities",
    myPointsHistory: "My Points History",
    settings: "Settings",
    welcome: "Welcome",
    email: "Email",
    role: "Role",
    totalPoints: "Total Points",
    availableActivities: "Available Activities",
    myEnrolledActivities: "My Enrolled Activities",
    noActivitiesAvailable: "No activities available",
    enrolled: "enrolled",
    points: "points",
    register: "Register",
    full: "Full",
    pointsPerEvent: "points per event",
    notEnrolledYet: "You haven't enrolled in any activities yet",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    uploadPhoto: "Upload Photo",
    name: "Name",
    emailPrimary: "Email (Primary)",
    primaryEmailNote: "Primary email cannot be changed",
    alternativeEmail: "Alternative Email",
    enterAlternativeEmail: "Enter alternative email",
    phoneNumber: "Phone Number",
    enterPhoneNumber: "Enter phone number",
    notProvided: "Not provided",
    backToDashboard: "Back to Dashboard",
    recentActivity: "Recent Activity",
    noPointsHistory: "No points history yet. Attend events to earn points!",
    accountSettings: "Account Settings",
    darkMode: "Dark Mode",
    on: "ON",
    off: "OFF",
    emailNotifications: "Email Notifications",
    enabled: "Enabled",
    language: "Language",
    moreSettingsSoon: "More settings coming soon...",
    profileUpdatedSuccess: "Profile updated successfully!",
    failedToUpdate: "Failed to update profile",
    student: "student",
    admin: "admin",
  },
  తెలుగు: {
    studentDashboard: "విద్యార్థి డాష్‌బోర్డ్",
    logout: "లాగ్అవుట్",
    notifications: "నోటిఫికేషన్‌లు",
    myProfile: "నా ప్రొఫైల్",
    myActivities: "నా కార్యకలాపాలు",
    myPointsHistory: "నా పాయింట్ల చరిత్ర",
    settings: "సెట్టింగ్‌లు",
    welcome: "స్వాగతం",
    email: "ఇమెయిల్",
    role: "పాత్ర",
    totalPoints: "మొత్తం పాయింట్లు",
    availableActivities: "అందుబాటులో ఉన్న కార్యకలాపాలు",
    myEnrolledActivities: "నా నమోదు చేసుకున్న కార్యకలాపాలు",
    noActivitiesAvailable: "కార్యకలాపాలు అందుబాటులో లేవు",
    enrolled: "నమోదు చేసుకున్నారు",
    points: "పాయింట్లు",
    register: "నమోదు చేసుకోండి",
    full: "నిండింది",
    pointsPerEvent: "ఈవెంట్‌కు పాయింట్లు",
    notEnrolledYet: "మీరు ఇంకా ఏ కార్యకలాపాలలో నమోదు చేసుకోలేదు",
    editProfile: "ప్రొఫైల్ సవరించండి",
    saveChanges: "మార్పులను సేవ్ చేయండి",
    cancel: "రద్దు చేయండి",
    uploadPhoto: "ఫోటో అప్‌లోడ్ చేయండి",
    name: "పేరు",
    emailPrimary: "ఇమెయిల్ (ప్రాథమిక)",
    primaryEmailNote: "ప్రాథమిక ఇమెయిల్ మార్చలేము",
    alternativeEmail: "ప్రత్యామ్నాయ ఇమెయిల్",
    enterAlternativeEmail: "ప్రత్యామ్నాయ ఇమెయిల్ నమోదు చేయండి",
    phoneNumber: "ఫోన్ నంబర్",
    enterPhoneNumber: "ఫోన్ నంబర్ నమోదు చేయండి",
    notProvided: "అందించలేదు",
    backToDashboard: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్ళండి",
    recentActivity: "ఇటీవలి కార్యకలాపం",
    noPointsHistory: "పాయింట్ల చరిత్ర లేదు. పాయింట్లు సంపాదించడానికి ఈవెంట్‌లకు హాజరు కండి!",
    accountSettings: "ఖాతా సెట్టింగ్‌లు",
    darkMode: "డార్క్ మోడ్",
    on: "ఆన్",
    off: "ఆఫ్",
    emailNotifications: "ఇమెయిల్ నోటిఫికేషన్‌లు",
    enabled: "ప్రారంభించబడింది",
    language: "భాష",
    moreSettingsSoon: "మరిన్ని సెట్టింగ్‌లు త్వరలో వస్తాయి...",
    profileUpdatedSuccess: "ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది!",
    failedToUpdate: "ప్రొఫైల్ నవీకరించడం విఫలమైంది",
    student: "విద్యార్థి",
    admin: "అడ్మిన్",
  },
  हिन्दी: {
    studentDashboard: "छात्र डैशबोर्ड",
    logout: "लॉगआउट",
    notifications: "सूचनाएं",
    myProfile: "मेरी प्रोफ़ाइल",
    myActivities: "मेरी गतिविधियां",
    myPointsHistory: "मेरे अंकों का इतिहास",
    settings: "सेटिंग्स",
    welcome: "स्वागत है",
    email: "ईमेल",
    role: "भूमिका",
    totalPoints: "कुल अंक",
    availableActivities: "उपलब्ध गतिविधियां",
    myEnrolledActivities: "मेरी नामांकित गतिविधियां",
    noActivitiesAvailable: "कोई गतिविधियां उपलब्ध नहीं हैं",
    enrolled: "नामांकित",
    points: "अंक",
    register: "पंजीकरण करें",
    full: "भरा हुआ",
    pointsPerEvent: "प्रति कार्यक्रम अंक",
    notEnrolledYet: "आपने अभी तक किसी गतिविधि में नामांकन नहीं किया है",
    editProfile: "प्रोफ़ाइल संपादित करें",
    saveChanges: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    uploadPhoto: "फ़ोटो अपलोड करें",
    name: "नाम",
    emailPrimary: "ईमेल (प्राथमिक)",
    primaryEmailNote: "प्राथमिक ईमेल नहीं बदला जा सकता",
    alternativeEmail: "वैकल्पिक ईमेल",
    enterAlternativeEmail: "वैकल्पिक ईमेल दर्ज करें",
    phoneNumber: "फ़ोन नंबर",
    enterPhoneNumber: "फ़ोन नंबर दर्ज करें",
    notProvided: "प्रदान नहीं किया गया",
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    recentActivity: "हाल की गतिविधि",
    noPointsHistory: "अभी तक कोई अंक इतिहास नहीं है। अंक अर्जित करने के लिए कार्यक्रमों में भाग लें!",
    accountSettings: "खाता सेटिंग्स",
    darkMode: "डार्क मोड",
    on: "चालू",
    off: "बंद",
    emailNotifications: "ईमेल सूचनाएं",
    enabled: "सक्षम",
    language: "भाषा",
    moreSettingsSoon: "और सेटिंग्स जल्द ही आ रही हैं...",
    profileUpdatedSuccess: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!",
    failedToUpdate: "प्रोफ़ाइल अपडेट करने में विफल",
    student: "छात्र",
    admin: "प्रशासक",
  },
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activities, setActivities] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("activities")
  const [showNotifications, setShowNotifications] = useState(false)
  const [hasNewNotifications, setHasNewNotifications] = useState(true) // Set to true to show red dot
  const [showMenu, setShowMenu] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard") // dashboard, profile, myActivities, pointsHistory, settings
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    alternativeEmail: "",
    profilePicture: null,
  })
  const [profilePicturePreview, setProfilePicturePreview] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("English")
  const [emailNotifications, setEmailNotifications] = useState(true)

  // Helper function to get translations
  const t = (key) => translations[language][key] || translations.English[key]

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme === "true") {
      setDarkMode(true)
    }
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    // Load email notification preference from localStorage
    const savedEmailNotif = localStorage.getItem("emailNotifications")
    if (savedEmailNotif !== null) {
      setEmailNotifications(savedEmailNotif === "true")
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "student") {
      router.push("/dashboard/admin")
      return
    }

    setUser(parsedUser)
    setProfileData({
      name: parsedUser.name || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
      alternativeEmail: parsedUser.alternativeEmail || "",
      profilePicture: parsedUser.profilePicture || null,
    })
    setProfilePicturePreview(parsedUser.profilePicture || null)
    fetchData(token, parsedUser)
  }, [router])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", newMode.toString())
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const toggleEmailNotifications = async () => {
    const newValue = !emailNotifications
    setEmailNotifications(newValue)
    localStorage.setItem("emailNotifications", newValue.toString())
    
    // Update in backend
    try {
      const token = localStorage.getItem("token")
      const userId = user.id || user._id
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/notifications`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailNotifications: newValue }),
      })
      
      if (response.ok) {
        console.log("Email notification preference updated")
      }
    } catch (error) {
      console.error("Failed to update notification preference:", error)
    }
  }

  const fetchData = async (token, userData) => {
    try {
      // Fetch all activities
      const activitiesRes = await fetch(`${API_BASE_URL}/api/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const activitiesData = await activitiesRes.json()
      setActivities(activitiesData)

      // Fetch user details to get enrolled activities and points
      const userRes = await fetch(`${API_BASE_URL}/api/users/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const userDetails = await userRes.json()
      setUser({ ...userData, ...userDetails })

      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  const registerForActivity = async (activityId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/activities/${activityId}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      if (response.ok) {
        alert("Successfully registered for activity!")
        fetchData(token, user)
      } else {
        alert(data.message || "Failed to register")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to register for activity")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result)
        setProfileData({ ...profileData, profilePicture: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const saveProfileChanges = async () => {
    console.log("💾 saveProfileChanges called")
    console.log("User object:", user)
    console.log("Profile data:", profileData)
    
    try {
      const token = localStorage.getItem("token")
      // Use _id if id doesn't exist (MongoDB uses _id)
      const userId = user.id || user._id
      console.log("Saving profile for user ID:", userId)
      console.log("Token:", token ? "exists" : "missing")
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      console.log("Response status:", response.status)
      
      if (response.ok) {
        const updatedUser = await response.json()
        console.log("✅ Profile updated:", updatedUser)
        const mergedUser = { ...user, ...updatedUser }
        setUser(mergedUser)
        localStorage.setItem("user", JSON.stringify(mergedUser))
        setIsEditingProfile(false)
        alert(t("profileUpdatedSuccess"))
      } else {
        const data = await response.json()
        console.log("❌ Update failed:", data)
        alert(data.message || t("failedToUpdate"))
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error)
      alert(t("failedToUpdate") + ": " + error.message)
    }
  }

  const cancelProfileEdit = () => {
    setProfileData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      alternativeEmail: user.alternativeEmail || "",
      profilePicture: user.profilePicture || null,
    })
    setProfilePicturePreview(user.profilePicture || null)
    setIsEditingProfile(false)
  }

  if (!user || loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={darkMode ? { ...styles.container, ...styles.darkContainer } : styles.container}>
      <nav style={darkMode ? { ...styles.nav, ...styles.darkNav } : styles.nav}>
        <div style={styles.navLeft}>
          <button 
            style={styles.menuBtn} 
            onClick={() => setShowMenu(!showMenu)}
          >
            <div style={styles.menuIcon}>
              <div style={styles.menuLine}></div>
              <div style={styles.menuLine}></div>
              <div style={styles.menuLine}></div>
            </div>
          </button>
          <h1 style={styles.navTitle}>{t("studentDashboard")}</h1>
        </div>
        <div style={styles.navRight}>
          <button 
            style={styles.notificationBtn} 
            onClick={() => {
              setShowNotifications(!showNotifications)
              setHasNewNotifications(false) // Mark as read when clicked
            }}
          >
            <span style={styles.bellIcon}>🔔</span>
            {hasNewNotifications && <span style={styles.redDot}></span>}
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            {t("logout")}
          </button>
        </div>
      </nav>

      {showMenu && (
        <div style={darkMode ? { ...styles.menuDropdown, ...styles.darkMenuDropdown } : styles.menuDropdown}>
          <div style={styles.menuHeader}>
            <div style={styles.userAvatar}>{user.name?.charAt(0) || "U"}</div>
            <div>
              <p style={styles.menuUserName}>{user.name}</p>
              <p style={styles.menuUserEmail}>{user.email}</p>
            </div>
          </div>
          <div style={styles.menuDivider}></div>
          <button style={styles.menuItem} onClick={() => {
            setActiveSection("profile")
            setShowMenu(false)
          }}>
            👤 {t("myProfile")}
          </button>
          <button style={styles.menuItem} onClick={() => {
            setActiveSection("myActivities")
            setShowMenu(false)
          }}>
            🎯 {t("myActivities")}
          </button>
          <button style={styles.menuItem} onClick={() => {
            setActiveSection("pointsHistory")
            setShowMenu(false)
          }}>
            📊 {t("myPointsHistory")}
          </button>
          <button style={styles.menuItem} onClick={() => {
            setActiveSection("settings")
            setShowMenu(false)
          }}>
            ⚙️ {t("settings")}
          </button>
          <div style={styles.menuDivider}></div>
          <button style={styles.menuItem} onClick={() => {
            setShowMenu(false)
            handleLogout()
          }}>
            🚪 {t("logout")}
          </button>
        </div>
      )}

      {showNotifications && (
        <div style={darkMode ? { ...styles.notificationPanel, ...styles.darkNotificationPanel } : styles.notificationPanel}>
          <div style={styles.notificationHeader}>
            <h3 style={styles.notificationTitle}>{t("notifications")}</h3>
            <button style={styles.closeNotificationBtn} onClick={() => setShowNotifications(false)}>
              ✕
            </button>
          </div>
          <div style={styles.notificationsList}>
            <div style={styles.notificationItem}>
              <p style={styles.notificationText}>
                <strong>Welcome!</strong> You have successfully enrolled in the student activity system.
              </p>
              <p style={styles.notificationTime}>Just now</p>
            </div>
            <div style={styles.notificationItem}>
              <p style={styles.notificationText}>
                <strong>New Activity Available:</strong> Check out the latest activities and register now!
              </p>
              <p style={styles.notificationTime}>2 hours ago</p>
            </div>
            <div style={styles.emptyNotification}>
              <p>More notifications coming soon...</p>
            </div>
          </div>
        </div>
      )}

      <div style={styles.content}>
        {activeSection === "dashboard" && (
          <>
            <div style={darkMode ? { ...styles.card, ...styles.darkCard } : styles.card}>
              <h2 style={darkMode ? { ...styles.welcomeTitle, color: "#f9fafb" } : styles.welcomeTitle}>{t("welcome")}, {user.name}!</h2>
              <p style={darkMode ? { ...styles.userInfo, color: "#d1d5db" } : styles.userInfo}>{t("email")}: {user.email}</p>
              <p style={darkMode ? { ...styles.userInfo, color: "#d1d5db" } : styles.userInfo}>{t("role")}: {t(user.role)}</p>
              <div style={styles.pointsBadge}>
                <span style={styles.pointsLabel}>{t("totalPoints")}:</span>
                <span style={styles.pointsValue}>{user.points || 0}</span>
              </div>
            </div>

            <div style={styles.tabs}>
              <button
                style={activeTab === "activities" ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab("activities")}
              >
                📅 {t("availableActivities")}
              </button>
              <button
                style={activeTab === "myActivities" ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab("myActivities")}
              >
                📚 {t("myEnrolledActivities")}
              </button>
            </div>

        {activeTab === "activities" && (
          <div style={styles.activitiesGrid}>
            {activities.length === 0 ? (
              <p style={styles.emptyState}>{t("noActivitiesAvailable")}</p>
            ) : (
              activities.map((activity) => {
                const isEnrolled = user.enrolledActivities?.some(
                  (a) => a._id === activity._id || a === activity._id
                )
                return (
                  <div key={activity._id} style={darkMode ? { ...styles.activityCard, ...styles.darkActivityCard } : styles.activityCard}>
                    <h3 style={darkMode ? { ...styles.activityTitle, color: "#f9fafb" } : styles.activityTitle}>{activity.name}</h3>
                    <p style={darkMode ? { ...styles.activityDesc, color: "#d1d5db" } : styles.activityDesc}>{activity.description}</p>
                    <div style={styles.activityMeta}>
                      <span style={styles.badge}>{activity.category}</span>
                      <span style={darkMode ? { ...styles.metaText, color: "#d1d5db" } : styles.metaText}>
                        {activity.currentEnrollment}/{activity.maxCapacity} {t("enrolled")}
                      </span>
                    </div>
                    <div style={styles.activityFooter}>
                      <span style={styles.points}>+{activity.pointsPerAttendance} {t("points")}</span>
                      {isEnrolled ? (
                        <button style={styles.enrolledBtn} disabled>
                          ✓ {t("enrolled")}
                        </button>
                      ) : (
                        <button
                          style={styles.registerBtn}
                          onClick={() => registerForActivity(activity._id)}
                          disabled={activity.currentEnrollment >= activity.maxCapacity}
                        >
                          {activity.currentEnrollment >= activity.maxCapacity
                            ? t("full")
                            : t("register")}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === "myActivities" && (
          <div style={styles.activitiesGrid}>
            {!user.enrolledActivities || user.enrolledActivities.length === 0 ? (
              <p style={styles.emptyState}>{t("notEnrolledYet")}</p>
            ) : (
              user.enrolledActivities.map((activity) => (
                <div key={activity._id} style={darkMode ? { ...styles.activityCard, ...styles.darkActivityCard } : styles.activityCard}>
                  <h3 style={darkMode ? { ...styles.activityTitle, color: "#f9fafb" } : styles.activityTitle}>{activity.name}</h3>
                  <p style={darkMode ? { ...styles.activityDesc, color: "#d1d5db" } : styles.activityDesc}>{activity.category}</p>
                  <div style={styles.activityFooter}>
                    <span style={styles.points}>+{activity.pointsPerAttendance || 10} {t("pointsPerEvent")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        </>
        )}

        {activeSection === "profile" && (
          <div style={darkMode ? { ...styles.card, ...styles.darkCard } : styles.card}>
            <div style={darkMode ? { ...styles.profileHeader, ...styles.darkHeader } : styles.profileHeader}>
              <h2 style={darkMode ? { ...styles.sectionTitle, color: "#f9fafb" } : styles.sectionTitle}>{t("myProfile")}</h2>
              {!isEditingProfile ? (
                <button style={styles.editBtn} onClick={() => setIsEditingProfile(true)}>
                  ✏️ {t("editProfile")}
                </button>
              ) : (
                <div style={styles.editBtnGroup}>
                  <button style={styles.saveBtn} onClick={saveProfileChanges}>
                    ✓ {t("saveChanges")}
                  </button>
                  <button style={styles.cancelBtn} onClick={cancelProfileEdit}>
                    ✕ {t("cancel")}
                  </button>
                </div>
              )}
            </div>

            <div style={styles.profileSection}>
              {/* Profile Picture Section */}
              <div style={styles.profilePictureSection}>
                {profilePicturePreview ? (
                  <img 
                    src={profilePicturePreview} 
                    alt="Profile" 
                    style={styles.profilePictureImg}
                  />
                ) : (
                  <div style={styles.profileAvatar}>{profileData.name?.charAt(0) || "U"}</div>
                )}
                {isEditingProfile && (
                  <div style={styles.uploadBtnWrapper}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={styles.fileInput}
                      id="profilePictureInput"
                    />
                    <label htmlFor="profilePictureInput" style={styles.uploadBtn}>
                      📷 {t("uploadPhoto")}
                    </label>
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div style={styles.profileInfo}>
                {/* Name */}
                <div style={styles.profileField}>
                  <p style={darkMode ? { ...styles.profileLabel, color: "#9ca3af" } : styles.profileLabel}>{t("name")}:</p>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      style={darkMode ? { ...styles.profileInput, backgroundColor: "#374151", color: "#f9fafb", borderColor: "#4b5563" } : styles.profileInput}
                    />
                  ) : (
                    <p style={darkMode ? { ...styles.profileValue, color: "#f9fafb" } : styles.profileValue}>{user.name}</p>
                  )}
                </div>

                {/* Email (Primary - Read Only) */}
                <div style={styles.profileField}>
                  <p style={darkMode ? { ...styles.profileLabel, color: "#9ca3af" } : styles.profileLabel}>{t("emailPrimary")}:</p>
                  <p style={darkMode ? { ...styles.profileValue, color: "#f9fafb" } : styles.profileValue}>{user.email}</p>
                  {isEditingProfile && <p style={styles.helpText}>{t("primaryEmailNote")}</p>}
                </div>

                {/* Alternative Email */}
                <div style={styles.profileField}>
                  <p style={darkMode ? { ...styles.profileLabel, color: "#9ca3af" } : styles.profileLabel}>{t("alternativeEmail")}:</p>
                  {isEditingProfile ? (
                    <input
                      type="email"
                      value={profileData.alternativeEmail}
                      onChange={(e) => setProfileData({ ...profileData, alternativeEmail: e.target.value })}
                      style={darkMode ? { ...styles.profileInput, backgroundColor: "#374151", color: "#f9fafb", borderColor: "#4b5563" } : styles.profileInput}
                      placeholder={t("enterAlternativeEmail")}
                    />
                  ) : (
                    <p style={darkMode ? { ...styles.profileValue, color: "#f9fafb" } : styles.profileValue}>{user.alternativeEmail || t("notProvided")}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div style={styles.profileField}>
                  <p style={darkMode ? { ...styles.profileLabel, color: "#9ca3af" } : styles.profileLabel}>{t("phoneNumber")}:</p>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      style={darkMode ? { ...styles.profileInput, backgroundColor: "#374151", color: "#f9fafb", borderColor: "#4b5563" } : styles.profileInput}
                      placeholder={t("enterPhoneNumber")}
                    />
                  ) : (
                    <p style={darkMode ? { ...styles.profileValue, color: "#f9fafb" } : styles.profileValue}>{user.phone || t("notProvided")}</p>
                  )}
                </div>

                {/* Role (Read Only) */}
                <div style={styles.profileField}>
                  <p style={darkMode ? { ...styles.profileLabel, color: "#9ca3af" } : styles.profileLabel}>{t("role")}:</p>
                  <p style={darkMode ? { ...styles.profileValue, color: "#f9fafb" } : styles.profileValue}>{t(user.role)}</p>
                </div>

                {/* Total Points (Read Only) */}
                <div style={styles.profileField}>
                  <p style={darkMode ? { ...styles.profileLabel, color: "#9ca3af" } : styles.profileLabel}>{t("totalPoints")}:</p>
                  <p style={darkMode ? { ...styles.profileValue, color: "#f9fafb" } : styles.profileValue}>{user.points || 0} {t("points")}</p>
                </div>
              </div>
            </div>

            <button style={styles.backBtn} onClick={() => {
              setActiveSection("dashboard")
              setIsEditingProfile(false)
            }}>
              ← {t("backToDashboard")}
            </button>
          </div>
        )}

        {activeSection === "myActivities" && (
          <div>
            <div style={darkMode ? { ...styles.header, ...styles.darkHeader } : styles.header}>
              <h2 style={styles.sectionTitle}>{t("myEnrolledActivities")}</h2>
              <button style={styles.backBtn} onClick={() => setActiveSection("dashboard")}>
                ← {t("backToDashboard")}
              </button>
            </div>
            <div style={darkMode ? { ...styles.activitiesGrid, ...styles.darkActivitiesGrid } : styles.activitiesGrid}>
              {!user.enrolledActivities || user.enrolledActivities.length === 0 ? (
                <p style={styles.emptyState}>You haven't enrolled in any activities yet</p>
              ) : (
                user.enrolledActivities.map((activity) => (
                  <div key={activity._id} style={darkMode ? { ...styles.activityCard, ...styles.darkActivityCard } : styles.activityCard}>
                    <h3 style={darkMode ? { ...styles.activityTitle, color: "#f9fafb" } : styles.activityTitle}>{activity.name}</h3>
                    <p style={darkMode ? { ...styles.activityDesc, color: "#d1d5db" } : styles.activityDesc}>{activity.category}</p>
                    <div style={styles.activityFooter}>
                      <span style={styles.points}>+{activity.pointsPerAttendance || 10} points per event</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeSection === "pointsHistory" && (
          <div>
            <div style={darkMode ? { ...styles.header, ...styles.darkHeader } : styles.header}>
              <h2 style={styles.sectionTitle}>{t("myPointsHistory")}</h2>
              <button style={styles.backBtn} onClick={() => setActiveSection("dashboard")}>
                ← {t("backToDashboard")}
              </button>
            </div>
            <div style={styles.card}>
              <div style={styles.pointsSummary}>
                <h3 style={styles.totalPoints}>{t("totalPoints")}: {user.points || 0}</h3>
              </div>
              <h3 style={styles.historyTitle}>{t("recentActivity")}</h3>
              {!user.attendanceRecords || user.attendanceRecords.length === 0 ? (
                <p style={styles.emptyState}>{t("noPointsHistory")}</p>
              ) : (
                user.attendanceRecords.map((record, index) => (
                  <div key={index} style={styles.historyItem}>
                    <div>
                      <p style={styles.historyEvent}>{record.activityId?.name || "Event"}</p>
                      <p style={styles.historyDate}>{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                    <p style={styles.historyPoints}>+{record.pointsEarned || 0} pts</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeSection === "settings" && (
          <div>
            <div style={darkMode ? { ...styles.header, ...styles.darkHeader } : styles.header}>
              <h2 style={styles.sectionTitle}>{t("settings")}</h2>
              <button style={styles.backBtn} onClick={() => setActiveSection("dashboard")}>
                ← {t("backToDashboard")}
              </button>
            </div>
            <div style={darkMode ? { ...styles.card, ...styles.darkCard } : styles.card}>
              <h3 style={styles.settingTitle}>{t("accountSettings")}</h3>
              
              {/* Dark Mode Toggle */}
              <div style={styles.settingItem}>
                <p style={styles.settingLabel}>🌙 {t("darkMode")}</p>
                <button 
                  onClick={toggleDarkMode}
                  style={darkMode ? styles.toggleBtnActive : styles.toggleBtn}
                >
                  {darkMode ? t("on") : t("off")}
                </button>
              </div>
              
              <div style={styles.settingItem}>
                <p style={styles.settingLabel}>📧 {t("emailNotifications")}</p>
                <button 
                  onClick={toggleEmailNotifications}
                  style={emailNotifications ? styles.toggleBtnActive : styles.toggleBtn}
                >
                  {emailNotifications ? t("on") : t("off")}
                </button>
              </div>
              
              <div style={styles.settingItem}>
                <p style={styles.settingLabel}>🌐 {t("language")}</p>
                <select 
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  style={darkMode ? { ...styles.languageSelect, backgroundColor: "#374151", color: "#f9fafb", borderColor: "#4b5563" } : styles.languageSelect}
                >
                  <option value="English">English</option>
                  <option value="తెలుగు">తెలుగు (Telugu)</option>
                  <option value="हिन्दी">हिन्दी (Hindi)</option>
                </select>
              </div>
              <p style={styles.emptyState}>{t("moreSettingsSoon")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  nav: {
    backgroundColor: "#6b7280",
    color: "white",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  menuBtn: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  menuLine: {
    width: "24px",
    height: "3px",
    backgroundColor: "white",
    borderRadius: "2px",
  },
  navTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  notificationBtn: {
    position: "relative",
    padding: "10px 12px",
    backgroundColor: "transparent",
    border: "2px solid white",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
  },
  bellIcon: {
    fontSize: "20px",
  },
  redDot: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "10px",
    height: "10px",
    backgroundColor: "#ef4444",
    borderRadius: "50%",
    border: "2px solid #6b7280",
  },
  logoutBtn: {
    padding: "10px 20px",
    backgroundColor: "white",
    color: "#6b7280",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  content: {
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#333",
  },
  userInfo: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "8px",
  },
  pointsBadge: {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "#f0fdf4",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  pointsLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#166534",
  },
  pointsValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#16a34a",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "24px",
    borderBottom: "2px solid #e5e7eb",
  },
  tab: {
    padding: "12px 24px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    fontSize: "16px",
    fontWeight: "500",
    color: "#666",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    padding: "12px 24px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid #6b7280",
    fontSize: "16px",
    fontWeight: "600",
    color: "#6b7280",
    cursor: "pointer",
  },
  activitiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  activityCard: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  activityTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#333",
  },
  activityDesc: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "16px",
    lineHeight: "1.5",
  },
  activityMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  badge: {
    padding: "4px 12px",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  metaText: {
    fontSize: "13px",
    color: "#666",
  },
  activityFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
  points: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#16a34a",
  },
  registerBtn: {
    padding: "8px 16px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  enrolledBtn: {
    padding: "8px 16px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#999",
    fontSize: "16px",
    gridColumn: "1 / -1",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontSize: "18px",
    color: "#666",
  },
  notificationPanel: {
    position: "fixed",
    top: "70px",
    right: "20px",
    width: "360px",
    maxHeight: "500px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    overflow: "hidden",
  },
  notificationHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  notificationTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0,
    color: "#111827",
  },
  closeNotificationBtn: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#6b7280",
    padding: "4px 8px",
  },
  notificationsList: {
    maxHeight: "420px",
    overflowY: "auto",
  },
  notificationItem: {
    padding: "16px 20px",
    borderBottom: "1px solid #f3f4f6",
    transition: "background-color 0.2s",
    cursor: "pointer",
  },
  notificationText: {
    fontSize: "14px",
    color: "#374151",
    margin: "0 0 8px 0",
    lineHeight: "1.5",
  },
  notificationTime: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: 0,
  },
  emptyNotification: {
    padding: "24px 20px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "14px",
  },
  menuDropdown: {
    position: "fixed",
    top: "70px",
    left: "20px",
    width: "280px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    overflow: "hidden",
  },
  menuHeader: {
    padding: "20px",
    backgroundColor: "#f9fafb",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#6b7280",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
  menuUserName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  menuUserEmail: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },
  menuDivider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "8px 0",
  },
  menuItem: {
    width: "100%",
    padding: "14px 20px",
    backgroundColor: "transparent",
    border: "none",
    textAlign: "left",
    fontSize: "15px",
    color: "#374151",
    cursor: "pointer",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "24px",
    color: "#111827",
  },
  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  editBtn: {
    padding: "10px 20px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  editBtnGroup: {
    display: "flex",
    gap: "12px",
  },
  saveBtn: {
    padding: "10px 20px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  profileSection: {
    display: "flex",
    gap: "32px",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  profilePictureSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  profileAvatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#6b7280",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    fontWeight: "bold",
    flexShrink: 0,
  },
  profilePictureImg: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #e5e7eb",
  },
  uploadBtnWrapper: {
    marginTop: "8px",
  },
  fileInput: {
    display: "none",
  },
  uploadBtn: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "#6b7280",
    color: "white",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  profileInfo: {
    flex: 1,
  },
  profileField: {
    marginBottom: "20px",
  },
  profileLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "8px",
    marginTop: "0",
  },
  profileValue: {
    fontSize: "16px",
    color: "#111827",
    margin: "0",
  },
  profileInput: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "16px",
    border: "2px solid #e5e7eb",
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  helpText: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px",
    marginBottom: "0",
  },
  backBtn: {
    padding: "10px 20px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  pointsSummary: {
    padding: "24px",
    backgroundColor: "#f0fdf4",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  totalPoints: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#16a34a",
    margin: 0,
  },
  historyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#111827",
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    marginBottom: "12px",
  },
  historyEvent: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  historyDate: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },
  historyPoints: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#16a34a",
  },
  settingTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#111827",
  },
  settingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    marginBottom: "12px",
  },
  settingLabel: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#374151",
    margin: 0,
  },
  settingValue: {
    fontSize: "15px",
    color: "#6b7280",
    margin: 0,
  },
  toggleBtn: {
    padding: "6px 16px",
    backgroundColor: "#e5e7eb",
    color: "#6b7280",
    border: "none",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  toggleBtnActive: {
    padding: "6px 16px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  languageSelect: {
    padding: "8px 12px",
    fontSize: "15px",
    border: "2px solid #e5e7eb",
    borderRadius: "6px",
    backgroundColor: "white",
    color: "#374151",
    cursor: "pointer",
    outline: "none",
    fontWeight: "500",
  },
  // Dark Mode Styles
  darkContainer: {
    backgroundColor: "#111827",
  },
  darkNav: {
    backgroundColor: "#1f2937",
  },
  darkCard: {
    backgroundColor: "#1f2937",
    color: "#f3f4f6",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  darkActivityCard: {
    backgroundColor: "#374151",
    color: "#f3f4f6",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  darkMenuDropdown: {
    backgroundColor: "#1f2937",
    color: "#f3f4f6",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  darkNotificationPanel: {
    backgroundColor: "#1f2937",
    color: "#f3f4f6",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  darkHeader: {
    color: "#f3f4f6",
  },
  darkActivitiesGrid: {
    // No specific changes needed
  },
}
