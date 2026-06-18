import fs from "node:fs";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const CHROME_PATHS = [
  process.env.CHROME_EXECUTABLE_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter((value): value is string => Boolean(value));

async function browserLaunchOptions() {
  const localExecutable = CHROME_PATHS.find((candidate) => fs.existsSync(candidate));

  if (localExecutable) {
    return {
      executablePath: localExecutable,
      headless: true as const,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };
  }

  return {
    executablePath: await chromium.executablePath(),
    headless: "shell" as const,
    args: puppeteer.defaultArgs({
      args: chromium.args,
      headless: "shell",
    }),
  };
}

export async function pageToPdf(url: string) {
  const browser = await puppeteer.launch(await browserLaunchOptions());

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images)
          .filter((image) => !image.complete)
          .map((image) => new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          }))
      );
    });
    await page.emulateMediaType("print");
    return Buffer.from(await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    }));
  } finally {
    await browser.close();
  }
}
