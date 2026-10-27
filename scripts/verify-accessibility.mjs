import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { launchVerificationBrowser } from "./verification-browser.mjs";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL || "http://127.0.0.1:4278/";
const out = "test-artifacts/accessibility";
await fs.mkdir(out, { recursive: true });
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = await fs.access(chrome).then(
  () => chrome,
  () => undefined,
);
const server = process.env.BASE_URL
  ? null
  : spawn(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "preview",
        "--host",
        "127.0.0.1",
        "--port",
        "4278",
        "--strictPort",
      ],
      { stdio: "pipe" },
    );
let browser;
let closeBrowser;
const results = [];
async function audit(page, name) {
  const report = await new AxeBuilder({ page })
    .withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
      "wcag22aa",
      "best-practice",
    ])
    .analyze();
  // Retain incomplete checks for manual review; no rule exclusions or blanket passes.
  await fs.writeFile(
    `${out}/${name}.json`,
    JSON.stringify(
      {
        violations: report.violations,
        incomplete: report.incomplete,
        passes: report.passes.map((p) => p.id),
      },
      null,
      2,
    ),
  );
  assert.deepEqual(
    report.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
      reasons: v.nodes.map((n) => n.failureSummary),
    })),
    [],
    name,
  );
  results.push({
    name,
    violations: 0,
    manualReview: report.incomplete.map((v) => v.id),
  });
  console.log(`PASS ${name}`);
}
async function reflow(page, label) {
  const problems = await page.evaluate(() => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 1)
      issues.push("Horizontal page overflow");
    for (const el of document.querySelectorAll(
      ".site-nav a,.hero a,.apple-experience button,.apple-experience a,.motion-lab button,.motion-lab input,.explorer button,.explorer input,.social-links a,.email-link,.footer-bar a",
    )) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.width < 43 || r.height < 43)
        issues.push(
          `Small target: ${el.textContent || el.getAttribute("aria-label")}`,
        );
      if (r.left < -1 || r.right > innerWidth + 1)
        issues.push(`Clipped target: ${el.textContent}`);
      if (el.scrollWidth > el.clientWidth + 2)
        issues.push(`Content overflows control: ${el.textContent}`);
    }
    for (const selector of [
      ".hero h1",
      ".highlight-tile",
      ".about-facts",
      ".apple-story-copy",
      ".apple-study",
      ".lab-heading h2",
      ".chapter-console",
      ".work-item",
      ".notes-dialog[open]",
    ]) {
      for (const el of document.querySelectorAll(selector)) {
        if (el.scrollWidth > el.clientWidth + 2)
          issues.push(`Text overflow: ${selector}`);
      }
    }
    const stage = document
      .querySelector(".lab-viewport")
      ?.getBoundingClientRect();
    const panel = document
      .querySelector(".chapter-console")
      ?.getBoundingClientRect();
    if (
      stage &&
      panel &&
      Math.min(stage.right, panel.right) - Math.max(stage.left, panel.left) >
        1 &&
      Math.min(stage.bottom, panel.bottom) - Math.max(stage.top, panel.top) > 1
    )
      issues.push("Lab controls overlap the canvas");
    return issues;
  });
  assert.deepEqual(problems, [], label);
}
async function ready(page) {
  // The 3D world mounts only once the lab nears the viewport.
  await page.locator("#laboratory").scrollIntoViewIfNeeded();
  await page
    .locator('[data-testid="lab-stage"][data-ready="true"]')
    .waitFor({ timeout: 30000 });
}
try {
  if (server)
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Preview startup timed out")),
        15000,
      );
      server.once("exit", (code) => {
        clearTimeout(timer);
        reject(new Error(`Preview exited ${code}`));
      });
      server.stdout.on("data", (data) => {
        if (data.toString().includes("4278")) {
          clearTimeout(timer);
          resolve();
        }
      });
    });
  ({ browser, close: closeBrowser } = await launchVerificationBrowser({
    executablePath,
    headless: true,
  }));
  for (const config of [
    { name: "desktop", width: 1440 },
    { name: "mobile", width: 390 },
    { name: "reflow-320", width: 320 },
    { name: "text-200", width: 1280, text: true },
    { name: "text-spacing", width: 390, spacing: true },
    { name: "reduced-motion", width: 390, reduced: true },
    { name: "forced-colors", width: 390, forced: true },
  ].filter((c) => !process.env.CASE || c.name === process.env.CASE)) {
    const context = await browser.newContext({
      viewport: { width: config.width, height: 1000 },
      reducedMotion: config.reduced ? "reduce" : "no-preference",
      forcedColors: config.forced ? "active" : "none",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await ready(page);
    await page.evaluate(() => document.fonts.ready);
    if (config.text)
      await page.addStyleTag({ content: "html{font-size:200% !important}" });
    if (config.spacing)
      await page.addStyleTag({
        content:
          "*{line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important}p{margin-bottom:2em !important}",
      });
    assert.equal(await page.getByRole("heading", { level: 1 }).count(), 1);
    await page.keyboard.press("Tab");
    assert.equal(
      await page.locator(":focus").innerText(),
      "Skip to work experience",
    );
    const focus = await page.locator(":focus").evaluate((el) => ({
      outline: getComputedStyle(el).outlineStyle,
      top: el.getBoundingClientRect().top,
    }));
    assert.equal(focus.outline, "solid");
    assert(focus.top >= 0, "Skip link is hidden");
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(":focus").getAttribute("id"), "engineer");
    await page.keyboard.press("Tab");
    assert.match(
      await page.locator(":focus").getAttribute("href"),
      /Resume\.pdf$/,
    );
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await audit(page, `${config.name}-perceive`);
    await reflow(page, `${config.name}-perceive`);
    await page.screenshot({ path: `${out}/${config.name}-intro.png` });
    await page.getByRole("button", { name: "Material", exact: true }).hover();
    await audit(page, `${config.name}-selected-hover`);
    await page.getByRole("tab", { name: /Process/ }).focus();
    await page.keyboard.press("Enter");
    await ready(page);
    await page.getByRole("button", { name: "Disable lab worker 2" }).click();
    await audit(page, `${config.name}-process-failure`);
    await reflow(page, `${config.name}-process`);
    await page.getByRole("tab", { name: /Process/ }).focus();
    await page.keyboard.press("ArrowRight");
    assert.match(await page.locator(":focus").innerText(), /Act/);
    await ready(page);
    await page
      .getByRole("slider", { name: "Robot cycle timeline" })
      .press("End");
    assert.match(
      await page
        .getByRole("slider", { name: "Robot cycle timeline" })
        .getAttribute("aria-valuetext"),
      /100 percent, Cycle complete/,
    );
    await audit(page, `${config.name}-act`);
    await reflow(page, `${config.name}-act`);
    if (config.reduced) {
      assert(
        await page
          .getByRole("button", { name: "Follow the signal" })
          .isDisabled(),
      );
      assert(await page.getByText(/Reduced motion is on/).isVisible());
    }
    await page.getByRole("tab", { name: /Act/ }).press("Home");
    await ready(page);
    await page.locator(".lab-navigation").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${out}/${config.name}-lab.png` });
    await page.getByRole("button", { name: "Open component explorer" }).click();
    await page
      .locator('[data-testid="exhibit-stage"][data-ready="true"]')
      .waitFor({ timeout: 30000 });
    await audit(page, `${config.name}-explorer`);
    await reflow(page, `${config.name}-explorer`);
    await page.getByRole("button", { name: "Toggle studio lighting" }).click();
    await audit(page, `${config.name}-explorer-dark`);
    await page.locator(".part-row").first().click();
    await page.getByRole("button", { name: "Isolate", exact: true }).click();
    await page
      .locator(".part-actions")
      .getByRole("button", { name: "Show all" })
      .hover();
    await audit(page, `${config.name}-isolated-hover`);
    await reflow(page, `${config.name}-isolated`);
    await page
      .getByRole("button", { name: "Clear selection", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Credits & how to explore" })
      .click();
    await page.getByRole("dialog").waitFor();
    await audit(page, `${config.name}-credits`);
    await reflow(page, `${config.name}-credits`);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog[open]").count(), 0);
    assert.match(await page.locator(":focus").innerText(), /Credits/);
    assert.deepEqual(errors, [], "Browser runtime errors");
    await context.close();
  }
} finally {
  await fs.writeFile(
    `${out}/results${process.env.CASE ? `-${process.env.CASE}` : ""}.json`,
    JSON.stringify(results, null, 2),
  );
  await closeBrowser?.();
  server?.kill();
}
