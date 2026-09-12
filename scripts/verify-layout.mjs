import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import sharp from "sharp";

const base = process.env.BASE_URL || "http://127.0.0.1:4276/";
const out = path.resolve(
  process.env.TEST_OUTPUT || "test-artifacts/collection",
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
        "4276",
        "--strictPort",
      ],
      { stdio: "pipe" },
    );
if (server) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Preview startup timed out")),
      15000,
    );
    server.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Preview exited ${code}`));
    });
    server.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("4276")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
}
const macChrome =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath =
  process.env.CHROME_PATH ||
  (await fs.access(macChrome).then(
    () => macChrome,
    () => undefined,
  ));
const browser = await chromium.launch({ executablePath, headless: true });
const results = [];
await fs.mkdir(out, { recursive: true });
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");

async function layout(page, label) {
  const state = await page.evaluate(() => {
    const rects = [
      ".stage-column",
      ".inspector",
      ".exhibit-intro",
      ".site-header",
      ".collection-tabs",
      ".study-links",
    ].map((selector) => ({
      selector,
      ...document.querySelector(selector).getBoundingClientRect().toJSON(),
    }));
    const overflows = rects.filter(
      (r) => r.width < 10 || r.left < -1 || r.right > innerWidth + 1,
    );
    const overlap = [];
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i],
          b = rects[j];
        if (
          Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
          Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1
        )
          overlap.push([a.selector, b.selector]);
      }
    const stage = document.querySelector(".stage-view").getBoundingClientRect();
    const bar = document.querySelector(".assembly-bar").getBoundingClientRect();
    const controls = [
      ...document.querySelectorAll(
        ".view-tools button, .assembly-bar button, .assembly-bar input",
      ),
    ].map((e) => e.getBoundingClientRect());
    const controlOverlap = controls.some((a, i) =>
      controls
        .slice(i + 1)
        .some(
          (b) =>
            Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
            Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1,
        ),
    );
    return {
      overflows,
      overlap,
      controlOverlap,
      documentWidth: document.documentElement.scrollWidth,
      width: innerWidth,
      stageWidth: stage.width,
      stageHeight: stage.height,
      barGap: bar.top - stage.bottom,
      controlsOutside: controls.some(
        (r) =>
          r.left < -1 ||
          r.right > innerWidth + 1 ||
          r.width < 20 ||
          r.height < 20,
      ),
    };
  });
  assert.deepEqual(state.overflows, [], `${label}: panel bounds`);
  assert.deepEqual(state.overlap, [], `${label}: panels overlap`);
  assert(!state.controlOverlap, `${label}: controls overlap`);
  assert(
    state.documentWidth <= state.width + 1,
    `${label}: horizontal overflow`,
  );
  assert(
    state.stageWidth > 200 && state.stageHeight >= 280,
    `${label}: unusable stage`,
  );
  assert(
    state.barGap >= -1 && state.barGap < 30,
    `${label}: controls detached from stage`,
  );
  assert(!state.controlsOutside, `${label}: controls clipped or too small`);
  return state;
}

async function ready(page, count) {
  await page
    .locator(
      `[data-testid="exhibit-stage"][data-ready="true"][data-parts="${count}"]`,
    )
    .waitFor({ timeout: 30000 });
  assert.equal(
    await page.locator(".model-fallback").count(),
    0,
    "Unexpected WebGL fallback",
  );
  await page.waitForTimeout(1400);
}

async function exerciseModel(page, id, count, name, options) {
  if (id !== "car")
    await page
      .locator(".collection-tabs button")
      .filter({ hasText: name })
      .click();
  await ready(page, count);
  if (id === "car" && options.label === "desktop") {
    const canvas = page.locator("canvas");
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    await canvas.click({
      position: { x: box.width * 0.5, y: box.height * 0.58 },
    });
    await page.locator(".selected-part").waitFor();
    await page.getByRole("button", { name: "Clear selection" }).click();
    const frame = await canvas.screenshot();
    const currentBox = await canvas.boundingBox();
    await page.mouse.move(
      currentBox.x + currentBox.width * 0.5,
      currentBox.y + currentBox.height * 0.5,
    );
    await page.mouse.down();
    await page.mouse.move(
      currentBox.x + currentBox.width * 0.6,
      currentBox.y + currentBox.height * 0.55,
      { steps: 12 },
    );
    await page.mouse.up();
    await page.waitForTimeout(1000);
    assert.notEqual(
      hash(frame),
      hash(await canvas.screenshot()),
      "Pointer orbit did not change the rendered model",
    );
    await page.getByRole("button", { name: "Reset exhibit" }).click();
    await page.waitForTimeout(1400);
  }
  assert.equal(
    await page.locator(".part-row").count(),
    count,
    `${id}: source assembly count`,
  );
  await page.locator(".stage-view").scrollIntoViewIfNeeded();
  const before = await page.locator(".stage-view").screenshot({
    path: path.join(out, `${options.label}-${id}-assembled.png`),
  });
  await page
    .getByRole("button", { name: "Explode model", exact: true })
    .click();
  assert.equal(await page.getByRole("slider").inputValue(), "100");
  await page.waitForTimeout(options.reduced ? 200 : 1400);
  const after = await page.locator(".stage-view").screenshot({
    path: path.join(out, `${options.label}-${id}-exploded.png`),
  });
  assert.notEqual(
    hash(before),
    hash(after),
    `${id}: rendered pixels unchanged after explode`,
  );
  if (id !== "car") {
    const { data, info } = await sharp(after)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const background = [...data.subarray(0, 3)];
    let edgePixels = 0;
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < info.width; x++) {
        const offset = (y * info.width + x) * info.channels;
        if (
          background.some(
            (channel, c) => Math.abs(data[offset + c] - channel) > 35,
          )
        )
          edgePixels++;
      }
    assert.equal(
      edgePixels,
      0,
      `${id}: exploded geometry clips the upper image edge`,
    );
  }
  await layout(page, `${options.label}/${id}/exploded`);
  await page.getByRole("slider").press("Home");
  await page.getByRole("slider").press("ArrowRight");
  assert.equal(await page.getByRole("slider").inputValue(), "1");
  const names = await page
    .locator(".part-row span:nth-child(2)")
    .allTextContents();
  for (const label of options.everyPart ? names : names.slice(0, 1)) {
    await page.locator(".part-row").filter({ hasText: label }).click();
    assert.equal(
      await page.locator(".selected-part strong").textContent(),
      label,
    );
    await page.getByRole("button", { name: "Isolate", exact: true }).click();
    assert.match(
      await page.locator(".index-footer").textContent(),
      new RegExp(`1 / ${count}`),
    );
    await layout(page, `${id}/${label}/isolated`);
    if (label === names[0]) {
      await page.waitForTimeout(1200);
      await page.locator(".stage-view").screenshot({
        path: path.join(out, `${options.label}-${id}-isolated.png`),
      });
    }
    await page.getByRole("button", { name: "Hide", exact: true }).click();
  }
  await page.locator(".index-footer button").click();
  assert.match(
    await page.locator(".index-footer").textContent(),
    new RegExp(`${count} / ${count}`),
  );
  await page.getByRole("textbox", { name: "Search components" }).fill(names[0]);
  assert.equal(await page.locator(".part-row").count(), 1);
  await page
    .getByRole("textbox", { name: "Search components" })
    .fill("no-such-component");
  assert.equal(await page.locator(".part-row").count(), 0);
  await page
    .getByRole("button", { name: "Reset exhibit", exact: true })
    .click();
  assert.equal(await page.getByRole("slider").inputValue(), "0");
}

async function runCase(name, viewport, options = {}) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: options.reduced ? "reduce" : "no-preference",
    isMobile: viewport.width < 541,
    hasTouch: viewport.width < 541,
  });
  const page = await context.newPage();
  if (process.env.WARMUP_BROWSER === "1") {
    // Allow the host's normal automatic browser check to finish in this session.
    // This does not bypass a CAPTCHA or change hosting security configuration.
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page
      .getByRole("heading", { level: 1, name: "Built to think. Made to move." })
      .waitFor({ timeout: 30000 });
    await page.goto("about:blank");
  }
  const errors = [],
    requests = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.url().startsWith(base) && r.status() >= 400 && !options.brokenAsset)
      errors.push(`${r.status()} ${r.url()}`);
  });
  page.on("request", (r) => requests.push(r.url()));
  if (options.fallback)
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return type.startsWith("webgl")
          ? null
          : original.call(this, type, ...args);
      };
    });
  if (options.brokenAsset)
    await page.route("**/models/car.glb", (route) =>
      route.fulfill({ status: 503, body: "Fixture: unavailable model" }),
    );
  try {
    await page.goto(base, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1 }).waitFor();
    const fallback = options.fallback || options.brokenAsset;
    if (fallback) {
      await page.locator(".model-fallback img").waitFor();
      assert(
        !(await page
          .getByRole("button", { name: "Explode model", exact: true })
          .isEnabled()),
      );
      await page.locator(".part-row").first().click();
      assert(await page.locator(".selected-part").isVisible());
    } else {
      await ready(page, 15);
      assert(
        !requests.some((r) => /models\/(hand|go2|panda)\.glb/.test(r)),
        "Inactive exhibits eagerly downloaded",
      );
    }
    const initialLayout = await layout(page, name);
    await page.locator(".compute-assets").scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".compute-assets img")].every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    );
    await page.screenshot({
      path: path.join(out, `${name}-page.png`),
      fullPage: true,
    });
    if (!fallback) {
      await exerciseModel(page, "car", 15, "Concept vehicle", {
        label: name,
        everyPart: name === "desktop",
        ...options,
      });
      if (name === "desktop" || name === "mobile") {
        for (const [id, count, label] of [
          ["hand", 23, "Shadow Dexterous Hand"],
          ["go2", 13, "Unitree Go2"],
          ["panda", 11, "Franka Emika Panda"],
        ])
          await exerciseModel(page, id, count, label, {
            label: name,
            everyPart: name === "desktop",
            ...options,
          });
        await page
          .locator(".collection-tabs button")
          .filter({ hasText: "Concept vehicle" })
          .click();
        await ready(page, 15);
      }
      for (const view of ["Front", "Side", "Top", "Perspective"]) {
        await page.getByRole("button", { name: view, exact: true }).click();
        assert.equal(
          await page
            .getByRole("button", { name: view, exact: true })
            .getAttribute("aria-pressed"),
          "true",
        );
      }
      await page
        .getByRole("button", { name: "Toggle studio lighting" })
        .click();
      assert(await page.locator(".dark-stage").isVisible());
      await page.waitForTimeout(1200);
      if (name === "desktop")
        await page
          .locator(".stage-view")
          .screenshot({ path: path.join(out, "dark-stage.png") });
      await page
        .getByRole("button", { name: "Toggle studio lighting" })
        .click();
      if (options.reduced)
        assert(
          !(await page
            .getByRole("button", { name: "Auto rotate model" })
            .isEnabled()),
        );
      else {
        await page.getByRole("button", { name: "Auto rotate model" }).click();
        assert.equal(
          await page
            .getByRole("button", { name: "Auto rotate model" })
            .getAttribute("aria-pressed"),
          "true",
        );
      }
      await page.getByRole("button", { name: "Reset exhibit" }).click();
    }
    await page
      .getByRole("button", { name: "Credits & how to explore" })
      .click();
    assert(await page.getByRole("dialog").isVisible());
    assert.match(
      await page.locator("dialog").textContent(),
      /not a disassembly guide/,
    );
    await page.keyboard.press("Escape");
    assert(!(await page.locator("dialog").isVisible()));
    assert.match(
      await page.evaluate(() => document.activeElement.textContent),
      /Credits/,
    );
    await page
      .getByRole("button", { name: "Fail worker 2", exact: true })
      .click();
    assert.equal(await page.getByText("50% share", { exact: true }).count(), 2);
    await page
      .getByRole("button", { name: "Recover worker 2", exact: true })
      .click();
    assert.equal(
      await page.getByText("33.3% share", { exact: true }).count(),
      3,
    );
    for (const id of ["engineer", "connect"]) {
      await page.locator(`nav a[href="#${id}"]`).click();
      await page.waitForTimeout(options.reduced ? 50 : 700);
      assert.equal(new URL(page.url()).hash, `#${id}`);
    }
    const resume = await context.request.get(
      new URL("/Chibundu_Awandu_Resume.pdf", base).href,
    );
    assert.equal(resume.status(), 200);
    assert.equal((await resume.body()).subarray(0, 4).toString(), "%PDF");
    assert.equal(
      await page.locator(".email-link").getAttribute("href"),
      "mailto:chibunduawandu@gmail.com",
    );
    for (const image of await page.locator(".compute-assets img").all())
      assert(await image.evaluate((e) => e.complete && e.naturalWidth > 0));
    if (!options.brokenAsset)
      assert.deepEqual(errors, [], `${name}: browser errors`);
    if (options.brokenAsset) {
      await page
        .locator(".collection-tabs button")
        .filter({ hasText: "Unitree Go2" })
        .click();
      await ready(page, 13);
    }
    if (options.fallback) {
      await page
        .locator(".collection-tabs button")
        .filter({ hasText: "Unitree Go2" })
        .click();
      await page
        .locator('.model-fallback img[src="/asset-previews/go2.webp"]')
        .waitFor();
      await page.locator(".stage-loading").waitFor({ state: "detached" });
      assert(
        !(await page
          .getByRole("button", { name: "Explode model", exact: true })
          .isEnabled()),
      );
    }
    results.push({ name, status: "passed", viewport, layout: initialLayout });
    console.log(`PASS ${name}`);
  } catch (error) {
    await page
      .screenshot({
        path: path.join(out, `${name}-failure.png`),
        fullPage: true,
      })
      .catch(() => {});
    results.push({ name, status: "failed", error: error.message, errors });
    console.error(`FAIL ${name}: ${error.message}`);
  } finally {
    await context.close();
  }
}

try {
  const cases = [
    ["desktop", 1440, 1000],
    ["laptop", 1280, 720],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
    ["small-mobile", 320, 568],
    ["landscape", 844, 390],
    ["reduced-motion", 390, 844, { reduced: true }],
    ["no-webgl", 390, 844, { fallback: true }],
    ["failed-model", 390, 844, { brokenAsset: true }],
  ];
  for (const [name, width, height, options] of cases.filter(
    (c) => !process.env.TEST_CASE || c[0] === process.env.TEST_CASE,
  ))
    await runCase(name, { width, height }, options);
  if (!process.env.TEST_CASE) {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(base);
    assert(
      await page.getByRole("heading", { name: "Chibundu Awandu" }).isVisible(),
    );
    assert(
      await page.getByRole("link", { name: "Read my resume" }).isVisible(),
    );
    results.push({ name: "no-javascript", status: "passed" });
    await context.close();
  }
} finally {
  await browser.close();
  server?.kill();
  await fs.writeFile(
    path.join(out, "results.json"),
    JSON.stringify({ base, results }, null, 2),
  );
}
assert(
  results.every((r) => r.status === "passed"),
  `Verification failed. See ${out}/results.json`,
);
console.log(`All ${results.length} verification configurations passed.`);
