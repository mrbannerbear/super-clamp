"use client";
import React from "react";
import AddElementForm from "@/components/AddElementForm";
import ElementList from "@/components/ElementList";
import { useStore } from "@/store/useStore";
import ResultPanel from "./ResultPanel";
import BreakpointManager from "./BreakpointManager";
import SimpleCalculator from "./SimpleCalculator"; 

export default function Wrapper() {
  const breakpoints = useStore((s) => s.breakpoints);
  const mode = useStore((s) => s.mode);
  const toggleMode = useStore((s) => s.toggleMode);

  return (
    <div className="space-y-6">
      <button
        onClick={toggleMode}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Switch to {mode === "advanced" ? "Simple" : "Advanced"} Mode
      </button>

      {mode === "advanced" ? (
        <>
          <section className="bg-gray-800 p-4 rounded-md shadow-sm">
            <AddElementForm />
          </section>

          <section className="bg-gray-800 p-4 rounded-md shadow-sm">
            <h3 className="font-medium mb-3 text-gray-100">Breakpoints</h3>
            <BreakpointManager />
          </section>

          <section>
            <ElementList />
          </section>

          <section>
            <ResultPanel />
          </section>
        </>
      ) : (
        <section className="bg-gray-800 p-4 rounded-md shadow-sm">
          <SimpleCalculator />
        </section>
      )}
    </div>
  );
}
