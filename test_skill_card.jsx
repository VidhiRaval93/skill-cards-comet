import React from 'react';
import SkillCard from './SkillCard';

export default function TestSkillCard() {
  const testSkill = {
    title: "Test Skill",
    prompt: "This is a test prompt for {{Company A}} and {{Company B}}"
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">SkillCard Test</h1>
      <p className="text-gray-600 mb-4">
        This is a test of the SkillCard component with direct browser/assistant execution.
      </p>
      
      <SkillCard 
        title={testSkill.title}
        prompt={testSkill.prompt}
      />
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to test:</h3>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Make sure Chrome is running with --remote-debugging-port=9222</li>
          <li>2. Click "Run in Browser" to test browser mode</li>
          <li>3. Click "Run in Assistant" to test assistant mode</li>
          <li>4. Check the console for execution logs</li>
        </ol>
      </div>
    </div>
  );
} 