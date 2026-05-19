import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:4174/';
const OUT_DIR = path.resolve('test-artifacts/layout');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const sections = [
  { id: 'lab', label: 'Lab' },
  { id: 'engineer', label: 'Engineer' },
  { id: 'ai-systems', label: 'AI Systems' },
  { id: 'markets', label: 'Markets' },
  { id: 'vision', label: 'Vision' },
  { id: 'connect', label: 'Connect' }
];

const viewports = [
  { name: 'desktop', viewport: { width: 1440, height: 1024 }, isMobile: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true }
];

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const getLayoutState = async (page) =>
  page.evaluate(() => {
    const activeFrame = [...document.querySelectorAll('.scene-frame')].find(
      (node) => Number.parseFloat(window.getComputedStyle(node).opacity) > 0.5
    );
    const nav = document.querySelector('header');

    const toRect = (node) => {
      if (!node) {
        return null;
      }

      const rect = node.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height
      };
    };

    const overlaps = (a, b) => {
      if (!a || !b) {
        return false;
      }

      return !(
        a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom
      );
    };

    const primary = activeFrame?.querySelector('.scene-panel--primary');
    const secondary = activeFrame?.querySelector('.scene-panel--secondary');
    const primaryRect = toRect(primary);
    const secondaryRect = toRect(secondary);
    const navRect = toRect(nav);

    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      primaryRect,
      secondaryRect,
      navRect,
      panelsOverlap: overlaps(primaryRect, secondaryRect),
      navHitsPrimary: overlaps(navRect, primaryRect),
      navHitsSecondary: overlaps(navRect, secondaryRect)
    };
  });

const assertLayout = (label, layout, isMobile) => {
  const errors = [];
  const rects = [layout.primaryRect, layout.secondaryRect].filter(Boolean);

  if (!layout.primaryRect) {
    errors.push(`${label}: missing primary panel`);
  }

  if (layout.panelsOverlap && !isMobile) {
    errors.push(`${label}: primary and secondary panels overlap`);
  }

  if (layout.navHitsPrimary || layout.navHitsSecondary) {
    errors.push(`${label}: navigation overlaps scene content`);
  }

  for (const rect of rects) {
    if (rect.left < 0 || rect.right > layout.viewport.width + 1) {
      errors.push(`${label}: panel exceeds viewport width`);
    }

    if (!isMobile && (rect.top < 0 || rect.bottom > layout.viewport.height + 1)) {
      errors.push(`${label}: panel exceeds viewport height`);
    }
  }

  return errors;
};

const openSection = async (page, section, isMobile) => {
  await page.evaluate((sectionId) => {
    window.location.hash = sectionId;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }, section.id);
  await page.waitForTimeout(isMobile ? 750 : 550);
};

const run = async () => {
  await ensureDir(OUT_DIR);

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const failures = [];
  const summary = [];

  try {
    for (const config of viewports) {
      const context = await browser.newContext({
        viewport: config.viewport,
        isMobile: config.isMobile,
        hasTouch: config.isMobile
      });
      const page = await context.newPage();

      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(900);

      for (const section of sections) {
        await openSection(page, section, config.isMobile);

        const screenshotPath = path.join(OUT_DIR, `${config.name}-${section.id}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        const layout = await getLayoutState(page);
        const errors = assertLayout(`${config.name}/${section.id}`, layout, config.isMobile);

        summary.push({
          viewport: config.name,
          section: section.id,
          screenshot: screenshotPath,
          ...layout,
          errors
        });

        failures.push(...errors);
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  const summaryPath = path.join(OUT_DIR, 'summary.json');
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));

  if (failures.length > 0) {
    throw new Error(failures.join('\n'));
  }

  console.log(`Layout verification passed. Summary written to ${summaryPath}`);
};

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
