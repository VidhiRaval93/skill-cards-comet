export default function HistoryView({ onBack }) {
  const history = JSON.parse(localStorage.getItem("skillHistory") || "[]");

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🕓 Skill History</h2>
      {history.length === 0 && <p className="text-gray-500">No history yet.</p>}
      <div className="space-y-4">
        {history.map((entry, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow">
            <div className="text-xs text-gray-500 mb-2">{entry.timestamp}</div>
            <div className="font-semibold mb-1">Prompt:</div>
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{entry.prompt}</pre>
            <div className="font-semibold mt-2 mb-1">Result:</div>
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{entry.result}</pre>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          onClick={() => {
            const data = localStorage.getItem("skillHistory");
            navigator.clipboard.writeText(data);
            alert("Copied history to clipboard!");
          }}
        >
          Export History
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded-xl"
          onClick={onBack}
        >
          Back to Gallery
        </button>
      </div>
    </div>
  );
} 