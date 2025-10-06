"use client";
import React from "react";
import { useStore } from "@/store/useStore";
import PropertyTable from "./PropertyTables";

export default function ElementList() {
  const elements = useStore((s) => s.elements);
  const removeElement = useStore((s) => s.removeElement);
  const setSelector = useStore((s) => s.setSelector);

  if (elements.length === 0) {
    return <div className="text-gray-400">No elements yet — add one to get started.</div>;
  }

  return (
    <div className="space-y-3">
      {elements.map((el) => (
        <div key={el.id} className="bg-gray-800 p-3 rounded-md shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <input
              value={el.selector}
              onChange={(e) => setSelector(el.id, e.target.value)}
              className="px-2 py-1 bg-gray-700 text-gray-100 border border-gray-600 rounded-md"
            />
            <button
              onClick={() => removeElement(el.id)}
              className="text-red-500 px-3 py-1 rounded hover:bg-red-700/20"
            >
              Remove
            </button>
          </div>

          {/* Property table for this element */}
          <PropertyTable elementId={el.id} />
        </div>
      ))}
    </div>
  );
}
