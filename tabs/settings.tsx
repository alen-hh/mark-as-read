import { useEffect, useState } from "react"

import Layout from "~components/Layout"
import {
  addIgnoredQueryParam,
  getSettings,
  removeIgnoredQueryParam
} from "~utils/storage"

function Settings() {
  const [ignoredParams, setIgnoredParams] = useState<string[]>([])
  const [newParam, setNewParam] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const loadSettings = async () => {
    setIsLoading(true)
    const settings = await getSettings()
    setIgnoredParams(settings.ignoredQueryParams)
    setIsLoading(false)
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleAddParam = async () => {
    const trimmedParam = newParam.trim()
    if (!trimmedParam) return

    await addIgnoredQueryParam(trimmedParam)
    setNewParam("")
    await loadSettings()
  }

  const handleRemoveParam = async (param: string) => {
    await removeIgnoredQueryParam(param)
    await loadSettings()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddParam()
    }
  }

  return (
    <Layout currentPage="settings">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure your extension preferences
          </p>
        </div>

        {/* URL Query Params Settings */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              🔗 URL Query Params To Ignore
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Define query parameters that should be ignored when determining
              URL uniqueness
            </p>
          </div>

          <div className="p-6">
            {/* Add New Parameter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Query Parameter
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newParam}
                  onChange={(e) => setNewParam(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., utm_source, ref, fbclid"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddParam}
                  disabled={!newParam.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Example: If you add "name", URLs like
                example.com?name=john and example.com will be treated as the
                same URL.
              </p>
            </div>

            {/* List of Ignored Parameters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ignored Parameters ({ignoredParams.length})
              </label>
              {isLoading ? (
                <div className="text-gray-600 text-sm">Loading...</div>
              ) : ignoredParams.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-600">
                    No query parameters ignored yet
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Add parameters above to start
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {ignoredParams.map((param) => (
                    <div
                      key={param}
                      className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-900">
                          {param}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveParam(param)}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-white border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                About This Extension
              </h4>
              <p className="text-sm text-blue-800">
                Mark as Read helps you track which URLs you've already visited.
                All data is stored locally in your browser for privacy.
              </p>
              <div className="mt-3 text-xs text-blue-700">
                <div>Version: 2.0.0</div>
                <div className="mt-1">
                  Built with Plasmo Framework & Tailwind CSS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Settings

