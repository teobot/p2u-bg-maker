"use server";

import puppeteer from "puppeteer";

export async function downloadRender(url: string) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1920, height: 1080 });
    const screenshot = await page.screenshot({
      type: "png",
      fullPage: true,
    });

    // Convert Buffer to base64 string
    const base64Screenshot = Buffer.from(screenshot).toString("base64");

    await browser.close();
    return { screenshot: base64Screenshot };
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Error downloading render"
    );
    throw error;
  }
}
