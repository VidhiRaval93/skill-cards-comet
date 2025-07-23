import { useState } from "react";

export default function SkillRunner({ skill, onBack, onRun }) {
  const [inputs, setInputs] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setInputs({ ...inputs, [key]: value });
  };

  const generatePrompt = () => {
    // Extract variables from the prompt template
    const inputVariables = (skill.promptTemplate.match(/\{([^}]+)\}/g) || [])
      .map(match => match.replace(/\{|\}/g, ''));
    
    // Replace variables with user inputs
    let finalPrompt = skill.promptTemplate;
    inputVariables.forEach((key) => {
      finalPrompt = finalPrompt.replace(`{${key}}`, inputs[key] || "");
    });
    
    return finalPrompt;
  };

  const runSkill = async (prompt, mode) => {
    if (!prompt || prompt.trim() === '') {
      setError('Prompt cannot be empty');
      return;
    }

    const res = await fetch("http://localhost:3001/run-skill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, mode }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  const handleRunSkill = async () => {
    try {
      setIsRunning(true);
      setError(null);
      setResult(null);
      
      const finalPrompt = generatePrompt();
      const mode = skill.mode || 'browser'; // Default to browser if no mode specified
      console.log('🚀 Running skill with prompt:', finalPrompt, 'in mode:', mode);
      
      await runSkill(finalPrompt, mode);
      console.log('✅ Skill submitted successfully');
    } catch (error) {
      setError(error.message);
      console.error('❌ Network error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Extract input variables from the prompt template
  const inputVariables = (skill.promptTemplate.match(/\{([^}]+)\}/g) || [])
    .map(match => match.replace(/\{|\}/g, ''));

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{skill.title}</h2>
      <p className="text-sm text-gray-600 mb-4">{skill.promptTemplate}</p>
      
      {/* Mode indicator */}
      <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-sm font-medium text-blue-800">
          🎯 Mode: {skill.mode === 'assistant' ? '🤖 Assistant' : '🌐 Browser'}
        </span>
      </div>
      
      {/* Input fields for template variables */}
      {inputVariables.map((key) => (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {key}
          </label>
          <input
            className="mt-1 p-2 border rounded w-full"
            value={inputs[key] || ""}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={`Enter ${key}`}
          />
        </div>
      ))}
      
      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <div className="text-red-800 font-medium">❌ Error</div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
        </div>
      )}
      
      {/* Result display */}
      {result && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          <SkillResult result={result} />
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded-xl"
          onClick={onBack}
          disabled={isRunning}
        >
          Back
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleRunSkill}
          disabled={isRunning}
        >
          {isRunning ? "Running..." : "Run Skill"}
        </button>
      </div>
    </div>
  );
}

// Result display component for handling execution results
export function SkillResult({ result }) {
  // Multiple safety checks to prevent crashes
  if (!result) {
    return <div className="text-gray-500">⏳ Waiting for result...</div>;
  }
  
  if (!Array.isArray(result)) {
    return <div className="text-red-500">⚠️ Invalid result format. Expected array.</div>;
  }
  
  if (result.length === 0) {
    return <div className="text-gray-500">📭 No results available.</div>;
  }

  return (
    <div className="space-y-4">
      {result.map((item, idx) => {
        // Additional safety check for each item
        if (!item || typeof item !== 'object') {
          return (
            <div key={idx} className="p-4 border rounded bg-yellow-50">
              ⚠️ Invalid result item
            </div>
          );
        }
        
        return (
          <div key={idx} className="p-4 border rounded">
            {item.text || 'No text content'}
          </div>
        );
      })}
    </div>
  );
} 