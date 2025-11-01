import type { ReactNode } from "react"

import "~style.css"

interface LayoutProps {
  children: ReactNode
  currentPage: "marked-urls" | "settings"
}

function Layout({ children, currentPage }: LayoutProps) {
  const menuItems = [
    {
      id: "marked-urls" as const,
      label: "📚 Marked URLs",
      page: "tabs/marked-urls"
    },
    {
      id: "settings" as const,
      label: "⚙️ Settings",
      page: "tabs/settings"
    }
  ]

  const handleNavigation = (page: string) => {
    const url = chrome.runtime.getURL(`/${page}.html`)
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={chrome.runtime.getURL("assets/icon.png")}
              alt="Extension Icon"
              className="h-8 w-8"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Mark as Read
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.page)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    currentPage === item.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}>
                <span className="text-lg">{item.label}</span>
              </button>
            ))}
          </nav>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

export default Layout

