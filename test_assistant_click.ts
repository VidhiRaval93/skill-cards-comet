// test_assistant_click.ts
import { chromium } from 'playwright';

async function openAssistantTab() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();

  for (const context of contexts) {
    for (const page of context.pages()) {
      const url = page.url();
      const title = await page.title();
      console.log(`🔍 Found tab: ${title} — ${url}`);

      if (url.includes("perplexity.ai")) {
        console.log(`🎯 Targeting Comet tab: ${title}`);

        try {
          console.log("🔍 Looking for Assistant button...");
          const currentUrl = page.url();
          console.log(`📍 Current URL: ${currentUrl}`);
          
          // Try multiple approaches to find and click Assistant button
          let assistantClicked = false;
          
          // Approach 1: Scoped sidebar query — try to find sidebar or nav container
          try {
            const sidebarAssistant = await page.$('aside nav >> text=Assistant');
            if (sidebarAssistant) {
              console.log("✅ Found sidebar Assistant button (scoped nav), clicking...");
              await sidebarAssistant.click();
              await page.waitForSelector('[data-lexical-editor="true"]', { timeout: 5000 });
              console.log("🎉 Assistant input field found and ready!");
              assistantClicked = true;
            }
          } catch (e) {
            console.log("❌ Sidebar Assistant button not found or failed to click");
          }
          
          // Approach 2: If sidebar approach failed, try the robust position-based approach
          if (!assistantClicked) {
            console.log("🔍 Trying position-based Assistant button detection...");
            const allAssistantButtons = await page.$$('text=Assistant');
            
            // Debug: Log all Assistant button candidates
            for (const button of allAssistantButtons) {
              const text = await button.innerText();
              const html = await button.evaluate(el => el.outerHTML);
              const box = await button.boundingBox();
              console.log(`💬 Assistant candidate → text="${text}", x=${box?.x}, outerHTML=${html}`);
            }

            // More precise sidebar detection
            for (const el of allAssistantButtons) {
              const text = await el.innerText();
              const outerHTML = await el.evaluate(el => el.outerHTML);
              const box = await el.boundingBox();

              if (
                box && box.x < 100 && // Sidebar is on far left
                text.trim() === "Assistant" && // Not "Try Assistant"
                outerHTML.includes("font-display") // Only sidebar one had this class
              ) {
                console.log(`✅ Clicking correct sidebar Assistant: ${text}`);
                await el.click();
                await page.waitForSelector('[data-lexical-editor="true"]', { timeout: 5000 });
                console.log("🎉 Sidebar Assistant opened successfully!");
                assistantClicked = true;
                break;
              }
            }
          }
          
          // Approach 3: If still no success, try clicking the first Assistant button found
          if (!assistantClicked) {
            console.log("🔍 Trying to click first available Assistant button...");
            try {
              await page.click('text=Assistant', { timeout: 3000 });
              await page.waitForSelector('[data-lexical-editor="true"]', { timeout: 5000 });
              console.log("🎉 Assistant input field found and ready!");
              assistantClicked = true;
            } catch (e) {
              console.log("❌ Failed to click any Assistant button");
            }
          }

          console.log("⏳ Keeping browser open for 5 seconds to inspect...");
          await page.waitForTimeout(5000);
          
        } catch (e) {
          console.error("❌ Failed to open Assistant view:", e);
          console.log("🔍 Current page state:");
          try { 
            console.log(`📍 URL: ${page.url()}`); 
            console.log(`📄 Title: ${await page.title()}`); 
          } catch (e2) { 
            console.log("❌ Could not get page info - page may be closed"); 
          }
        }
      }
    }
  }
  // Keep browser open for inspection
  console.log("🔍 Keeping browser open for manual inspection...");
  await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
  await browser.close();
}

openAssistantTab(); 