import React, { useState, useEffect } from 'react';
import SkillCard from './SkillCard';
import { Skill } from './types';

export default function SkillGalleryWithCards() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/skills.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setSkills(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Failed to load skills.json:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="text-red-800 font-medium">❌ Error Loading Skills</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-600 underline text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center">
          <p className="text-gray-500">No skills available</p>
          <p className="text-sm text-gray-400 mt-1">Add skills to skills.json to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Skill Gallery</h1>
      <p className="text-gray-600 mb-6">
        Choose a skill and run it directly in either browser mode or assistant mode.
        Skills with required inputs will show an input form when expanded.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills
          .filter(skill => skill && typeof skill.mode === 'string')
          .map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
      </div>
    </div>
  );
} 