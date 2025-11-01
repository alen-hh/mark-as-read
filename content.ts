import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

import { isUrlMarked } from "~utils/storage"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false
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
  indicator.textContent = "✅ Read"
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(40, 167, 69, 0.9);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 999999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 6px;
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

