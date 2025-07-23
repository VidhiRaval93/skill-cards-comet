// comet_control.ts
import { chromium } from 'playwright';

export async function runSkill(prompt: string, mode: 'browser' | 'assistant') {
  console.log(`⚙️ Running skill in mode: ${mode}`);
  
  if (mode === 'browser') {
    await runInCometBrowser(prompt);
  } else if (mode === 'assistant') {
    await runInCometAssistant(prompt);
  } else {
    console.error(`Unknown mode: ${mode}`);
  }
}

async function runInCometBrowser(prompt: string): Promise<void> {
  console.log('🌐 Running in Comet Browser mode...');
  
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to Comet's main search interface
  try {
    await page.goto('https://www.perplexity.ai/b/home', { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    console.log('✅ Successfully loaded Comet browser interface');
  } catch (err) {
    console.error('❌ Failed to load Comet browser interface:', err.message);
    throw new Error('Could not load Comet browser interface');
  }
  
  console.log('🔍 Looking for search input in browser mode...');
  
  // Try multiple selectors for the search input field
  const inputSelectors = [
    'input[type="search"]',
    'input[placeholder*="search"]',
    'input[placeholder*="ask"]',
    'textarea',
    'input[type="text"]',
    '[contenteditable="true"]'
  ];
  
  let inputFound = false;
  for (const selector of inputSelectors) {
    try {
      console.log(`🔍 Trying input selector: ${selector}`);
      await page.waitForSelector(selector, { timeout: 5000 });
      
      // Check if it's visible and interactable
      const element = page.locator(selector);
      if (await element.isVisible()) {
        console.log(`✅ Found input with selector: ${selector}`);
        
        // Clear any existing content and type the prompt
        await element.click();
        await element.fill(''); // Clear existing content
        await element.type(prompt, { delay: 30 });
        await page.keyboard.press('Enter');
        
        inputFound = true;
        console.log("🚀 Prompt submitted to Comet Browser");
        break;
      }
    } catch (err) {
      console.log(`❌ Selector ${selector} failed:`, err.message);
      continue;
    }
  }
  
  if (!inputFound) {
    // Fallback: try to find any input and use keyboard typing
    console.log('🔄 Trying fallback input method...');
    try {
      const anyInput = page.locator('input, textarea, [contenteditable]').first();
      await anyInput.waitFor({ timeout: 5000 });
      await anyInput.click();
      await page.keyboard.type(prompt, { delay: 30 });
      await page.keyboard.press('Enter');
      console.log("🚀 Prompt submitted via fallback method");
    } catch (err) {
      console.error('❌ All input methods failed:', err.message);
      throw new Error('Could not find or interact with browser input field');
    }
  }
  
  // Keep the browser open for a bit to see results
  console.log('⏳ Waiting for results...');
  await page.waitForTimeout(8000);
  
  await browser.close();
  console.log('🔒 Browser connection closed');
}

async function runInCometAssistant(prompt: string): Promise<void> {
  console.log('🤖 Running in Comet Assistant mode...');
  
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to Comet's assistant interface - prioritize sidecar URL
  const assistantUrls = [
    'https://www.perplexity.ai/sidecar?copilot=true',  // Primary - most reliable
    'https://www.perplexity.ai/?assistant=true',       // Fallback
    'https://www.perplexity.ai/assistant'              // Alternative
  ];
  
  let pageLoaded = false;
  for (const url of assistantUrls) {
    try {
      console.log(`🔗 Trying assistant URL: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      pageLoaded = true;
      console.log(`✅ Successfully loaded: ${url}`);
      
      // Verify we're in assistant mode
      const bodyText = await page.textContent('body');
      const hasAssistantText = bodyText?.toLowerCase().includes('assistant');
      const hasAskAnything = bodyText?.toLowerCase().includes('ask anything');
      
      console.log(`🔍 Assistant mode verification:`);
      console.log(`   - Contains "assistant": ${hasAssistantText}`);
      console.log(`   - Contains "ask anything": ${hasAskAnything}`);
      
      if (hasAssistantText || hasAskAnything) {
        console.log(`✅ Confirmed: We're in the assistant interface`);
        break;
      } else {
        console.log(`⚠️ Warning: May not be in assistant interface, trying next URL...`);
        pageLoaded = false;
        continue;
      }
    } catch (err) {
      console.log(`❌ Failed to load ${url}:`, err.message);
      continue;
    }
  }
  
  if (!pageLoaded) {
    throw new Error('Failed to load any assistant URL');
  }
  
  console.log('🧭 Looking for Assistant interface...');
  
  // Try multiple selectors for the assistant input field
  const inputSelectors = [
    'textarea[placeholder*="Ask anything"]',
    'textarea[placeholder*="ask"]',
    'textarea[placeholder*="Ask"]',
    '[data-lexical-editor="true"]',
    '[contenteditable="true"]',
    'input[type="text"]',
    'textarea'
  ];
  
  let inputFound = false;
  for (const selector of inputSelectors) {
    try {
      console.log(`🔍 Trying input selector: ${selector}`);
      await page.waitForSelector(selector, { timeout: 5000 });
      
      // Check if it's visible and interactable
      const element = page.locator(selector);
      if (await element.isVisible()) {
        console.log(`✅ Found input with selector: ${selector}`);
        
        // Clear any existing content and type the prompt
        await element.click();
        await element.fill(''); // Clear existing content
        await element.type(prompt, { delay: 30 });
        await page.keyboard.press('Enter');
        
        inputFound = true;
        console.log("🚀 Prompt submitted to Comet Assistant");
        break;
      }
    } catch (err) {
      console.log(`❌ Selector ${selector} failed:`, err.message);
      continue;
    }
  }
  
  if (!inputFound) {
    // Fallback: try to find any input and use keyboard typing
    console.log('🔄 Trying fallback input method...');
    try {
      const anyInput = page.locator('input, textarea, [contenteditable]').first();
      await anyInput.waitFor({ timeout: 5000 });
      await anyInput.click();
      await page.keyboard.type(prompt, { delay: 30 });
      await page.keyboard.press('Enter');
      console.log("🚀 Prompt submitted via fallback method");
    } catch (err) {
      console.error('❌ All input methods failed:', err.message);
      throw new Error('Could not find or interact with assistant input field');
    }
  }
  
  // Keep the browser open for a bit to see results
  console.log('⏳ Waiting for results...');
  await page.waitForTimeout(8000);
  
  await browser.close();
  console.log('🔒 Browser connection closed');
} 