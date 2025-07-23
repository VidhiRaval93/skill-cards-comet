// test_iframe_assistant.ts
import { chromium } from 'playwright';

const TARGET_URL = 'https://www.perplexity.ai/sidecar?copilot=true';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`🎯 Navigating to: ${TARGET_URL}`);
  await page.goto(TARGET_URL);
  await page.waitForLoadState('domcontentloaded');

  const frames = page.frames();
  console.log(`📦 Found ${frames.length} iframe(s) on the page`);

  let success = false;

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];

    try {
      console.log(`🔍 Checking iframe ${i + 1}...`);
      console.log(`   🔗 URL: ${frame.url()}`);

      const button = frame.locator('text=Assistant');

      // See if element is attached at all
      if (await button.count() === 0) {
        console.warn(`   ⚠️ No "Assistant" text element found in iframe ${i + 1}`);
        continue;
      }

      // Try scroll + wait
      await button.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      if (await button.isVisible()) {
        await button.click();
        console.log(`✅ Clicked Assistant in iframe ${i + 1}`);
        success = true;
        break;
      } else {
        console.warn(`   ❌ Assistant button in iframe ${i + 1} is not visible, taking screenshot...`);
        await page.screenshot({ path: `iframe-${i + 1}.png`, fullPage: true });
      }
    } catch (err) {
      console.error(`❌ Could not access iframe ${i + 1}:`, err.message);
    }
  }

  if (!success) {
    console.log('🔄 Trying fallback (main page) approach...');
    try {
      const fallback = page.locator('text=Assistant');
      await fallback.scrollIntoViewIfNeeded();
      await fallback.click();
      console.log('✅ Clicked Assistant via fallback approach');
    } catch (err) {
      console.error('❌ Fallback approach failed:', err.message);
    }
  }

  await page.waitForTimeout(3000); // wait before closing
  await browser.close();
})(); 