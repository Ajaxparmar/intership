import fs from "node:fs";
import puppeteer from "puppeteer-core";

const CHROME_PATHS = [
  process.env.CHROME_EXECUTABLE_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter((value): value is string => Boolean(value));

function chromeExecutable() {
  const executable = CHROME_PATHS.find((candidate) => fs.existsSync(candidate));
  if (!executable) {
    throw new Error("Chrome is required to generate document PDFs. Set CHROME_EXECUTABLE_PATH.");
  }
  return executable;
}

export async function pageToPdf(url: string) {
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable(),
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

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
