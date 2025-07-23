import { chromium } from 'playwright';
import fs from 'fs/promises';
import { runSkill } from './comet_control.js';

const queuePath = './skills_queue.json';

async function runCometSkill() {
  console.log('📖 Reading skills queue...');
  
  // Load skill prompt
  const queue = JSON.parse(await fs.readFile(queuePath, 'utf-8'));
  const skill = queue.shift();
  
  if (!skill) {
    console.log('❌ No skills left in queue.');
    return;
  }

  await fs.writeFile(queuePath, JSON.stringify(queue, null, 2));
  console.log(`🎯 Processing skill: ${skill.prompt}`);
  console.log(`📊 Queue status: ${queue.length} skills remaining`);

  // Route based on mode
  const mode = skill.mode || 'browser'; // Default to browser if no mode specified
  console.log(`🎯 Executing skill in ${mode} mode: ${skill.prompt}`);
  
  try {
    await runSkill(skill.prompt, mode);
    console.log('🎉 Skill execution completed successfully!');
  } catch (error) {
    console.error('❌ Error executing skill:', error.message);
  }
}

runCometSkill(); 