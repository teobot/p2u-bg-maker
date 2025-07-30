"use client";

import { useState, Suspense } from "react";
import { downloadRender } from "./actions/downloadRender";
import { ColorResult, TwitterPicker, SliderPicker } from "react-color";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();

  const [backgroundColor, setBackgroundColor] = useState(
    searchParams.get("bgColor") || "#ffffff"
  );
  const [iconColor, setIconColor] = useState(
    searchParams.get("iconColor") || "#3b82f6"
  );

  const [isDownloading, setIsDownloading] = useState(false);

  const getRenderUrl = () => {
    const params = new URLSearchParams({
      bgColor: backgroundColor,
      iconColor: iconColor,
    });
    return `https://p2u-renderer.vercel.app/?${params.toString()}`;
  };

  const downloadImage = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
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
      link.download = `p2u-bg-${new Date().toISOString()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error);
    } finally {
      setIsDownloading(false);
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
              <div className="flex flex-col items-center gap-3">
                <TwitterPicker
                  key="bg-color-picker"
                  color={backgroundColor}
                  onChange={(color: ColorResult) =>
                    setBackgroundColor(color.hex)
                  }
                />
                <SliderPicker
                  className="w-full"
                  key="bg-color-picker-slider"
                  color={backgroundColor}
                  onChange={(color: ColorResult) =>
                    setBackgroundColor(color.hex)
                  }
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <label
                htmlFor="icon-color-picker"
                className="block text-sm font-medium text-gray-700 mb-4"
              >
                Icon Color
              </label>
              <div className="flex flex-col items-center gap-3">
                <div className="flex flex-col items-center gap-3">
                  <TwitterPicker
                    key="icon-color-picker"
                    color={iconColor}
                    onChange={(color: ColorResult) => setIconColor(color.hex)}
                  />
                  <SliderPicker
                    className="w-full"
                    key="icon-color-picker-slider"
                    color={iconColor}
                    onChange={(color: ColorResult) => setIconColor(color.hex)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <button
              disabled={isDownloading}
              onClick={() => {
                // set the url to the current url with the search params
                const url = new URL(window.location.href);
                url.searchParams.set("bgColor", backgroundColor);
                url.searchParams.set("iconColor", iconColor);
                window.history.pushState({}, "", url.toString());
              }}
              className="flex-1 text-xs bg-green-600 text-white px-2 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Share (copy the url afterwards)
            </button>
            <button
              disabled={isDownloading}
              onClick={downloadImage}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download
            </button>
          </div>
        </div>

        <div className="rounded-lg shadow-lg flex flex-1 justify-center items-center bg-gray-100 lg:p-8">
          <div className="relative w-full max-w-4xl aspect-video overflow-hidden border-2 border-gray-200 rounded-xl">
            {isDownloading && (
              <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-xs z-10 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-500 text-center">Downloading</p>
              </div>
            )}
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
