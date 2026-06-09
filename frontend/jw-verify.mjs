import { chromium } from 'playwright-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:5173';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

// Load page, seed auth, then load the Stories deep link authed.
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => {
  localStorage.setItem('jw_token', 'verify-token');
  localStorage.setItem('jw_user', JSON.stringify({ name: 'Test User', email: 'test@example.com' }));
});
await page.goto(`${BASE}/es-en/app/learn/stories`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const heading = await page.locator('h1').first().textContent();
console.log('HEADING:', heading?.trim());

// Open account menu, then Settings.
await page.locator('button[title="Account"]').click();
await page.getByRole('menuitem', { name: 'Settings' }).click();
await page.getByRole('dialog', { name: 'Settings' }).waitFor({ state: 'visible' });
await page.waitForTimeout(400);

await page.screenshot({ path: '/tmp/jw-stories-settings.png' });

// Stacking probe: what element is painted on top where the heading sits?
const probe = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const r = h1.getBoundingClientRect();
  const x = Math.round(r.left + 5), y = Math.round(r.top + r.height / 2);
  const top = document.elementFromPoint(x, y);
  const dialog = document.querySelector('[role="dialog"][aria-label="Settings"]');
  const backdrop = dialog?.parentElement;
  return {
    headingText: h1.textContent.trim(),
    point: { x, y },
    topmostTag: top?.tagName,
    topmostText: (top?.textContent || '').trim().slice(0, 30),
    topmostInsideModal: backdrop ? backdrop.contains(top) : false,
    dialogMountedDirectlyOnBody: backdrop?.parentElement === document.body,
    dialogInsideAside: !!dialog?.closest('aside'),
  };
});
console.log('PROBE:', JSON.stringify(probe, null, 2));

await browser.close();
