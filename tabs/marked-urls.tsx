import { useEffect, useState } from "react"

import Layout from "~components/Layout"
import type { MarkedUrl } from "~types"
import {
  formatDate,
  getAllMarkedUrls,
  unmarkUrl
} from "~utils/storage"

function MarkedUrls() {
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
    <Layout currentPage="marked-urls">
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Marked URLs</h2>
          <p className="text-sm text-gray-600 mt-1">
            View and manage all your marked URLs
          </p>
        </div>

        {isLoading ? (
          <div className="text-gray-600">Loading...</div>
        ) : markedUrls.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No marked URLs yet
            </h3>
            <p className="text-gray-600">
              Start by marking pages as read from the popup!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="text-sm text-gray-600">
                📊 Total: {markedUrls.length} marked URL
                {markedUrls.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      📄 Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      🌐 Domain
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      🕐 Marked At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-40">
                      ⚙️ Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {markedUrls.map((item) => (
                    <tr
                      key={item.url}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 align-top">
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
                      <td className="px-6 py-4 text-gray-600 text-sm align-top">
                        {item.domain}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap align-top">
                        {formatDate(item.marked_at)}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <button
                          onClick={() => handleRemove(item.url, item.title)}
                          className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          aria-label={`Remove ${item.title}`}>
                          <span role="img" aria-label="Remove">🗑️ Remove</span>
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
    </Layout>
  )
}

export default MarkedUrls

