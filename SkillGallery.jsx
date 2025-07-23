import { useState, useEffect } from 'react';
import SkillCard from './SkillCard';

export default function SkillGallery({ onSelect }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // Categorize skills based on their content
  const categorizeSkills = (skills) => {
    const categories = {
      personal: [],
      research: [],
      news: [],
      other: []
    };

    skills.forEach(skill => {
      const title = skill.title.toLowerCase();
      const prompt = skill.promptTemplate.toLowerCase();
      
      if (title.includes('email') || title.includes('calendar') || title.includes('meeting') || title.includes('draft') || title.includes('1:1') || prompt.includes('my') || prompt.includes('calendar') || prompt.includes('emails')) {
        categories.personal.push(skill);
      } else if (title.includes('research') || title.includes('compare') || title.includes('analysis') || title.includes('competitor') || title.includes('industry') || title.includes('startup')) {
        categories.research.push(skill);
      } else if (title.includes('news') || title.includes('trending') || title.includes('newsletter') || title.includes('tech') || title.includes('ai')) {
        categories.news.push(skill);
      } else {
        categories.other.push(skill);
      }
    });

    return categories;
  };

  const categories = categorizeSkills(skills);
  const categoryNames = {
    personal: '👤 Personal Assistant',
    research: '🔍 Research & Analysis',
    news: '📰 News & Trends',
    other: '🎯 Other Skills'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Loading skills...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md">
            <h3 className="text-red-800 dark:text-red-200 font-semibold text-lg mb-2">❌ Error Loading Skills</h3>
            <p className="text-red-600 dark:text-red-300 text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Skills Available</h2>
            <p className="text-gray-600 dark:text-gray-300">Create a new skill to get started</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : categories[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🚀 Comet Skills Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Execute AI-powered skills in Comet Assistant or Browser mode
              </p>
            </div>
            
            {/* Stats and Create Button */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-xl">
                <div className="text-sm text-blue-600 dark:text-blue-300">Total Skills</div>
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{skills.length}</div>
              </div>
              
              {/* Create New Skill Button */}
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('createSkill'));
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                <span>Create New Skill</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              📋 All Skills ({skills.length})
            </button>
            {Object.entries(categories).map(([key, skillsInCategory]) => {
              if (skillsInCategory.length === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {categoryNames[key]} ({skillsInCategory.length})
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Grid */}
        {selectedCategory === 'all' ? (
          // Show all categories with headers
          <div className="space-y-12">
            {Object.entries(categories).map(([key, skillsInCategory]) => {
              if (skillsInCategory.length === 0) return null;
              return (
                <div key={key} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {categoryNames[key]}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-6">
                    {skillsInCategory
                      .filter(skill => skill && typeof skill.mode === 'string')
                      .map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Show filtered skills
          <div className="flex flex-wrap justify-center gap-6">
            {filteredSkills
              .filter(skill => skill && typeof skill.mode === 'string')
              .map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
          </div>
        )}

        {/* Empty State */}
        {filteredSkills.length === 0 && selectedCategory !== 'all' && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No skills in this category
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different category or create new skills
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 