"use client";
import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { generateCSS } from "@/utils/generateCss";

export default function ResultPanel() {
  const elements = useStore((s) => s.elements);
  const breakpoints = useStore((s) => s.breakpoints);
  const reset = useStore((s) => s.reset);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const css = generateCSS(elements, breakpoints);

  function copyToClipboard() {
    navigator.clipboard.writeText(css);
    setCopied(true);
  }

  function clearStore() {
    if (confirm("Are you sure? This will clear all elements and breakpoints.")) {
      reset();
      setOpen(false);
      setCopied(false);
    }
  }

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <>
      {/* Result Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 bg-sky-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-sky-700 z-30"
      >
        Result
      </button>

      {/* Copied Notification */}
      <div
        className={`fixed bottom-16 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-all duration-300 transform ${
          copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        } z-50`}
      >
        CSS Copied!
      </div>

      {/* Slide-over */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-2xl bg-gray-900 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } z-40`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-gray-100 text-lg font-semibold">Generated CSS</h2>
          <button
            onClick={() => {
              setOpen(false);
              setCopied(false);
            }}
            className="text-gray-400 hover:text-white px-2 py-1 rounded"
          >
            Close
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-130px)]">
          <pre className="text-gray-200 bg-gray-800 p-4 rounded overflow-x-auto whitespace-pre-wrap">
            {css}
          </pre>
        </div>

        <div className="p-4 flex gap-2 border-t border-gray-700">
          <button
            onClick={copyToClipboard}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={clearStore}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </>
  );
}
