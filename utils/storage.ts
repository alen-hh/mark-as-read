import { Storage } from "@plasmohq/storage"
import type { MarkedUrl } from "~types"

const storage = new Storage()

const STORAGE_KEY = "markedUrls"

/**
 * Normalize a URL by removing the fragment identifier (hash)
 * @param url - The URL to normalize
 * @returns The normalized URL without fragment
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    // Remove the hash/fragment
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
  const normalizedUrl = normalizeUrl(url)
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
  const normalizedUrl = normalizeUrl(url)
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
  const normalizedUrl = normalizeUrl(url)
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

