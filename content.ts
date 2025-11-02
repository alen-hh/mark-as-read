import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

import cssText from "data-text:~style.css"

import {
  extractDomain,
  isUrlMarked,
  markUrlAsRead,
  unmarkUrl
} from "~utils/storage"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const storage = new Storage()

let indicator: HTMLDivElement | null = null

/**
 * Create and inject the visual indicator
 */
function createIndicator() {
  // Remove existing indicator if present
  if (indicator) {
    indicator.remove()
  }

  indicator = document.createElement("div")
  indicator.id = "mark-as-read-indicator"
  indicator.style.cssText = `
    position: fixed;
    bottom: 16px;
    left: 16px;
    z-index: 999999;
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: rgba(22, 163, 74, 0.9);
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    font-weight: 500;
  `
  indicator.innerHTML = `
    <span>✅</span>
    <span style="font-size: 14px; font-weight: 500;">Read</span>
  `

  document.body.appendChild(indicator)
}

/**
 * Remove the visual indicator
 */
function removeIndicator() {
  if (indicator) {
    indicator.remove()
    indicator = null
  }
}

/**
 * Show a temporary notification on the page
 */
function showNotification(message: string) {
  const notification = document.createElement("div")
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    background-color: #16a34a;
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  `
  notification.textContent = message

  document.body.appendChild(notification)

  // Auto-dismiss after 2 seconds
  setTimeout(() => {
    notification.remove()
  }, 2000)
}

/**
 * Check if current page is marked and update UI
 */
async function updateIndicator() {
  const currentUrl = window.location.href
  const marked = await isUrlMarked(currentUrl)

  if (marked) {
    createIndicator()
  } else {
    removeIndicator()
  }
}

/**
 * Handle keyboard shortcut action from background script
 */
async function handleToggleFromShortcut(url: string, title: string) {
  try {
    const marked = await isUrlMarked(url)

    if (marked) {
      await unmarkUrl(url)
      showNotification("Unmarked!")
    } else {
      const domain = extractDomain(url)
      await markUrlAsRead(url, title, domain)
      showNotification("Marked!")
    }

    // Update the indicator to reflect the change
    await updateIndicator()
  } catch (error) {
    console.error("Error toggling mark from shortcut:", error)
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "toggleMarkFromShortcut") {
    handleToggleFromShortcut(request.url, request.title)
    sendResponse({ success: true })
  } else if (request.action === "toggleMarkFromPopup") {
    // Handle notification from popup button click
    const message = request.marked ? "Unmarked!" : "Marked!"
    showNotification(message)
    sendResponse({ success: true })
  }
})

// Initial check when page loads
updateIndicator()

// Listen for storage changes to update indicator in real-time
storage.watch({
  markedUrls: (change) => {
    updateIndicator()
  }
})

// Also listen for URL changes (for SPAs)
let lastUrl = window.location.href
new MutationObserver(() => {
  const url = window.location.href
  if (url !== lastUrl) {
    lastUrl = url
    updateIndicator()
  }
}).observe(document, { subtree: true, childList: true })

