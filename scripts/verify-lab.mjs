import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { launchVerificationBrowser } from "./verification-browser.mjs";
import { createHash } from "node:crypto";
import { PerspectiveCamera, Vector3 } from "three";
import {
  isObstructed,
  workerShares,
  actionPhase,
} from "../src/lab/labState.ts";

assert(isObstructed(0));
assert(!isObstructed(0.85));
assert(!isObstructed(-2));
for (const failed of [null, 0, 1, 2]) {
  assert.equal(
    workerShares(failed).reduce((a, b) => a + b, 0),
    1,
  );
  if (failed !== null) assert.equal(workerShares(failed)[failed], 0);
}
assert.equal(actionPhase(1), "Cycle complete");
const base = process.env.BASE_URL || "http://127.0.0.1:4277/";
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
        "4277",
        "--strictPort",
      ],
      { stdio: "pipe" },
    );
if (server)
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Preview startup timed out")),
      15000,
    );
    server.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Preview exited ${code}`));
    });
    server.stdout.on("data", (data) => {
      if (data.toString().includes("4277")) {
        clearTimeout(timeout);
        resolve();
      }
    });
  });
const out = path.resolve("test-artifacts/motion");
await fs.mkdir(out, { recursive: true });
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = await fs.access(chrome).then(
  () => chrome,
  () => undefined,
);
const { browser, close: closeBrowser } = await launchVerificationBrowser({
  executablePath,
  headless: true,
});
const results = [];
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function geometry(page) {
  const errors = await page.evaluate(() => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 1)
      issues.push("Page overflows");
    const stage = document
      .querySelector(".lab-viewport")
      .getBoundingClientRect();
    const console = document
      .querySelector(".chapter-console")
      .getBoundingClientRect();
    if (
      Math.min(stage.right, console.right) -
        Math.max(stage.left, console.left) >
        1 &&
      Math.min(stage.bottom, console.bottom) -
        Math.max(stage.top, console.top) >
        1
    )
      issues.push("Scene/controls overlap");
    const buttons = [
      ...document.querySelectorAll(".motion-lab button,.motion-lab input"),
    ].map((e) => e.getBoundingClientRect());
    for (let i = 0; i < buttons.length; i++) {
      const a = buttons[i];
      if (
        a.left < -1 ||
        a.right > innerWidth + 1 ||
        a.width < 20 ||
        a.height < 20
      )
        issues.push(`Clipped control ${i}`);
      for (let j = i + 1; j < buttons.length; j++) {
        const b = buttons[j];
        if (
          Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
          Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1
        )
          issues.push(`Controls overlap ${i}/${j}`);
      }
    }
    if (document.querySelectorAll("canvas").length > 1)
      issues.push("Multiple canvases");
    if (document.querySelector("vite-error-overlay"))
      issues.push("Vite overlay");
    return issues;
  });
  assert.deepEqual(errors, []);
}
try {
  const cases = [
    ["desktop", 1440, 1050],
    ["laptop", 1280, 720],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
    ["small", 320, 568],
    ["landscape", 844, 390],
    ["reduced", 390, 844],
    ["fallback", 390, 844],
    ["asset-error", 390, 844],
  ];
  for (const [name, width, height] of cases.filter(
    (c) => !process.env.CASE || process.env.CASE === c[0],
  )) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: name === "reduced" ? "reduce" : "no-preference",
    });
    const page = await context.newPage(),
      errors = [],
      requests = [];
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => requests.push(r.url()));
    page.on("console", (m) => {
      if (m.type() === "error" && name !== "asset-error") errors.push(m.text());
    });
    if (name === "fallback")
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          return type.startsWith("webgl")
            ? null
            : original.call(this, type, ...args);
        };
      });
    if (name === "asset-error")
      await page.route("**/models/car.glb", (r) =>
        r.fulfill({ status: 503, body: "fixture" }),
      );
    await page.goto(base, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1, name: /Chibundu/ }).waitFor();
    const stage = page.getByTestId("lab-stage");
    const fallback = ["fallback", "asset-error"].includes(name);
    await page
      .locator(
        fallback
          ? '[data-testid="lab-stage"][data-fallback="true"]'
          : '[data-testid="lab-stage"][data-ready="true"]',
      )
      .waitFor({ timeout: 30000 });
    assert(
      !requests.some((r) =>
        /panda-motion|models\/(hand|go2|panda)\.glb/.test(r),
      ),
      "Inactive robot eagerly loaded",
    );
    await geometry(page);
    await page.screenshot({ path: `${out}/${name}-entry.png`, fullPage: true });
    await stage.scrollIntoViewIfNeeded();
    if (!fallback && name !== "reduced")
      await page.getByRole("button", { name: "Pause animations" }).click();
    await page.waitForTimeout(1800);
    const material = hash(await stage.screenshot());
    await page
      .getByRole("button", { name: "Machine view", exact: true })
      .click();
    await page.waitForTimeout(150);
    assert.equal(await stage.getAttribute("data-surface"), "scan");
    if (!fallback)
      assert.notEqual(
        hash(await stage.screenshot()),
        material,
        "Machine view has no visual effect",
      );
    const obstacle = page.getByRole("slider", { name: "Obstacle position" });
    await obstacle.focus();
    await obstacle.press("Home");
    for (let i = 0; i < 50; i++) await obstacle.press("ArrowRight");
    assert.equal(await stage.getAttribute("data-obstructed"), "true");
    await page
      .getByText("Object detected. Trajectory blocked.", { exact: true })
      .waitFor();
    await stage.screenshot({ path: `${out}/${name}-perceive.png` });
    await obstacle.press("End");
    assert.equal(await stage.getAttribute("data-obstructed"), "false");
    if (name === "desktop") {
      await stage.scrollIntoViewIfNeeded();
      const box = await stage.boundingBox();
      const aspect = box.width / box.height,
        fit = Math.max(1, 1.35 / aspect);
      const camera = new PerspectiveCamera(38, aspect, 0.1, 120);
      camera.position.set(-8 + 7.8 * fit, 1 + 6.2 * fit, 10 * fit);
      camera.lookAt(-8, 1, 0);
      camera.updateMatrixWorld();
      const project = (z) => {
        const p = new Vector3(-5, 0.7, z).project(camera);
        return {
          x: box.x + ((p.x + 1) * box.width) / 2,
          y: box.y + ((1 - p.y) * box.height) / 2,
        };
      };
      const from = project(2.5),
        to = project(0);
      await page.mouse.move(from.x, from.y);
      await page.mouse.down();
      await page.mouse.move(to.x, to.y, { steps: 15 });
      await page.mouse.up();
      assert.equal(
        await stage.getAttribute("data-obstructed"),
        "true",
        "3D obstacle pointer drag",
      );
    }
    await page.getByRole("tab", { name: /Perceive/ }).focus();
    await page.keyboard.press("ArrowRight");
    await page.getByRole("heading", { name: "Request routing" }).waitFor();
    for (let worker = 1; worker <= 3; worker++) {
      await page
        .getByRole("button", { name: `Disable lab worker ${worker}` })
        .click();
      assert.equal(
        await page
          .locator(".lab-workers strong")
          .allTextContents()
          .then((v) => v.filter((x) => x === "50%").length),
        2,
      );
      await page
        .getByRole("button", { name: `Recover lab worker ${worker}` })
        .click();
    }
    await page.getByRole("button", { name: "Disable lab worker 2" }).click();
    await page.waitForTimeout(1800);
    await geometry(page);
    if (name === "desktop") {
      await page
        .getByRole("button", { name: "Follow the signal", exact: true })
        .click();
      await page
        .locator('.motion-lab[data-chapter="1"]')
        .waitFor({ timeout: 12000 });
      await page
        .getByRole("button", { name: "Recover lab worker 2" })
        .waitFor({ timeout: 5000 });
      await page
        .locator('.motion-lab[data-chapter="2"]')
        .waitFor({ timeout: 12000 });
      await page
        .getByText("Cycle complete", { exact: true })
        .waitFor({ timeout: 16000 });
      assert.equal(
        await page.locator(".motion-lab").getAttribute("data-touring"),
        "false",
      );
      await page
        .getByRole("button", { name: "Follow the signal", exact: true })
        .click();
      await page.getByRole("tab", { name: /Process/ }).click();
      assert.equal(
        await page.locator(".motion-lab").getAttribute("data-touring"),
        "false",
        "Manual chapter cancels tour",
      );
    }
    await stage.screenshot({ path: `${out}/${name}-process.png` });
    await page.getByRole("tab", { name: /Act/ }).click();
    if (!fallback)
      await page
        .locator('[data-testid="lab-stage"][data-ready="true"]')
        .waitFor();
    await page.waitForTimeout(1800);
    if (!fallback) {
      const start = hash(await stage.screenshot());
      const timeline = page.getByRole("slider", {
        name: "Robot cycle timeline",
      });
      await timeline.focus();
      await timeline.press("Home");
      for (let i = 0; i < 100; i++) await timeline.press("ArrowRight");
      await page.waitForTimeout(200);
      assert.notEqual(
        hash(await stage.screenshot()),
        start,
        "Panda joints did not animate",
      );
      await page.getByText("Transferring", { exact: true }).waitFor();
      await stage.screenshot({ path: `${out}/${name}-act.png` });
      await timeline.press("End");
      await page.getByText("Cycle complete", { exact: true }).waitFor();
      await timeline.press("Home");
      if (name === "desktop") {
        await page.getByRole("button", { name: "Run pick & place" }).click();
        await page
          .getByText("Cycle complete", { exact: true })
          .waitFor({ timeout: 16000 });
        await page.getByRole("button", { name: "Replay cycle" }).click();
        await page.waitForTimeout(200);
        await page.getByRole("button", { name: "Pause cycle" }).click();
      }
      if (name === "reduced")
        assert(
          await page
            .getByRole("button", { name: "Pause animations" })
            .isDisabled(),
        );
    }
    await geometry(page);
    if (name === "desktop" || name === "mobile" || fallback) {
      await page
        .getByRole("button", { name: "Open component explorer" })
        .click();
      await page
        .getByRole("heading", {
          level: 2,
          name: "Component explorer",
        })
        .waitFor();
      if (!fallback)
        await page
          .locator('[data-testid="exhibit-stage"][data-ready="true"]')
          .waitFor();
      assert((await page.locator("canvas").count()) <= 1);
      if (name === "desktop") {
        await page.getByRole("link", { name: "My work" }).click();
        await page
          .getByRole("link", { name: "Step inside the collection" })
          .click();
        await page
          .locator(
            '[data-testid="exhibit-stage"][data-ready="true"][data-parts="15"]',
          )
          .waitFor();
        assert.equal(
          await page.locator(".stage-loading").count(),
          0,
          "Revisiting inspector anchor resets loading",
        );
      }
      await page
        .getByRole("button", { name: "Return to Intelligence in Motion" })
        .click();
      await page
        .getByRole("heading", { level: 2, name: /Intelligence/ })
        .waitFor();
      assert((await page.locator("canvas").count()) <= 1);
    }
    if (name === "asset-error")
      assert(
        errors.every((e) => e.includes("Could not load") || e.includes("503")),
        errors.join("\n"),
      );
    else assert.deepEqual(errors, [], `${name}: browser errors`);
    results.push({ name, passed: true });
    console.log(`PASS ${name}`);
    await context.close();
  }
  await fs.writeFile(
    `${out}/results${process.env.CASE ? `-${process.env.CASE}` : ""}.json`,
    JSON.stringify(results, null, 2),
  );
} finally {
  await closeBrowser();
  server?.kill();
}
