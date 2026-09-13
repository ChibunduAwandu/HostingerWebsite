import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import AxeBuilder from "@axe-core/playwright";
import { launchVerificationBrowser } from "./verification-browser.mjs";

const base = process.env.BASE_URL || "http://127.0.0.1:4279/";
const out = "test-artifacts/apple";
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
        "4279",
        "--strictPort",
      ],
      { stdio: "pipe" },
    );
const results = [];
let closeBrowser;

async function audit(page, name) {
  const report = await new AxeBuilder({ page })
    .include("#engineer")
    .withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
      "wcag22aa",
      "best-practice",
    ])
    .analyze();
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
  const layout = await page.evaluate(() => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 1)
      issues.push("Horizontal page overflow");
    for (const el of document.querySelectorAll(
      ".apple-experience button,.apple-experience a",
    )) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.width < 43 || r.height < 43)
        issues.push(`Small target: ${el.textContent}`);
      if (r.left < -1 || r.right > innerWidth + 1)
        issues.push(`Clipped target: ${el.textContent}`);
      if (el.scrollWidth > el.clientWidth + 2)
        issues.push(`Control overflow: ${el.textContent}`);
    }
    for (const el of document.querySelectorAll(
      ".apple-story-copy,.apple-study,.apple-node,.apple-outcomes,.apple-release-path,.apple-contribution-ledger article",
    )) {
      if (el.scrollWidth > el.clientWidth + 2)
        issues.push(`Text overflow: ${el.className}`);
    }
    const copy = document
      .querySelector(".apple-story-copy")
      .getBoundingClientRect();
    const study = document
      .querySelector(".apple-study")
      .getBoundingClientRect();
    if (
      Math.min(copy.right, study.right) - Math.max(copy.left, study.left) > 1 &&
      Math.min(copy.bottom, study.bottom) - Math.max(copy.top, study.top) > 1
    )
      issues.push("Diagram overlaps the narrative");
    const nodes = [
      ...document.querySelectorAll(".apple-node,.apple-persistence"),
    ].map((el) => el.getBoundingClientRect());
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        if (
          Math.min(nodes[i].right, nodes[j].right) -
            Math.max(nodes[i].left, nodes[j].left) >
            1 &&
          Math.min(nodes[i].bottom, nodes[j].bottom) -
            Math.max(nodes[i].top, nodes[j].top) >
            1
        )
          issues.push("Request diagram nodes overlap");
      }
    return issues;
  });
  assert.deepEqual(layout, [], `${name} layout`);
  results.push({
    name,
    violations: 0,
    manualReview: report.incomplete.map((v) => v.id),
  });
  console.log(`PASS ${name}`);
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
        if (data.toString().includes("4279")) {
          clearTimeout(timer);
          resolve();
        }
      });
    });
  const launched = await launchVerificationBrowser({
    executablePath,
    headless: true,
  });
  closeBrowser = launched.close;
  for (const config of [
    { name: "desktop", width: 1440 },
    { name: "tablet", width: 768 },
    { name: "mobile", width: 390 },
    { name: "reflow-320", width: 320 },
    { name: "text-200", width: 1280, text: true },
    { name: "text-spacing", width: 390, spacing: true },
    { name: "reduced-motion", width: 390, reduced: true },
    { name: "forced-colors", width: 390, forced: true },
    { name: "no-webgl", width: 390, fallback: true },
  ].filter((c) => !process.env.CASE || c.name === process.env.CASE)) {
    const context = await launched.browser.newContext({
      viewport: { width: config.width, height: 1000 },
      reducedMotion: config.reduced ? "reduce" : "no-preference",
      forcedColors: config.forced ? "active" : "none",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);
    if (config.fallback)
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          return type.startsWith("webgl")
            ? null
            : original.call(this, type, ...args);
        };
      });
    const errors = [],
      writes = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (request) => {
      if (!["GET", "HEAD"].includes(request.method()))
        writes.push(request.url());
    });
    await page.goto(`${base}#work-apple`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (config.text)
      await page.addStyleTag({ content: "html{font-size:200%!important}" });
    if (config.spacing)
      await page.addStyleTag({
        content:
          "*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}",
      });
    const section = page.locator("#engineer"),
      tabs = section.getByRole("tablist");
    assert.equal(await page.locator("#work-apple").count(), 1);
    assert(
      await section.evaluate((el) =>
        Boolean(
          el.compareDocumentPosition(document.querySelector("#laboratory")) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ),
      "Apple must precede the personal lab",
    );
    assert.deepEqual(
      await section.locator(".apple-outcomes dd").allTextContents(),
      ["5", "~100", "3"],
    );
    assert.match(
      await section.locator(".apple-source-note").innerText(),
      /not Apple documentation/,
    );
    await audit(page, `${config.name}-api-ready`);
    await section.screenshot({ path: `${out}/${config.name}-apple.png` });
    const study = section.getByTestId("apple-request-study");
    const advance = study.getByRole("button", { name: "Advance request" });
    await advance.click();
    assert.match(await study.getByRole("status").innerText(), /accepted/);
    await advance.click();
    assert.match(await study.getByRole("status").innerText(), /partial result/);
    assert.equal(await study.locator(".apple-events .is-received").count(), 1);
    await advance.hover();
    await audit(page, `${config.name}-sse-partial`);
    await advance.click();
    assert(await advance.isDisabled());
    assert.equal(await study.locator(".apple-events .is-received").count(), 3);
    await study.getByRole("button", { name: "Reset request" }).click();
    assert.equal(await study.getAttribute("data-step"), "0");
    await study
      .getByRole("button", { name: "Synchronous", exact: true })
      .click();
    await advance.click();
    await advance.click();
    assert.match(
      await study.getByRole("status").innerText(),
      /waiting for the complete/,
    );
    assert.equal(await study.locator(".apple-events .is-received").count(), 0);
    await audit(page, `${config.name}-synchronous`);
    await advance.click();
    assert.equal(await study.locator(".apple-events .is-received").count(), 3);
    await study.getByRole("button", { name: "Streaming / SSE" }).click();
    assert.equal(
      await study.getAttribute("data-step"),
      "0",
      "Changing mode resets the trace",
    );
    await tabs.getByRole("tab", { name: "AI platform", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(
      await page.locator(":focus").getAttribute("id"),
      "apple-tab-processing",
    );
    const claims = section.getByTestId("apple-processing-study");
    for (const owner of [0, 1, 2]) {
      await claims
        .getByRole("button", {
          name: `Worker ${owner + 1} Try claim`,
          exact: true,
        })
        .click();
      assert.equal(await claims.getAttribute("data-owner"), String(owner));
      await claims
        .getByRole("button", {
          name: `Worker ${((owner + 1) % 3) + 1} Try claim`,
          exact: true,
        })
        .click();
      assert.equal(
        await claims.getAttribute("data-owner"),
        String(owner),
        "Second claimant cannot take ownership",
      );
      assert.match(
        await claims.getByRole("status").innerText(),
        /cannot claim this record/,
      );
      if (owner === 0) {
        await audit(page, `${config.name}-exclusive-claim`);
        await claims.screenshot({
          path: `${out}/${config.name}-processing.png`,
        });
      }
      await claims.getByRole("button", { name: "Reset record" }).click();
      assert.equal(await claims.getAttribute("data-owner"), "none");
    }
    await tabs
      .getByRole("tab", { name: "Distributed processing", exact: true })
      .press("End");
    assert.equal(
      await page.locator(":focus").getAttribute("id"),
      "apple-tab-delivery",
    );
    const delivery = section.getByTestId("apple-delivery-study");
    assert.equal(await delivery.getAttribute("data-profile"), "legacy");
    await delivery
      .getByRole("button", { name: "New profile", exact: true })
      .click();
    assert.equal(await delivery.getAttribute("data-profile"), "new");
    assert.match(
      await delivery.locator(".apple-release-path.is-active").innerText(),
      /New pipeline/,
    );
    assert.deepEqual(
      await delivery.locator(".apple-migration-proof dd").allTextContents(),
      ["4", "5", "0"],
    );
    await audit(page, `${config.name}-new-profile`);
    await delivery.screenshot({ path: `${out}/${config.name}-delivery.png` });
    await delivery
      .getByRole("button", { name: "Legacy profile", exact: true })
      .click();
    assert.equal(await delivery.getAttribute("data-profile"), "legacy");
    await tabs
      .getByRole("tab", { name: "Platform delivery", exact: true })
      .press("Home");
    assert.equal(
      await page.locator(":focus").getAttribute("id"),
      "apple-tab-apis",
    );
    await page.keyboard.press("ArrowLeft");
    assert.equal(
      await page.locator(":focus").getAttribute("id"),
      "apple-tab-delivery",
      "Arrow keys wrap",
    );
    assert.equal(await tabs.locator('[tabindex="0"]').count(), 1);
    assert.deepEqual(errors, [], "Browser runtime errors");
    assert.deepEqual(writes, [], "Studies must not send data to any server");
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
