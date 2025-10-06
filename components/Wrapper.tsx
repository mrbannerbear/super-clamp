"use client";
import React from "react";
import AddElementForm from "@/components/AddElementForm";
import ElementList from "@/components/ElementList";
import { useStore } from "@/store/useStore";
import ResultPanel from "./ResultPanel";

export default function Wrapper() {
  const breakpoints = useStore((s) => s.breakpoints);

 return (
    <div className="space-y-6">
      <section className="bg-gray-800 p-4 rounded-md shadow-sm">
        <AddElementForm />
      </section>

      <section className="bg-gray-800 p-4 rounded-md shadow-sm">
        <h3 className="font-medium mb-3 text-gray-100">Breakpoints</h3>
        <div className="flex gap-2 flex-wrap">
          {breakpoints.map((b) => (
            <div
              key={b}
              className="px-3 py-1 bg-gray-700 rounded text-sm text-gray-200"
            >
              {b}px
            </div>
          ))}
        </div>
      </section>

      <section>
        <ElementList />
      </section>

      <section><ResultPanel /></section>
    </div>
  );
}
