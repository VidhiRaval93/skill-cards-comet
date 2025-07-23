// click_assistant_sidebar.ts
import { chromium } from 'playwright';

async function clickSidebarAssistant() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];

  const pages = context.pages();
  
  // First try sidecar interface
  for (const page of pages) {
    const url = page.url();
    if (!url.includes("perplexity.ai/sidecar")) continue;

    console.log(`🎯 Targeting Sidecar tab: ${url}`);

    try {
      // Click hamburger or side-toggle if sidebar is collapsed
      console.log("🔍 Checking if sidebar is collapsed...");
      const toggle = page.locator('[aria-label="Toggle Sidebar"]'); // adjust selector
      if (await toggle.isVisible()) {
        console.log("📱 Sidebar is collapsed, expanding...");
        await toggle.click();
        await page.waitForTimeout(500);
        console.log("✅ Sidebar expanded");
      } else {
        console.log("✅ Sidebar is already visible");
      }

      // Use the mouse click approach with bounding box
      const assistantButton = await page.locator('text=Assistant').first();
      await assistantButton.scrollIntoViewIfNeeded();

      const box = await assistantButton.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        console.log("✅ Clicked sidebar Assistant via bounding box");
        
        await page.waitForSelector('[data-lexical-editor="true"]', { 
          state: 'visible',
          timeout: 10000 
        });
        console.log(`🎉 Sidecar Assistant input is ready!`);
        await browser.close();
        return;
      } else {
        console.log("❌ Failed to get bounding box for Assistant button");
      }
    } catch (error) {
      console.log(`❌ Sidecar Assistant click failed: ${error.message}`);
    }
  }

  // Fallback to main interface
  for (const page of pages) {
    const url = page.url();
    if (!url.includes("perplexity.ai/b/home")) continue;

    console.log(`🎯 Targeting Main Comet tab: ${url}`);

    try {
      // Click hamburger or side-toggle if sidebar is collapsed
      console.log("🔍 Checking if sidebar is collapsed...");
      const toggle = page.locator('[aria-label="Toggle Sidebar"]'); // adjust selector
      if (await toggle.isVisible()) {
        console.log("📱 Sidebar is collapsed, expanding...");
        await toggle.click();
        await page.waitForTimeout(500);
        console.log("✅ Sidebar expanded");
      } else {
        console.log("✅ Sidebar is already visible");
      }

      // Use the mouse click approach with bounding box
      const assistantButton = await page.locator('text=Assistant').first();
      await assistantButton.scrollIntoViewIfNeeded();

      const box = await assistantButton.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        console.log("✅ Clicked main Assistant via bounding box");
        
        await page.waitForSelector('[data-lexical-editor="true"]', { 
          state: 'visible',
          timeout: 10000 
        });
        console.log(`🎉 Main Assistant input is ready!`);
        await browser.close();
        return;
      } else {
        console.log("❌ Failed to get bounding box for Assistant button");
      }
    } catch (error) {
      console.log(`❌ Main Assistant click failed: ${error.message}`);
    }
  }

  console.log("❌ Could not find or click Assistant button in any Comet interface.");
  await browser.close();
}

clickSidebarAssistant(); 