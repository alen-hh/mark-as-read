import { useEffect, useState } from "react"

import type { MarkedUrl } from "~types"
import {
  formatDate,
  getAllMarkedUrls,
  unmarkUrl
} from "~utils/storage"

function OptionsPage() {
  const [markedUrls, setMarkedUrls] = useState<MarkedUrl[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadMarkedUrls = async () => {
    setIsLoading(true)
    const urls = await getAllMarkedUrls()
    setMarkedUrls(urls)
    setIsLoading(false)
  }

  useEffect(() => {
    loadMarkedUrls()
  }, [])

  const handleRemove = async (url: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove this URL?\n\n${title}`
    )
    if (!confirmed) return

    await unmarkUrl(url)
    await loadMarkedUrls()
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
      <h1 style={{ marginTop: 0 }}>📚 Marked URLs</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : markedUrls.length === 0 ? (
        <div style={{ padding: 20, textAlign: "center", color: "#666" }}>
          📭 No marked URLs yet. Start by marking pages as read from the popup!
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 16, color: "#666" }}>
            📊 Total: {markedUrls.length} marked URL{markedUrls.length !== 1 ? "s" : ""}
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd"
            }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th
                  style={{
                    padding: 12,
                    textAlign: "left",
                    borderBottom: "2px solid #ddd"
                  }}>
                  📄 Title
                </th>
                <th
                  style={{
                    padding: 12,
                    textAlign: "left",
                    borderBottom: "2px solid #ddd"
                  }}>
                  🌐 Domain
                </th>
                <th
                  style={{
                    padding: 12,
                    textAlign: "left",
                    borderBottom: "2px solid #ddd"
                  }}>
                  🕐 Marked At
                </th>
                <th
                  style={{
                    padding: 12,
                    textAlign: "center",
                    borderBottom: "2px solid #ddd",
                    width: 100
                  }}>
                  ⚙️ Action
                </th>
              </tr>
            </thead>
            <tbody>
              {markedUrls.map((item) => (
                <tr key={item.url} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 12 }}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#0066cc",
                        textDecoration: "none",
                        display: "block",
                        marginBottom: 4
                      }}>
                      {item.title}
                    </a>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#666",
                        wordBreak: "break-all"
                      }}>
                      {item.url}
                    </div>
                  </td>
                  <td style={{ padding: 12, color: "#666" }}>
                    {item.domain}
                  </td>
                  <td style={{ padding: 12, color: "#666" }}>
                    {formatDate(item.marked_at)}
                  </td>
                  <td style={{ padding: 12, textAlign: "center" }}>
                    <button
                      onClick={() => handleRemove(item.url, item.title)}
                      style={{
                        padding: "6px 12px",
                        fontSize: 12,
                        border: "1px solid #dc3545",
                        borderRadius: 4,
                        backgroundColor: "white",
                        color: "#dc3545",
                        cursor: "pointer"
                      }}
                      onMouseOver={(e) =>
                        ((e.target as HTMLButtonElement).style.backgroundColor =
                          "#dc3545") &&
                        ((e.target as HTMLButtonElement).style.color = "white")
                      }
                      onMouseOut={(e) =>
                        ((e.target as HTMLButtonElement).style.backgroundColor =
                          "white") &&
                        ((e.target as HTMLButtonElement).style.color =
                          "#dc3545")
                      }>
                      🗑️ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default OptionsPage

