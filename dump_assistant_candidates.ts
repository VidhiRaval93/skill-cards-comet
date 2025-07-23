// dump_assistant_candidates.ts
import { chromium } from 'playwright';

async function dumpAssistantCandidates() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();

  for (const context of contexts) {
    for (const page of context.pages()) {
      const url = page.url();
      const title = await page.title();
      console.log(`🔍 Tab: ${title} — ${url}`);

      if (url.includes("perplexity.ai/sidecar")) {
        console.log(`🎯 Inspecting Sidecar tab...`);

        // Query all elements with innerText "Assistant"
        const candidates = await page.$$('*:text("Assistant")');

        if (candidates.length === 0) {
          console.log("❌ No elements with exact text 'Assistant' found.");
        }

        for (const el of candidates) {
          const text = await el.innerText();
          const html = await el.evaluate(el => el.outerHTML);
          const box = await el.boundingBox();
          const visible = await el.isVisible();

          console.log("\n==========================");
          console.log(`🔎 Text: ${text}`);
          console.log(`📍 x=${box?.x}, y=${box?.y}`);
          console.log(`👁️ Visible: ${visible}`);
          console.log(`📄 outerHTML:\n${html}`);
        }

        await browser.close();
        return;
      }
    }
  }

  console.log("❌ Could not find sidecar tab or Assistant candidates.");
  await browser.close();
}

dumpAssistantCandidates(); 