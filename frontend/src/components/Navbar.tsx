import React from "react"
import { Sun, Moon, LogOut, GraduationCap, ShieldCheck } from "lucide-react"

interface NavbarProps {
  theme: "light" | "dark"
  onToggleTheme: () => void
  userRole: string
  username: string
  onLogout: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  userRole,
  username,
  onLogout,
}) => {
  const isAdmin =
    userRole === "admin" || userRole === "superadmin" || userRole === "staff"

  return (
    <header className="header-glass">
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* Brand */}
        <a href="/">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
        </a>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Theme Toggle */}
          <button
            className="btn-icon"
            onClick={onToggleTheme}
            aria-label="Rejimi dəyiş"
            title={
              theme === "dark" ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"
            }
          >
            {theme === "dark" ? (
              <Sun size={19} color="#eab308" />
            ) : (
              <Moon size={19} color="#52606d" />
            )}
          </button>

          {/* Logout */}
          <button
            className="btn-secondary"
            onClick={onLogout}
            title="Çıxış"
            style={{
              color: "#ef4444",
              borderColor: "rgba(239, 68, 68, 0.25)",
              gap: "6px",
            }}
          >
            <LogOut size={16} />
            <span>Çıxış</span>
          </button>
        </div>
      </div>
    </header>
  )
}
