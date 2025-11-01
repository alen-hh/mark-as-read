import { useEffect, useState } from "react"

import type { MarkedUrl } from "~types"
import {
  formatDate,
  getAllMarkedUrls,
  unmarkUrl
} from "~utils/storage"

import "~style.css"

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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mt-0 mb-6 text-gray-900">
        📚 Marked URLs
      </h1>

      {isLoading ? (
        <div className="text-gray-600">Loading...</div>
      ) : markedUrls.length === 0 ? (
        <div className="p-8 text-center text-gray-600 bg-gray-50 rounded-lg">
          📭 No marked URLs yet. Start by marking pages as read from the popup!
        </div>
      ) : (
        <div>
          <div className="mb-4 text-gray-600 text-sm">
            📊 Total: {markedUrls.length} marked URL
            {markedUrls.length !== 1 ? "s" : ""}
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    📄 Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    🌐 Domain
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    🕐 Marked At
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-24">
                    ⚙️ Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {markedUrls.map((item) => (
                  <tr
                    key={item.url}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline block mb-1 font-medium">
                        {item.title}
                      </a>
                      <div className="text-xs text-gray-500 break-all">
                        {item.url}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {item.domain}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {formatDate(item.marked_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemove(item.url, item.title)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        🗑️ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default OptionsPage

