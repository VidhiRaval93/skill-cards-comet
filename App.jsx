import React, { useState, useEffect } from "react";
import SkillGallery from "./SkillGallery";
import SkillRunner, { SkillResult } from "./SkillRunner";
import HistoryView from "./HistoryView";
import SkillCreator from "./SkillCreator";
import SkillHistory from "./SkillHistory";
import { suggestFollowups } from "./followups";

export default function App() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [showCreator, setShowCreator] = useState(false);

  // Listen for create skill event from SkillGallery
  useEffect(() => {
    const handleCreateSkill = () => {
      setShowCreator(true);
    };

    window.addEventListener('createSkill', handleCreateSkill);
    return () => window.removeEventListener('createSkill', handleCreateSkill);
  }, []);

  if (viewingHistory) {
    return <HistoryView onBack={() => setViewingHistory(false)} />;
  }

  if (result) {
    const followups = suggestFollowups(selectedSkill?.template || "");
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Result</h2>
          
          {/* Display result using SkillResult component */}
          <SkillResult result={result} />
          
          {/* Follow-up Suggestions */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">🔄 Suggested follow-ups:</h3>
            <ul className="space-y-2">
              {followups.map((followup, index) => (
                <li key={index} className="text-blue-800 dark:text-blue-200">• {followup}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              onClick={() => {
                setSelectedSkill(null);
                setResult(null);
                setError(null);
              }}
            >
              ← Back to Gallery
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              onClick={() => setViewingHistory(true)}
            >
              📋 View History
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedSkill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <SkillRunner
            skill={selectedSkill}
            onBack={() => setSelectedSkill(null)}
            onRun={async (prompt) => {
              try {
                setError(null); // Clear any previous errors
                
                if (!prompt || prompt.trim() === '') {
                  setError(new Error('Prompt cannot be empty'));
                  return;
                }

                const response = await fetch("http://localhost:3001/run_skill", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ prompt }),
                });
                
                const data = await response.json();
                console.log('📊 Response data:', data); // Debug logging
                
                if (response.ok) {
                  // Check if we have a proper result structure
                  if (data.result && Array.isArray(data.result)) {
                    setResult(data.result);
                  } else {
                    // Fallback to string result for backward compatibility
                    setResult([{
                      text: `✅ Skill executed successfully!\n\nPrompt: ${data.prompt}\nRemaining skills: ${data.remainingSkills}`
                    }]);
                  }
                } else {
                  setError(new Error(data.error || 'Failed to execute skill'));
                }
              } catch (error) {
                setError(error);
              }
            }}
          />
          
          {/* Error display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="text-red-800 dark:text-red-200 font-medium">❌ Error</div>
              <div className="text-red-600 dark:text-red-300 text-sm mt-1">{error.message}</div>
            </div>
          )}
          
          {/* Conditional result display */}
          {!result ? (
            <div className="mt-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">Click "Run" to execute the skill</p>
            </div>
          ) : (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Result</h3>
              <SkillResult result={result} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showCreator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <SkillCreator 
            onSkillCreated={(data) => {
              console.log('📊 Skill created data:', data); // Debug logging
              if (data.result && Array.isArray(data.result)) {
                setResult(data.result);
              } else {
                setResult([{
                  text: `✅ Skill created and executed!\n\nPrompt: ${data.prompt}\nRemaining skills: ${data.remainingSkills}`
                }]);
              }
              setShowCreator(false);
            }}
          />
          <button
            className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            onClick={() => setShowCreator(false)}
          >
            ← Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Main Dashboard */}
      <SkillGallery onSelect={setSelectedSkill} />
      
      {/* Action Buttons */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            onClick={() => setViewingHistory(true)}
          >
            📋 View History
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            onClick={() => setShowCreator(true)}
          >
            ➕ Create New Skill
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            onClick={async () => {
              await fetch('http://localhost:3001/clear_queue', { method: 'POST' });
              alert('Queue cleared!');
            }}
          >
            🗑️ Clear Queue
          </button>
        </div>
      </div>
    </div>
  );
} 