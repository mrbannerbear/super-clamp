"use client";
import React, { useState, useEffect } from "react";
import { useStore, ElementData } from "@/store/useStore";
import { generateCSS } from "@/utils/generateCss";
import { generateClamp } from "@/utils/generateClamp";

export default function ResultPanel() {
  const elements = useStore((s) => s.elements);
  const breakpoints = useStore((s) => s.breakpoints);
  const reset = useStore((s) => s.reset);

  const [open, setOpen] = useState(false);
  const [copiedBp, setCopiedBp] = useState<number | null>(null);

  const sortedBps = [...breakpoints].sort((a, b) => b - a);

  useEffect(() => {
    if (copiedBp !== null) {
      const timeout = setTimeout(() => setCopiedBp(null), 1500);
      return () => clearTimeout(timeout);
    }
  }, [copiedBp]);

  function clearAll() {
    if (!confirm("Are you sure? This will clear all elements and breakpoints.")) return;
    reset();
    setOpen(false);
  }

  return (
    <>
      {/* Result Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 bg-sky-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-sky-700 z-30"
      >
        Result
      </button>

      {/* Slide-over */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-2xl bg-gray-900 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } z-40`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-gray-100 text-lg font-semibold">Generated CSS</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-white px-2 py-1 rounded"
          >
            Close
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-130px)] space-y-4">
          {sortedBps.map((bp) => {
            const activeElements = elements
              .map((el) => {
                const activeProps = el.properties.filter((prop) =>
                  Object.values(prop.values).some((v) => typeof v === "number")
                );
                if (!activeProps.length) return null;
                return { ...el, properties: activeProps };
              })
              .filter(Boolean) as ElementData[];

            if (!activeElements.length) return null;

            let cssForBP = activeElements
              .map((el) => {
                const props = el.properties
                  .map((prop) => {
                    const clampMap = generateClamp(prop.values, breakpoints);
                    return clampMap[bp] ? `  ${prop.name}: ${clampMap[bp]};` : "";
                  })
                  .filter(Boolean)
                  .join("\n");

                if (!props) return "";
                return `${el.selector} {\n${props}\n}`;
              })
              .filter(Boolean)
              .join("\n\n");

            if (cssForBP) cssForBP = `@media (max-width: ${bp}px) {\n${cssForBP}\n}`;

            return (
              <div key={bp} className="border border-gray-700 rounded overflow-hidden">
                <div className="flex justify-between bg-gray-800 px-4 py-2">
                  <h3 className="text-gray-200 font-semibold">{bp}px</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(cssForBP);
                        setCopiedBp(bp);
                      }}
                      className="px-2 py-1 bg-green-600 rounded hover:bg-green-700 text-white"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm(`Clear all values for ${bp}px?`)) return;
                        elements.forEach((el) =>
                          el.properties.forEach((prop) => {
                            prop.values[bp] = "";
                          })
                        );
                      }}
                      className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-white"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto whitespace-pre-wrap">
                  {cssForBP}
                </pre>
              </div>
            );
          })}
        </div>

        <div className="p-4 flex gap-2 border-t border-gray-700">
          <button
            onClick={clearAll}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Copied notification */}
        {copiedBp && (
          <div className="fixed bottom-16 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-all duration-300 z-50">
            CSS for {copiedBp}px copied!
          </div>
        )}
      </div>
    </>
  );
}
