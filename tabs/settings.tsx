import { useEffect, useState } from "react"

import Layout from "~components/Layout"
import {
  addIgnoredQueryParam,
  getDefaultIgnoredParams,
  getSettings,
  removeIgnoredQueryParam
} from "~utils/storage"

function Settings() {
  const [defaultParams] = useState<string[]>(getDefaultIgnoredParams())
  const [userParams, setUserParams] = useState<string[]>([])
  const [newParam, setNewParam] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const loadSettings = async () => {
    setIsLoading(true)
    const settings = await getSettings()
    setUserParams(settings.ignoredQueryParams)
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

  const totalParams = defaultParams.length + userParams.length

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
                Ignored Parameters ({totalParams})
              </label>
              {isLoading ? (
                <div className="text-gray-600 text-sm">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {/* Default Parameters Section */}
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-2">
                      <span>🔒 System Default ({defaultParams.length})</span>
                      <span className="text-gray-400">- Cannot be removed</span>
                    </div>
                    <div className="flex flex-wrap gap-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      {defaultParams.map((param) => (
                        <div
                          key={param}
                          className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-mono text-blue-800">
                          <span>{param}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Parameters Section */}
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-2">
                      ➕ User Added ({userParams.length})
                    </div>
                    {userParams.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-sm text-gray-600">
                          No custom parameters added yet
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Add your own parameters above
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        {userParams.map((param) => (
                          <div
                            key={param}
                            className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-mono text-gray-800">
                            <span>{param}</span>
                            <button
                              onClick={() => handleRemoveParam(param)}
                              className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-red-500">
                              <span className="mb-0.5">&times;</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default Settings

