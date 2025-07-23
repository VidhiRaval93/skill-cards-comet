import React, { useState } from 'react';
import { Skill, SkillInputs } from './types';

interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const [inputs, setInputs] = useState<SkillInputs>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generatePrompt = (): string => {
    let prompt = skill.promptTemplate;
    
    // Replace all {placeholder} with input values
    const placeholders = prompt.match(/\{([^}]+)\}/g) || [];
    placeholders.forEach(placeholder => {
      const key = placeholder.replace(/\{|\}/g, '');
      const value = inputs[key] || '';
      prompt = prompt.replace(placeholder, value);
    });
    
    return prompt;
  };

  const handleRun = async (mode: 'browser' | 'assistant') => {
    try {
      const finalPrompt = generatePrompt();
      if (skill.requiresInput && finalPrompt.includes('{')) {
        console.error('❌ Required inputs not provided');
        return;
      }
      
      // Use skill's defined mode if available, otherwise use the selected mode
      const executionMode = skill.mode || mode;
      
      setIsLoading(true);
      setShowResult(false);
      console.log(`🔁 Running skill "${skill.title}" in ${executionMode} mode...`);
      
      const response = await fetch('http://localhost:3001/run-skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          mode: executionMode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Skill executed successfully:', result);
      
      // Save result and show it
      setLastResult(result.status || 'Executed successfully');
      setShowResult(true);
      
      // Save to execution history
      try {
        const history = JSON.parse(localStorage.getItem("skillHistory") || "[]");
        const newEntry = {
          timestamp: new Date().toISOString(),
          skillTitle: skill.title,
          prompt: finalPrompt,
          mode: executionMode,
          result: result.status || "Executed successfully"
        };
        history.unshift(newEntry); // Add to beginning
        localStorage.setItem("skillHistory", JSON.stringify(history.slice(0, 50))); // Keep last 50 entries
      } catch (err) {
        console.error('Failed to save history:', err);
      }
      
    } catch (error) {
      console.error(`❌ Error running skill in ${mode} mode:`, error);
      setLastResult(`Error: ${error.message}`);
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getPlaceholders = (): string[] => {
    const placeholders = skill.promptTemplate.match(/\{([^}]+)\}/g) || [];
    return placeholders.map(p => p.replace(/\{|\}/g, ''));
  };

  const hasValidInputs = (): boolean => {
    if (!skill.requiresInput) return true;
    const placeholders = getPlaceholders();
    return placeholders.every(placeholder => inputs[placeholder]?.trim());
  };

  const getModeIcon = (mode: string) => {
    return mode === 'assistant' ? '🧠' : '🌐';
  };

  const getModeLabel = (mode: string) => {
    return mode === 'assistant' ? 'Assistant' : 'Browser';
  };

  const getModeBadgeColor = (mode: string) => {
    return mode === 'assistant' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700';
  };

  const getButtonColor = (mode: string) => {
    return mode === 'assistant' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-teal-600 hover:bg-teal-700';
  };

  return (
    <div className="aspect-square bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
            {skill.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getModeIcon(skill.mode || 'browser')}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getModeBadgeColor(skill.mode || 'browser')}`}>
              {getModeLabel(skill.mode || 'browser')}
            </span>
          </div>
        </div>
        {skill.requiresInput && (
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full px-2 py-1">
            <span className="text-orange-600 dark:text-orange-300 text-xs font-medium">Input</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="flex-1 mb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
          {skill.promptTemplate}
        </p>
      </div>

      {/* Input Fields */}
      {skill.requiresInput && (
        <div className="mb-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
          >
            <span>{isExpanded ? '▼' : '▶'}</span>
            {isExpanded ? 'Hide' : 'Show'} Inputs
          </button>
          
          {isExpanded && (
            <div className="mt-2 space-y-2 bg-gray-50 dark:bg-gray-700/50 rounded p-2 border border-gray-200 dark:border-gray-600">
              {getPlaceholders().map(placeholder => (
                <div key={placeholder}>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {placeholder.charAt(0).toUpperCase() + placeholder.slice(1)}:
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter ${placeholder}`}
                    value={inputs[placeholder] || ''}
                    onChange={(e) => handleInputChange(placeholder, e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* Browser Button */}
        {(skill.mode === 'browser' || !skill.mode) && (
          <button
            onClick={() => handleRun('browser')}
            disabled={skill.requiresInput && !hasValidInputs() || isLoading}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 text-white text-sm font-semibold rounded transition-all duration-200 ${
              skill.requiresInput && !hasValidInputs() || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : getButtonColor('browser')
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <span>🌐</span>
                <span>Browser</span>
              </>
            )}
          </button>
        )}
        
        {/* Assistant Button */}
        {(skill.mode === 'assistant' || !skill.mode) && (
          <button
            onClick={() => handleRun('assistant')}
            disabled={skill.requiresInput && !hasValidInputs() || isLoading}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 text-white text-sm font-semibold rounded transition-all duration-200 ${
              skill.requiresInput && !hasValidInputs() || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : getButtonColor('assistant')
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <span>🧠</span>
                <span>Assistant</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {skill.requiresInput && !hasValidInputs() && (
        <div className="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
          <p className="text-red-600 dark:text-red-300 text-xs font-medium">
            ⚠️ Fill in all inputs
          </p>
        </div>
      )}

      {/* Execution Result */}
      {showResult && lastResult && (
        <div className="mt-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-medium text-green-800 dark:text-green-200">
              ✅ Result
            </h4>
            <button
              onClick={() => setShowResult(false)}
              className="text-green-600 hover:text-green-700 text-xs"
            >
              ×
            </button>
          </div>
          <p className="text-green-700 dark:text-green-300 text-xs">
            {lastResult}
          </p>
        </div>
      )}
    </div>
  );
} 