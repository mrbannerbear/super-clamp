"use client";
import React, { useState } from "react";

export default function SimpleCalculator() {
  const [minWidth, setMinWidth] = useState("");
  const [maxWidth, setMaxWidth] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [result, setResult] = useState("");

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

    const slope = ((maxV - minV) / (maxW - minW)) * 100;
    const intercept = minV - (slope * minW) / 100;

    const clampStr = `clamp(${minV}px, ${slope.toFixed(
      3
    )}vw + ${intercept.toFixed(3)}px, ${maxV}px)`;
    setResult(clampStr);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
  };

  const clearAll = () => {
    setMinWidth("");
    setMaxWidth("");
    setMinValue("");
    setMaxValue("");
    setResult("");
  };

  return (
    <div className="space-y-4 text-gray-100">
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

      <button
        onClick={generateClamp}
        className="bg-blue-600 px-4 py-2 rounded text-white"
      >
        Generate
      </button>

      {result && (
        <div className="bg-gray-900 p-3 rounded mt-4 flex items-center justify-between">
          <code className="text-sm break-all">{result}</code>
          <div className="flex gap-2 ml-4">
            <button
              onClick={copyToClipboard}
              className="bg-green-600 px-3 py-1 rounded text-white"
            >
              Copy
            </button>
            <button
              onClick={clearAll}
              className="bg-red-600 px-3 py-1 rounded text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
