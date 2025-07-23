import { useState, useEffect } from 'react';

export default function SkillHistory({ className = "", maxItems = 10, showHeader = true }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load history from localStorage
  const loadHistory = () => {
    try {
      const historyData = JSON.parse(localStorage.getItem("skillHistory") || "[]");
      setHistory(historyData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load history:', err);
      setHistory([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // Refresh history every 3 seconds
    const interval = setInterval(loadHistory, 3000);
    return () => clearInterval(interval);
  }, []);

  const exportHistory = () => {
    try {
      const data = localStorage.getItem("skillHistory");
      navigator.clipboard.writeText(data);
      alert("History copied to clipboard!");
    } catch (err) {
      console.error('Failed to export history:', err);
      alert("Failed to export history");
    }
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      localStorage.removeItem("skillHistory");
      setHistory([]);
    }
  };

  if (loading) {
    return (
      <div className={`${className} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">🕓 Execution History</h3>
          <div className="flex gap-2">
            <button
              onClick={exportHistory}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Export
            </button>
            <button
              onClick={clearHistory}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      
      {history.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-gray-500 dark:text-gray-400">No executions yet</p>
          <p className="text-sm text-gray-400">Run a skill to see history here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.slice(0, maxItems).map((entry, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
                <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                  {entry.mode || 'unknown'}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                {entry.prompt}
              </div>
              {entry.result && (
                <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 bg-white dark:bg-gray-800 p-2 rounded border">
                  {entry.result}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {history.length > maxItems && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {maxItems} of {history.length} executions
          </p>
        </div>
      )}
    </div>
  );
} 