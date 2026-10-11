import React, { useState, useEffect } from "react"
import { Navbar } from "./components/Navbar"
import { HeroSection } from "./components/HeroSection"
import { CalendarsSection } from "./components/CalendarsSection"
import { ResourcesSection } from "./components/ResourcesSection"
import { RoadmapsSection } from "./components/RoadmapsSection"
import { SocialSection } from "./components/SocialSection"
import { AdminPanel } from "./components/AdminPanel"
import { LoginPage } from "./components/LoginPage"
import { api } from "./api"
import { CalendarItem, ResourceItem, RoadmapItem, SocialItem } from "./types"

export const App: React.FC = () => {
  // Theme state stored in localStorage
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (
      (localStorage.getItem("peerstack_theme") as "light" | "dark") || "light"
    )
  })

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userRole, setUserRole] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [authChecked, setAuthChecked] = useState<boolean>(false)

  // Data state
  const [calendars, setCalendars] = useState<CalendarItem[]>([])
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([])
  const [socials, setSocials] = useState<SocialItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedShift, setSelectedShift] = useState<string>("all")

  // Sync theme with DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("peerstack_theme", theme)
  }, [theme])

  // Check existing auth on mount using httpOnly cookie
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const data = await api.verifyAuth()
        if (data && data.valid) {
          setIsLoggedIn(true)
          setUserRole(data.user.role)
          setUsername(data.user.username)
        } else {
          setIsLoggedIn(false)
        }
      } catch {
        setIsLoggedIn(false)
      }
      setAuthChecked(true)
    }
    checkExistingAuth()
  }, [])

  // Fetch data once logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
    }
  }, [isLoggedIn])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [c, r, m, s] = await Promise.all([
        api.getCalendars(),
        api.getResources(),
        api.getRoadmaps(),
        api.getSocials(),
      ])
      setCalendars(c)
      setResources(r)
      setRoadmaps(m)
      setSocials(s)
    } catch (err) {
      console.error("Error fetching handbook data:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const handleLogin = (user: { username: string; role: string }) => {
    setIsLoggedIn(true)
    setUserRole(user.role)
    setUsername(user.username)
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch (err) {
      console.error("Logout error:", err)
    }
    setIsLoggedIn(false)
    setUserRole("")
    setUsername("")
  }

  const isAdmin = userRole === "admin" || userRole === "superadmin" || userRole === "staff"

  // Show nothing until auth check completes
  if (!authChecked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-main)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            width: "36px",
            height: "36px",
            border: "3px solid var(--border-color)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isLoggedIn) {
    return (
      <LoginPage
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogin={handleLogin}
      />
    )
  }

  // Authenticated view: Admin sees AdminPanel, Student sees Handbook
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        userRole={userRole}
        username={username}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {isAdmin ? (
          <AdminPanel
            onBackToStudentView={() => {}}
            onRefreshData={fetchData}
          />
        ) : (
          <div className="container">
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedShift={selectedShift}
              onShiftChange={setSelectedShift}
              calendars={calendars}
              resources={resources}
              roadmaps={roadmaps}
              socials={socials}
            />

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "var(--text-muted)",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    width: "36px",
                    height: "36px",
                    border: "3px solid var(--border-color)",
                    borderTopColor: "var(--primary)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <p style={{ marginTop: "12px", fontSize: "0.9rem" }}>
                  Məlumatlar yüklənir...
                </p>
              </div>
            ) : (
              <>
                <CalendarsSection
                  calendars={calendars}
                  selectedShift={selectedShift}
                />
                <ResourcesSection
                  resources={resources}
                  searchQuery={searchQuery}
                />
                <RoadmapsSection
                  roadmaps={roadmaps}
                  searchQuery={searchQuery}
                />
                <SocialSection socials={socials} searchQuery={searchQuery} />
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          background: "var(--bg-card)",
          padding: "28px 0",
          marginTop: "auto",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <img
              src="/logo1.png"
              alt="logo"
              style={{ width: "42px", height: "42px" }}
            />
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    letterSpacing: "-0.02em",
                    color: "var(--text-main)",
                  }}
                >
                  Peerstack Academy
                </span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
            © 2026 Peerstack Academy — Bütün hüquqlar qorunur
          </p>
        </div>
      </footer>
    </div>
  )
}
export default App
