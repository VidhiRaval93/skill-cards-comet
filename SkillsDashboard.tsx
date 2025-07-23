import React from 'react';
import SkillCard from './SkillCard';
import { Skill } from './types';

const skills: Skill[] = [
  {
    id: 'newsletter-summary',
    title: 'Summarize Today\'s Newsletter',
    promptTemplate: 'Summarize the most important points from today\'s top tech newsletters in 5 bullet points.',
    mode: 'assistant'
  },
  {
    id: 'weekend-activities',
    title: 'Things to Do This Weekend Nearby',
    promptTemplate: 'Find 5 interesting local events or things to do near me this weekend.',
    mode: 'browser'
  },
  {
    id: 'schedule-1on1',
    title: 'Set 1:1 with [Name]',
    promptTemplate: 'Check my calendar and set up a 30-minute 1:1 meeting with {name} next week.',
    requiresInput: true,
    mode: 'assistant'
  },
  {
    id: 'ai-trends',
    title: 'What\'s Trending in AI Today?',
    promptTemplate: 'What are the top trending news or developments in AI today? Provide 3 short summaries with links.',
    mode: 'browser'
  }
];

export default function SkillsDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Skills Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Choose a skill to run in either browser mode or assistant mode.
      </p>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills
          .filter(skill => skill && typeof skill.mode === 'string') // guard
          .map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
      </div>
    </div>
  );
} 