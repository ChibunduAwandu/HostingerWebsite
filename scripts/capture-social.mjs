import { chromium } from "playwright";
import fs from "node:fs/promises";

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = await fs.access(chrome).then(
  () => chrome,
  () => undefined,
);
const browser = await chromium.launch({ executablePath, headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:4175/", {
    waitUntil: "networkidle",
  });
  await page.locator('[data-ready="true"][data-parts="15"]').waitFor();
  // A screenshot-only layout of the real application, not a fabricated model render.
  await page.addStyleTag({
    content: `
    .site-header{padding:25px 45px;border:0}.site-header nav{display:none}
    .exhibit{padding:30px 45px}.exhibit-intro{display:block;width:460px;margin:0}
    h1{font-size:68px;line-height:1.08;margin:24px 0}.intro-note{max-width:345px;margin-top:30px}
    .intro-note>.eyebrow{font-size:8px}.intro-note p{font-size:14px}.intro-note a{display:none}
    .collection-tabs,.inspector,.assembly-bar,.view-tools,.stage-caption,.stage-meta,.study-links button{display:none}
    .explorer{position:absolute;top:125px;right:40px;width:610px;display:block;border:0}
    .stage-view{height:420px}.stage-column{border-radius:4px;overflow:hidden}
    .study-links{position:absolute;top:552px;right:40px;width:610px;padding:0;display:block}
    .study-links p{max-width:100%;font-size:8px}
    .systems-section,.engineer-section,.practice-strip,.contact-section,footer{display:none}
  `,
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: "public/social-preview.png" });
} finally {
  await browser.close();
}
