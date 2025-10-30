"use client";
import React, { useState, useEffect, useRef } from "react";

export default function SimpleCalculator() {
  const [minWidth, setMinWidth] = useState("");
  const [maxWidth, setMaxWidth] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [result, setResult] = useState("");
  const [notification, setNotification] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced calculation on input change
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => generateClamp(), 100);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [minWidth, maxWidth, minValue, maxValue]);

  const generateClamp = () => {
    const minW = parseFloat(minWidth);
    const maxW = parseFloat(maxWidth);
    const minV = parseFloat(minValue);
    const maxV = parseFloat(maxValue);

    if (
      isNaN(minW) ||
      isNaN(maxW) ||
      isNaN(minV) ||
      isNaN(maxV) ||
      maxW === minW
    ) {
      setResult("Invalid inputs");
      return;
    }

    // Calculate slope: YY = 100 * (maxV - minV) / (maxW - minW)
    const slope = ((maxV - minV) / (maxW - minW)) * 100;

    // Determine clamp bounds
    const lower = Math.min(minV, maxV);
    const upper = Math.max(minV, maxV);

    // ZZ = minimum viewport's value in REM
    const remBase = minV / 16;

    // XX = minimum viewport / 100
    const minViewport = minW / 100;

    const clampStr = `clamp(${lower}px, calc(${remBase}rem + ((1vw - ${minViewport}px) * ${slope.toFixed(
      4
    )})), ${upper}px)`;

    setResult(clampStr);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setNotification("Copied!");
    setTimeout(() => setNotification(""), 1500);
  };

  const clearAll = () => {
    setMinWidth("");
    setMaxWidth("");
    setMinValue("");
    setMaxValue("");
    setResult("");
    setNotification("Cleared!");
    setTimeout(() => setNotification(""), 1500);
  };

  return (
    <div className="space-y-4 text-gray-100 relative">
      <h3 className="text-lg font-medium mb-2">Simple Clamp Calculator</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm">Min Width (px)</label>
          <input
            type="number"
            value={minWidth}
            onChange={(e) => setMinWidth(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Max Width (px)</label>
          <input
            type="number"
            value={maxWidth}
            onChange={(e) => setMaxWidth(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Min Value (px)</label>
          <input
            type="number"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Max Value (px)</label>
          <input
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-100"
          />
        </div>
      </div>

      {result && (
        <div className="bg-gray-900 p-3 rounded mt-4 flex items-center justify-between">
          <code className="text-sm break-all">{result}</code>
          <div className="flex gap-2 ml-4">
            <button
              onClick={copyToClipboard}
              className="bg-green-600 px-3 py-1 rounded text-white cursor-pointer"
            >
              Copy
            </button>
            <button
              onClick={clearAll}
              className="bg-red-600 px-3 py-1 rounded text-white cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded shadow-md">
          {notification}
        </div>
      )}
    </div>
  );
}