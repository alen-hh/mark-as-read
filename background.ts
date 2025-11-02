/**
 * Background Service Worker for keyboard shortcut handling
 * Listens for the "toggleMark" command and sends it to the active tab's popup
 */

/**
 * Handle keyboard shortcut commands defined in manifest
 */
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-mark-as-read") {
    handleToggleMarkCommand()
  }
})

/**
 * Executes the toggle mark action on the current active tab
 */
async function handleToggleMarkCommand() {
  try {
    // Get the active tab in the current window
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })

    if (!tabs || tabs.length === 0) {
      console.error("No active tab found")
      return
    }

    const tab = tabs[0]

    if (!tab.id) {
      console.error("Tab ID not available")
      return
    }

    // Send message to popup if it's open
    try {
      await chrome.runtime.sendMessage({
        action: "toggleMarkCommand"
      })
    } catch (err) {
      // Popup might not be open, that's okay
      console.log("Popup not open, message ignored")
    }

    // Also notify content script to trigger the action
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: "toggleMarkFromShortcut",
        url: tab.url,
        title: tab.title
      })
    } catch (err) {
      console.log("Content script communication failed:", err)
    }
  } catch (error) {
    console.error("Error handling toggle mark command:", error)
  }
}
