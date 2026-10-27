import { launchVerificationBrowser } from "./verification-browser.mjs";
import fs from "node:fs/promises";

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = await fs.access(chrome).then(
  () => chrome,
  () => undefined,
);
const { browser, close } = await launchVerificationBrowser({
  executablePath,
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:4175/", {
    waitUntil: "networkidle",
  });
  await page.locator('[data-testid="apple-request-study"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  // Capture actual case-study HTML. No employer screenshots or fabricated systems.
  await page.addStyleTag({
    content: `
    body{background:#fff}.site-nav,.skip-link{display:none!important}
    .hero{position:absolute;left:56px;top:0;width:400px;margin:0;padding:120px 0 0;text-align:left;animation:none}
    .hero>*{animation:none!important}.hero h1{font-size:68px;margin:0;max-width:none}
    .hero-kicker{font-size:20px}.hero-lede{font-size:24px;margin:28px 0 0;max-width:none}
    .hero-actions,.highlights,.motion-lab,.engineer-section,.about-section,.contact-section,.site-footer{display:none!important}
    .apple-header,.apple-introduction,.apple-outcomes,.apple-story-tabs,.apple-story-copy,.apple-contribution-ledger,.apple-source-note{display:none!important}
    .apple-experience{position:absolute;left:500px;top:96px;width:650px;margin:0;padding:0;border:0}
    .apple-story-panel{display:block;padding:0}.apple-study{padding:24px}
    .apple-board-heading{margin-bottom:12px}.apple-mode-switch,.apple-trace-controls,.apple-live-status{display:none}
    .apple-experience figure{margin:0}.apple-request-path{padding:16px 0}
    .apple-node{padding:12px}.apple-node strong{font-size:14px}.apple-node>span{font-size:11px!important}
  `,
  });
  await page.screenshot({ path: "public/social-preview.png" });
} finally {
  await close();
}
