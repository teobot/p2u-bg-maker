"use client";

import { useState, Suspense } from "react";
import { downloadRender } from "./actions/downloadRender";
import { ColorResult, TwitterPicker } from "react-color";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();

  const [backgroundColor, setBackgroundColor] = useState(
    searchParams.get("bgColor") || "#ffffff"
  );
  const [iconColor, setIconColor] = useState(
    searchParams.get("iconColor") || "#3b82f6"
  );

  const getRenderUrl = () => {
    const params = new URLSearchParams({
      bgColor: backgroundColor,
      iconColor: iconColor,
    });
    return `https://p2u-renderer.vercel.app/?${params.toString()}`;
  };

  const downloadImage = async () => {
    try {
      const { screenshot } = await downloadRender(getRenderUrl());

      // Convert base64 to blob
      const byteCharacters = atob(screenshot);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "pharmacy2u-background.png";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="font-sans container mx-auto">
      <div className="flex min-h-screen flex-row">
        {/* Controls Panel */}
        <div className="py-5 pr-10 flex flex-col">
          <div className="flex flex-col flex-1 space-y-6">
            <div>
              <label
                htmlFor="bg-color-picker"
                className="block text-sm font-medium text-gray-700 mb-4"
              >
                Background Color
              </label>
              <TwitterPicker
                color={backgroundColor}
                onChange={(color: ColorResult) => setBackgroundColor(color.hex)}
              />
            </div>

            <div>
              <label
                htmlFor="icon-color-picker"
                className="block text-sm font-medium text-gray-700 mb-4"
              >
                Icon Color
              </label>
              <div className="flex items-center gap-3">
                <TwitterPicker
                  color={iconColor}
                  onChange={(color: ColorResult) => setIconColor(color.hex)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <button
              onClick={() => {
                // set the url to the current url with the search params
                const url = new URL(window.location.href);
                url.searchParams.set("bgColor", backgroundColor);
                url.searchParams.set("iconColor", iconColor);
                window.history.pushState({}, "", url.toString());
              }}
              className="flex-1 text-xs bg-green-600 text-white px-2 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Share
            </button>
            <button
              onClick={downloadImage}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Download
            </button>
          </div>
        </div>

        <div className="rounded-lg shadow-lg flex flex-1 justify-center items-center bg-gray-100 lg:p-8">
          <div className="w-full max-w-4xl aspect-video overflow-hidden border-2 border-gray-200 rounded-xl">
            <iframe
              src={getRenderUrl()}
              className="overflow-hidden"
              style={{
                width: "1920px",
                height: "1080px",
                transform: "scale(0.5)",
                transformOrigin: "top left",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
