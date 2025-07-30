"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Html2CanvasPage() {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Get parameters from URL
  const backgroundColor = searchParams.get("bg") || "#ffffff";
  const iconColor = searchParams.get("icon") || "#3b82f6";
  const logoSize = parseInt(searchParams.get("logo") || "80");

  const captureScreenshot = async () => {
    if (!canvasRef.current) return;

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(canvasRef.current, {
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

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "html2canvas-screenshot.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  useEffect(() => {
    // Add capture button after component mounts
    const button = document.createElement("button");
    button.textContent = "Capture with html2canvas";
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    `;
    button.onclick = captureScreenshot;
    document.body.appendChild(button);

    return () => {
      document.body.removeChild(button);
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{
        backgroundColor,
        width: "1920px",
        height: "1080px",
        position: "relative",
        overflow: "hidden",
        transform: "scale(var(--scale, 1))",
        transformOrigin: "top left",
      }}
    >
      {/* Logo in top corner */}
      <div
        style={{ position: "absolute", top: "16px", left: "16px", zIndex: 10 }}
      >
        <Image
          src="/p2u_logo.svg"
          alt="P2U Logo"
          width={logoSize}
          height={logoSize}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Background Icons */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          display: "grid",
          gridTemplateColumns: "repeat(48, 40px)",
          gridTemplateRows: "repeat(27, 40px)",
          gap: "0px",
        }}
      >
        {Array.from({ length: 1296 }).map((_, index) => (
          <div
            key={index}
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M170.29 74.71C168.11 72.53 165.22 71.33 162.14 71.33H128.43C128.32 71.33 128.21 71.35 128.1 71.36C123.85 71.4 111.29 72.39 104.62 82.33C101.58 86.86 99.8701 94.44 103.33 100.38C105.4 103.94 108.93 106.14 113.03 106.41C113.31 106.43 113.59 106.44 113.87 106.44C117.92 106.44 121.91 104.5 124.43 101.25C127.3 97.56 128.79 93.43 129.13 88.27C129.28 86.07 127.61 84.16 125.4 84.01C123.19 83.86 121.29 85.53 121.14 87.74C120.9 91.33 119.99 93.91 118.1 96.35C117.02 97.75 115.27 98.55 113.56 98.43C112.56 98.36 111.17 97.95 110.25 96.36C108.68 93.66 109.54 89.38 111.27 86.79C116 79.74 126.25 79.36 128.41 79.36C128.44 79.36 128.46 79.36 128.48 79.36C128.58 79.36 128.67 79.34 128.77 79.33H162.15C163.09 79.33 163.98 79.7 164.65 80.36C165.32 81.02 165.68 81.91 165.68 82.86V117.05C165.67 119 164.08 120.58 162.14 120.58H128.95C124.68 120.58 121.2 124.05 121.18 128.32L121.06 162.2C121.06 164.12 119.48 165.7 117.56 165.72L82.8101 165.99H82.7801C81.8401 165.99 80.9601 165.63 80.2901 164.97C79.6201 164.3 79.2501 163.41 79.2501 162.46V128.19C79.2501 123.91 75.7701 120.43 71.4901 120.43L37.8801 120.41C35.9301 120.41 34.3501 118.83 34.3501 116.88V82.86C34.3501 80.91 35.9301 79.33 37.8801 79.33H71.3001C75.5801 79.33 79.0701 75.85 79.0701 71.56V37.52C79.0701 36.57 79.4401 35.68 80.1101 35.01C80.7801 34.35 81.6601 33.99 82.5901 33.99C82.5901 33.99 82.6101 33.99 82.6201 33.99L117.17 34.26C119.1 34.28 120.67 35.86 120.67 37.79V63.17C120.67 65.38 122.46 67.17 124.67 67.17C126.88 67.17 128.67 65.38 128.67 63.17V37.79C128.67 31.48 123.54 26.31 117.23 26.26L82.6801 25.99H82.5901C79.5301 25.99 76.6501 27.18 74.4701 29.33C72.2701 31.51 71.0601 34.42 71.0601 37.52V71.33H37.8701C31.5101 71.33 26.3401 76.5 26.3401 82.86V116.88C26.3401 123.23 31.5101 128.41 37.8601 128.41L71.2301 128.43V162.46C71.2301 165.56 72.4401 168.46 74.6401 170.64C76.8201 172.8 79.7001 173.99 82.7601 173.99C82.7901 173.99 82.8201 173.99 82.8501 173.99L117.6 173.72C123.89 173.67 129.02 168.52 129.04 162.23L129.16 128.58H162.12C168.47 128.58 173.65 123.41 173.65 117.05V82.86C173.66 79.78 172.46 76.88 170.29 74.7V74.71Z"
                fill={iconColor}
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
