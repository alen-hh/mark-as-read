import { useEffect, useState } from "react"

import {
  extractDomain,
  isUrlMarked,
  markUrlAsRead,
  normalizeUrl,
  unmarkUrl
} from "~utils/storage"

function IndexPopup() {
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [currentTitle, setCurrentTitle] = useState<string>("")
  const [isMarked, setIsMarked] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Get current tab information
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0]
      if (tab?.url && tab?.title) {
        setCurrentUrl(tab.url)
        setCurrentTitle(tab.title)

        // Check if URL is already marked
        const marked = await isUrlMarked(tab.url)
        setIsMarked(marked)
      }
      setIsLoading(false)
    })
  }, [])

  const handleToggle = async () => {
    if (!currentUrl) return

    setIsLoading(true)
    try {
      if (isMarked) {
        await unmarkUrl(currentUrl)
        setIsMarked(false)
      } else {
        const domain = extractDomain(currentUrl)
        await markUrlAsRead(currentUrl, currentTitle, domain)
        setIsMarked(true)
      }
    } catch (error) {
      console.error("Error toggling mark status:", error)
    }
    setIsLoading(false)
  }

  const handleOpenHistory = () => {
    chrome.runtime.openOptionsPage()
  }

  return (
    <div
      style={{
        padding: 16,
        minWidth: 300,
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>📖 Mark as Read</h3>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
              📄 Title:
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                wordBreak: "break-word"
              }}>
              {currentTitle}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
              🔗 URL:
            </div>
            <div
              style={{
                fontSize: 12,
                wordBreak: "break-all",
                color: "#0066cc"
              }}>
              {normalizeUrl(currentUrl)}
            </div>
          </div>

          <button
            onClick={handleToggle}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 500,
              border: "none",
              borderRadius: 4,
              cursor: isLoading ? "not-allowed" : "pointer",
              backgroundColor: isMarked ? "#dc3545" : "#28a745",
              color: "white",
              opacity: isLoading ? 0.6 : 1
            }}>
            {isMarked ? "❌ Mark as Unread" : "✅ Mark as Read"}
          </button>

          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid #eee",
              textAlign: "center"
            }}>
            <button
              onClick={handleOpenHistory}
              style={{
                background: "none",
                border: "none",
                color: "#0066cc",
                cursor: "pointer",
                fontSize: 14,
                textDecoration: "underline",
                padding: 0
              }}>
              📚 View All Marked URLs
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default IndexPopup
