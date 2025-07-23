import { runSkill } from './comet_control';
import fs from 'fs/promises';

interface SkillPrompt {
  prompt: string;
}

async function triggerSkill(): Promise<void> {
  try {
    console.log("🚀 Starting skill trigger...");
    
    // Read skills queue
    console.log("📖 Reading skills queue...");
    const queueData = await fs.readFile('./skills_queue.json', 'utf-8');
    const queue: SkillPrompt[] = JSON.parse(queueData);
    
    if (queue.length === 0) {
      console.log("📭 Skills queue is empty. No skills to execute.");
      return;
    }

    // Take the first skill from the queue
    const skill = queue.shift();
    if (!skill) {
      console.log("❌ No skill found in queue.");
      return;
    }

    console.log("🧪 Skill pulled from queue:", skill.prompt);
    console.log(`🎯 Processing skill: ${skill.prompt}`);
    console.log(`📊 Queue status: ${queue.length} skills remaining`);

    // Execute the skill
    console.log("⚡ Executing skill in Comet...");
    await runSkill(skill.prompt, 'assistant');
    
    // Update the queue file (remove the processed skill)
    console.log("💾 Updating skills queue...");
    await fs.writeFile('./skills_queue.json', JSON.stringify(queue, null, 2));
    console.log(`✅ Queue updated - ${queue.length} skills remaining`);

    console.log("🎉 Skill execution completed successfully!");

  } catch (error) {
    console.error("❌ Error in skill trigger:", error instanceof Error ? error.message : String(error));
    
    // Log additional context for debugging
    if (error instanceof Error) {
      console.error("📋 Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack
      });
    }
    
    console.log("💡 Troubleshooting tips:");
    console.log("   - Make sure Chrome is running with --remote-debugging-port=9222");
    console.log("   - Ensure Comet is open in the Chrome instance");
    console.log("   - Check that skills_queue.json exists and is valid JSON");
  }
}

// Run the trigger function
triggerSkill(); 