"use server";

import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium-min";

const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

export async function downloadRender(url: string) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: chromium.headless,

      args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        (await chromium.executablePath("<Your Chromium URL>")),
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: true,
    });

    // Convert Buffer to base64 string
    const base64Screenshot = Buffer.from(screenshot).toString("base64");

    return { screenshot: base64Screenshot };
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Error downloading render"
    );
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
