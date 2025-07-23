// test_click_sidebar_assistant.ts
import { chromium } from 'playwright';

async function clickSidebarAssistant() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();

  for (const context of contexts) {
    for (const page of context.pages()) {
      const url = page.url();
      const title = await page.title();
      console.log(`🔍 Found tab: ${title} — ${url}`);

      // ✅ Target ONLY the correct tab
      if (url.includes("perplexity.ai/sidecar")) {
        console.log(`🎯 Targeting correct Sidecar tab: ${title}`);

        const assistantButtons = await page.$$('text=Assistant');

        for (const button of assistantButtons) {
          const box = await button.boundingBox();
          const text = await button.innerText();
          const outerHTML = await button.evaluate(el => el.outerHTML);

          console.log(`💬 Assistant candidate → text="${text}", x=${box?.x}, outerHTML=${outerHTML}`);

          if (
            box && box.x < 100 && // Sidebar is on far left
            text.trim() === "Assistant" && // Not "Try Assistant"
            outerHTML.includes("font-display") // Only sidebar one had this class
          ) {
            console.log(`✅ Clicking correct sidebar Assistant: ${text}`);
            await button.click();
            await page.waitForSelector('[data-lexical-editor="true"]', { timeout: 5000 });
            console.log("🎉 Sidebar Assistant opened successfully!");
            
            // Keep browser open for inspection
            console.log("⏳ Keeping browser open for 10 seconds to inspect...");
            await page.waitForTimeout(10000);
            await browser.close();
            return;
          }
        }
        
        console.log("❌ No suitable sidebar Assistant button found");
      }
    }
  }
  
  console.log("❌ No sidecar tab found");
  await browser.close();
}

clickSidebarAssistant(); 