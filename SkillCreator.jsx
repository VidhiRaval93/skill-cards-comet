import { useState } from "react";

export default function SkillCreator({ onSkillCreated }) {
  const [skillName, setSkillName] = useState("");
  const [skillPrompt, setSkillPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillName.trim() || !skillPrompt.trim()) return;

    setIsCreating(true);
    try {
      // Add skill to queue
      const response = await fetch('/add-skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: skillName,
          prompt: skillPrompt
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Skill added to queue:", data);
        
        // Trigger execution
        if (!skillPrompt || skillPrompt.trim() === '') {
          console.error("❌ Cannot execute empty prompt");
          return;
        }

        const triggerResponse = await fetch("http://localhost:3001/run_skill", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: skillPrompt }),
        });

        if (triggerResponse.ok) {
          const triggerData = await triggerResponse.json();
          console.log("🚀 Skill execution triggered:", triggerData);
          onSkillCreated && onSkillCreated(triggerData);
        } else {
          console.error("❌ Failed to trigger skill execution");
        }

        // Reset form
        setSkillName("");
        setSkillPrompt("");
      } else {
        console.error("❌ Failed to add skill to queue");
      }
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">✨ Create New Skill</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skill Name
          </label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="e.g., Market Analysis, Research Summary"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt Template
          </label>
          <textarea
            value={skillPrompt}
            onChange={(e) => setSkillPrompt(e.target.value)}
            placeholder="Write your prompt template here. Use {{variable}} for dynamic inputs."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isCreating}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Create & Execute"}
          </button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Examples:</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <div>
            <strong>Market Research:</strong> "Analyze the {{industry}} market trends for {{timeframe}} with key insights and predictions."
          </div>
          <div>
            <strong>Competitor Analysis:</strong> "Compare {{company1}} and {{company2}} across their business models, strengths, and market positioning."
          </div>
          <div>
            <strong>News Summary:</strong> "Summarize the latest news in {{topic}} this week with citations from trusted sources."
          </div>
        </div>
      </div>
    </div>
  );
} 