// comet_debug.ts
import { chromium } from 'playwright';

async function main() {
  try {
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const contexts = browser.contexts();
    const context = contexts.length ? contexts[0] : await browser.newContext();
    const pages = context.pages();

    const page = pages.length ? pages[0] : await context.newPage();
    console.log("✅ Connected to Comet Desktop!");

    // Try to focus and type into the search box
    console.log("🔍 Looking for search input...");
    const input = await page.waitForSelector('input[type="search"]', { timeout: 10000 });
    console.log("✅ Found search input!");
    
    await input.click();
    await input.fill('Compare OpenAI and Anthropic');
    console.log("📝 Filled search input with prompt");
    
    await page.keyboard.press('Enter');
    console.log("🚀 Submitted prompt");

    // Optional: wait for result area to appear
    console.log("⏳ Waiting for results...");
    await page.waitForTimeout(5000); // or use a selector like '[data-testid="SearchResult"]'

    console.log("✅ Prompt typed and submitted.");
    
    // Keep the connection open for a bit to see results
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : String(error));
    console.log("💡 Make sure Chrome is running with --remote-debugging-port=9222");
  }
}

main(); 