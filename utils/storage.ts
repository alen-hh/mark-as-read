import { Storage } from "@plasmohq/storage"
import type { MarkedUrl, Settings } from "~types"

const storage = new Storage()

const STORAGE_KEY = "markedUrls"
const SETTINGS_KEY = "settings"

/**
 * Get settings from storage
 * @returns Settings object
 */
export async function getSettings(): Promise<Settings> {
  const settings = await storage.get<Settings>(SETTINGS_KEY)
  return settings || { ignoredQueryParams: [] }
}

/**
 * Save settings to storage
 * @param settings - Settings object to save
 */
export async function saveSettings(settings: Settings): Promise<void> {
  await storage.set(SETTINGS_KEY, settings)
}

/**
 * Add a query parameter to ignore list
 * @param param - Query parameter name to ignore
 */
export async function addIgnoredQueryParam(param: string): Promise<void> {
  const settings = await getSettings()
  if (!settings.ignoredQueryParams.includes(param)) {
    settings.ignoredQueryParams.push(param)
    await saveSettings(settings)
  }
}

/**
 * Remove a query parameter from ignore list
 * @param param - Query parameter name to remove
 */
export async function removeIgnoredQueryParam(param: string): Promise<void> {
  const settings = await getSettings()
  settings.ignoredQueryParams = settings.ignoredQueryParams.filter(
    (p) => p !== param
  )
  await saveSettings(settings)
}

/**
 * Normalize a URL by removing the fragment identifier (hash) and ignored query params
 * @param url - The URL to normalize
 * @returns The normalized URL without fragment and ignored query params
 */
export async function normalizeUrl(url: string): Promise<string> {
  try {
    const urlObj = new URL(url)
    
    // Remove the hash/fragment
    urlObj.hash = ""
    
    // Get ignored query params from settings
    const settings = await getSettings()
    
    // Remove ignored query parameters
    if (settings.ignoredQueryParams.length > 0) {
      settings.ignoredQueryParams.forEach((param) => {
        urlObj.searchParams.delete(param)
      })
    }
    
    return urlObj.href
  } catch (error) {
    console.error("Failed to normalize URL:", url, error)
    return url
  }
}

/**
 * Synchronous version of normalizeUrl for display purposes
 * Note: Does not apply query param filtering, only removes hash
 * @param url - The URL to normalize
 * @returns The normalized URL without fragment
 */
export function normalizeUrlSync(url: string): string {
  try {
    const urlObj = new URL(url)
    urlObj.hash = ""
    return urlObj.href
  } catch (error) {
    console.error("Failed to normalize URL:", url, error)
    return url
  }
}

/**
 * Get all marked URLs from storage
 * @returns Array of marked URLs, sorted by most recent first
 */
export async function getAllMarkedUrls(): Promise<MarkedUrl[]> {
  const markedUrls = await storage.get<MarkedUrl[]>(STORAGE_KEY)
  return markedUrls || []
}

/**
 * Check if a URL is marked as read
 * @param url - The URL to check
 * @returns True if the URL is marked, false otherwise
 */
export async function isUrlMarked(url: string): Promise<boolean> {
  const normalizedUrl = await normalizeUrl(url)
  const markedUrls = await getAllMarkedUrls()
  return markedUrls.some((item) => item.url === normalizedUrl)
}

/**
 * Mark a URL as read
 * @param url - The full URL of the page
 * @param title - The title of the page
 * @param domain - The domain of the page
 */
export async function markUrlAsRead(
  url: string,
  title: string,
  domain: string
): Promise<void> {
  const normalizedUrl = await normalizeUrl(url)
  const markedUrls = await getAllMarkedUrls()

  // Check if URL is already marked (using normalized URL)
  if (markedUrls.some((item) => item.url === normalizedUrl)) {
    return
  }

  const newMarkedUrl: MarkedUrl = {
    url: normalizedUrl,
    title,
    domain,
    marked_at: Date.now().toString()
  }

  // Add to the beginning of the array (most recent first)
  markedUrls.unshift(newMarkedUrl)
  await storage.set(STORAGE_KEY, markedUrls)
}

/**
 * Remove a marked URL
 * @param url - The URL to remove
 */
export async function unmarkUrl(url: string): Promise<void> {
  const normalizedUrl = await normalizeUrl(url)
  const markedUrls = await getAllMarkedUrls()
  const filteredUrls = markedUrls.filter((item) => item.url !== normalizedUrl)
  await storage.set(STORAGE_KEY, filteredUrls)
}

/**
 * Extract domain from a URL
 * @param url - The full URL
 * @returns The domain (hostname) of the URL
 */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch (error) {
    console.error("Failed to extract domain from URL:", url, error)
    return ""
  }
}

/**
 * Format timestamp to readable date string
 * @param timestamp - The timestamp string
 * @returns Formatted date string
 */
export function formatDate(timestamp: string): string {
  const date = new Date(parseInt(timestamp))
  return date.toLocaleString()
}

