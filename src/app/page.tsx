"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [backgroundColor, setBackgroundColor] = useState("#3B82F6");
  const [iconColor, setIconColor] = useState("red");
  const [logoSize, setLogoSize] = useState(160);
  const [windowSize, setWindowSize] = useState("1920x1080");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getWindowDimensions = () => {
    const [width, height] = windowSize.split("x").map(Number);
    return { width, height };
  };

  const getRenderUrl = () => {
    const { width, height } = getWindowDimensions();
    const params = new URLSearchParams({
      bg: backgroundColor,
      icon: iconColor,
      logo: logoSize.toString(),
      width: width.toString(),
      height: height.toString(),
    });
    console.log(`/render?${params.toString()}`);
    return `/render?${params.toString()}`;
  };

  const downloadImage = async () => {
    try {
    } catch (error) {
      console.error("Error with html2canvas:", error);
      alert("html2canvas failed. This may be due to CORS restrictions.");
    }
  };

  return (
    <div className="container mx-auto bg-white">
      <div className="flex min-h-screen flex-row bg-gray-100">
        {/* Controls Panel */}
        <div className="shadow-lg p-5 space-y-4">
          {/* Background Color */}
          <div>
            <label
              htmlFor="bg-color-picker"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="bg-color-picker"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
                aria-label="Choose background color"
              />
              <input
                id="bg-color-text"
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#ffffff"
                aria-label="Background color hex value"
              />
            </div>
          </div>

          {/* Icon Color */}
          <div>
            <label
              htmlFor="icon-color-picker"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Icon Color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="icon-color-picker"
                type="color"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
                className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
                aria-label="Choose icon color"
              />
              <input
                id="icon-color-text"
                type="text"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#3b82f6"
                aria-label="Icon color hex value"
              />
            </div>
          </div>

          {/* Logo Size */}
          <div>
            <label
              htmlFor="logo-size-slider"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Logo Size: {logoSize}px
            </label>
            <input
              id="logo-size-slider"
              type="range"
              min="40"
              max="150"
              value={logoSize}
              onChange={(e) => setLogoSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label="Adjust logo size"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={downloadImage}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Download
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-lg shadow-lg flex flex-1 justify-center items-center bg-gray-100 p-8">
          <div className="w-full max-w-4xl aspect-video"></div>
        </div>
      </div>
    </div>
  );
}
