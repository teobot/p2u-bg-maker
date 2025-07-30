"use client";

import html2canvas from "html2canvas";

export async function clientHtml2Canvas(element: HTMLElement) {
  try {
    const canvas = await html2canvas(element, {
      width: 1920,
      height: 1080,
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      removeContainer: true,
      foreignObjectRendering: true,
      imageTimeout: 15000, // Longer timeout for images
      onclone: (clonedDoc) => {
        // Ensure the cloned element has proper dimensions and no scaling
        const clonedElement = clonedDoc.body.firstElementChild as HTMLElement;
        if (clonedElement) {
          clonedElement.style.width = "1920px";
          clonedElement.style.height = "1080px";
          clonedElement.style.transform = "none";
          clonedElement.style.position = "relative";
          clonedElement.style.transformOrigin = "top left";
        }
      },
    });

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob from canvas"));
        }
      }, "image/png");
    });
  } catch (error) {
    console.error("Error capturing screenshot with html2canvas:", error);
    throw error;
  }
}
