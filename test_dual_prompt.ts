// test_dual_prompt.ts
import { runSkill } from './comet_control';

(async () => {
  console.log("🧪 Testing Run in Browser...");
  await runSkill('What is the capital of Canada?', 'browser');

  console.log("🧪 Testing Run in Assistant...");
  await runSkill('Summarize the causes of World War I in 3 bullet points.', 'assistant');
})(); 