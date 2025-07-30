"use server";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
const isLocal = process.env.IS_LOCAL === "true";

export async function downloadRender(url: string) {
  try {
    const browser = await puppeteer.launch({
      executablePath: isLocal
        ? process.env.CHROME_EXECUTABLE_PATH // local Chrome
        : await chromium.executablePath(),
      args: chromium.args,
      headless: true,
      defaultViewport: { width: 1920, height: 1080 },
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
  }
}
