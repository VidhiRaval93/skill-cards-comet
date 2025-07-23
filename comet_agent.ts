import { chromium, Browser, Page } from 'playwright';
import fs from 'fs/promises';

interface SkillPrompt {
  prompt: string;
}

async function runCometSkill(): Promise<void> {
  try {
    // Read the skills queue
    const queueData = await fs.readFile('./skills_queue.json', 'utf-8');
    const queue: SkillPrompt[] = JSON.parse(queueData);
    const skill = queue.shift(); // take first prompt
    
    if (!skill) {
      console.log("No skill prompt found in queue.");
      return;
    }

    console.log(`🎯 Running skill: ${skill.prompt}`);

    // Save updated queue (remove the processed skill)
    await fs.writeFile('./skills_queue.json', JSON.stringify(queue, null, 2));
    console.log(`📝 Updated queue - ${queue.length} skills remaining`);

    // Launch browser
    const browser: Browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page: Page = await context.newPage();

    console.log("🌐 Opening Comet browser...");

    // Open Comet browser page
    await page.goto('https://comet.perplexity.ai/');

    // Wait for search bar to appear (adjust selector as needed)
    console.log("⏳ Waiting for search input...");
    const input = await page.waitForSelector('input[type="search"], input[placeholder*="search"], textarea', { timeout: 10000 });

    // Type the prompt slowly
    console.log("⌨️  Typing prompt...");
    await input.focus();
    await page.keyboard.type(skill.prompt, { delay: 30 });

    // Press Enter
    console.log("🚀 Submitting prompt...");
    await page.keyboard.press('Enter');

    // Wait for result (adjust selector based on Comet's actual result area)
    console.log("⏳ Waiting for results...");
    try {
      await page.waitForSelector('[data-testid="SearchResult"], .result, .response, .answer', { timeout: 15000 });
      console.log("✅ Skill ran successfully!");
    } catch (error) {
      console.log("⚠️  Could not detect result area, but continuing...");
    }

    // Keep browser open for a moment to see results
    console.log("👀 Keeping browser open for 5 seconds to view results...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();
    console.log("🔒 Browser closed.");

  } catch (error) {
    console.error("❌ Error running skill:", error instanceof Error ? error.message : String(error));
  }
}

// Run the function
runCometSkill(); 