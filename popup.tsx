import { useEffect, useState } from "react"

import {
  extractDomain,
  isUrlMarked,
  markUrlAsRead,
  normalizeUrlSync,
  unmarkUrl
} from "~utils/storage"

import "~style.css"

function IndexPopup() {
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [currentTitle, setCurrentTitle] = useState<string>("")
  const [isMarked, setIsMarked] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [shortcutInfo, setShortcutInfo] = useState<string>("Shortcut")

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

  // Listen for shortcut command from background script
  useEffect(() => {
    const handleMessage = async (
      request: { action: string },
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (request.action === "toggleMarkCommand") {
        await handleToggle()
        sendResponse({ success: true })
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)
    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [isMarked, currentUrl])

  const handleToggle = async () => {
    if (!currentUrl) return

    setIsLoading(true)
    try {
      if (isMarked) {
        await unmarkUrl(currentUrl)
        setIsMarked(false)
        // Notify content script to show notification on page
        try {
          await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "toggleMarkFromPopup",
                marked: true
              })
            }
          })
        } catch (err) {
          console.log("Content script notification failed:", err)
        }
      } else {
        const domain = extractDomain(currentUrl)
        await markUrlAsRead(currentUrl, currentTitle, domain)
        setIsMarked(true)
        // Notify content script to show notification on page
        try {
          await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "toggleMarkFromPopup",
                marked: false
              })
            }
          })
        } catch (err) {
          console.log("Content script notification failed:", err)
        }
      }
    } catch (error) {
      console.error("Error toggling mark status:", error)
    }
    setIsLoading(false)
  }

  const handleOpenHistory = () => {
    const url = chrome.runtime.getURL("/tabs/marked-urls.html")
    chrome.tabs.create({ url })
  }

  const handleOpenSettings = () => {
    const url = chrome.runtime.getURL("/tabs/settings.html")
    chrome.tabs.create({ url })
  }

  const handleOpenShortcutsPage = () => {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" })
  }

  return (
    <div className="p-4 min-w-[300px] bg-white">
      <h3 className="text-lg font-semibold mt-0 mb-3 text-gray-800">
        📖 Mark as Read
      </h3>

      {isLoading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <>
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-1">📄 Title:</div>
            <div className="text-sm font-medium break-words text-gray-900">
              {currentTitle}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-600 mb-1">🔗 URL:</div>
            <div className="text-xs break-all text-blue-600">
              {normalizeUrlSync(currentUrl)}
            </div>
          </div>

          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`w-full px-4 py-2.5 text-sm font-medium rounded transition-all
              ${
                isMarked
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
              text-white disabled:opacity-60 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isMarked ? "focus:ring-red-500" : "focus:ring-green-500"}
            `}>
            {isMarked ? "❌ Mark as Unread" : "✅ Mark as Read"}
          </button>

          <div className="mt-2 pt-2 border-t border-gray-200">
            <button
              onClick={handleOpenHistory}
              className="w-full text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              📚 View All Marked URLs
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleOpenShortcutsPage}
              className="w-full text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              ⌨️ {shortcutInfo}
            </button>
          </div>

        </>
      )}
    </div>
  )
}

export default IndexPopup
