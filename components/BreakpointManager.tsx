"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";

export default function BreakpointManager() {
  const breakpoints = useStore((s) => s.breakpoints);
  const addBreakpoint = useStore((s) => s.addBreakpoint);
  const removeBreakpoint = useStore((s) => s.removeBreakpoint);

  const [newBp, setNewBp] = useState("");

  const handleAdd = () => {
    const num = parseInt(newBp);
    if (!num || breakpoints.includes(num)) return;
    addBreakpoint(num);
    setNewBp("");
  };

  return (
    <div className="p-4 border rounded bg-gray-800 text-gray-200">
      <h3 className="font-semibold mb-2">Breakpoints</h3>
      <div className="flex gap-2 flex-wrap mb-2">
        {breakpoints.map((bp) => (
          <div
            key={bp}
            className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded"
          >
            <span>{bp}px</span>
            <button
              onClick={() => removeBreakpoint(bp)}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="number"
          value={newBp}
          onChange={(e) => setNewBp(e.target.value)}
          placeholder="New breakpoint"
          className="px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white w-32"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-1 bg-sky-600 hover:bg-sky-700 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}
