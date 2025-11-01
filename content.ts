import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

import cssText from "data-text:~style.css"

import { isUrlMarked } from "~utils/storage"

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
  indicator.className = "fixed top-2.5 right-2.5 z-[999999]"
  indicator.innerHTML = `
    <div class="flex items-center gap-2 bg-green-600/90 text-white px-4 py-2 rounded shadow-lg">
      <span>✅</span>
      <span class="text-sm font-medium">Read</span>
    </div>
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

