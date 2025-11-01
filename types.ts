/**
 * Represents a URL that has been marked as read
 */
export interface MarkedUrl {
  /** The full URL of the marked page */
  url: string
  /** The title of the marked page */
  title: string
  /** The domain of the marked page */
  domain: string
  /** Timestamp when the URL was marked (in milliseconds since epoch) */
  marked_at: string
}

