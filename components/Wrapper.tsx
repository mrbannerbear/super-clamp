"use client";
import React from "react";
import AddElementForm from "@/components/AddElementForm";
import ElementList from "@/components/ElementList";
import { useStore } from "@/store/useStore";
import ResultPanel from "./ResultPanel";
import BreakpointManager from "./BreakpointManager";

export default function Wrapper() {
  const breakpoints = useStore((s) => s.breakpoints);

 return (
    <div className="space-y-6">
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

      <section><ResultPanel /></section>
    </div>
  );
}
