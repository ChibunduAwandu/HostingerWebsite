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
    body{background:#f4f4ed}.site-header{padding:25px 45px;border:0}.site-header nav{display:none}
    .portfolio-intro{display:block;padding:80px 30px 0 45px;width:420px}.portfolio-intro h1{font-size:62px}
    .portfolio-summary>p{font-size:18px;line-height:1.65;margin-top:30px}.portfolio-role{font-size:14px}
    .experience-index,.portfolio-actions,.motion-lab,.apple-role,.apple-introduction,.apple-outcomes,.apple-story-tabs,.apple-story-copy,.apple-contribution-ledger,.apple-source-note{display:none!important}
    .apple-experience{position:absolute;left:430px;top:90px;right:35px;margin:0;border:0}
    .apple-header{padding:0}.apple-header h2{font-size:52px;margin:0;line-height:1.2}
    .apple-story-panel{display:block;padding:12px 0 0}.apple-study{padding:18px}
    .apple-board-heading{margin-bottom:10px}.apple-mode-switch,.apple-trace-controls,.apple-live-status{display:none}
    .apple-experience figure{margin:0}.apple-request-path{padding:16px 0}
    .apple-experience figcaption{font-size:11px;line-height:1.5;margin-top:14px}
    .apple-node{padding:12px}.apple-node strong{font-size:14px}.apple-node>span{font-size:11px!important}
    .systems-section,.engineer-section,.practice-strip,.contact-section,footer{display:none}
  `,
  });
  await page.screenshot({ path: "public/social-preview.png" });
} finally {
  await close();
}
