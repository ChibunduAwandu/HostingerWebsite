import { chromium } from "playwright";

export async function launchVerificationBrowser(options) {
  // Own a separate process so test teardown never waits on Chrome's GUI shutdown.
  const server = await chromium.launchServer({ ...options, host: "127.0.0.1" });
  const close = async () => {
    const child = server.process();
    // Chrome helpers can inherit a pipe after the main process has exited.
    // Release only this owned process's pipes so Playwright observes `close`.
    const releasePipes = () =>
      child.stdio.forEach((stream) => stream?.destroy());
    if (child.exitCode !== null || child.signalCode !== null) releasePipes();
    else child.once("exit", releasePipes);
    await server.kill();
  };
  try {
    const browser = await chromium.connect(server.wsEndpoint());
    return { browser, close };
  } catch (error) {
    await close();
    throw error;
  }
}
