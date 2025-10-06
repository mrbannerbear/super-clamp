"use client";
import React, { useState } from "react";
import { useStore } from "@/store/useStore";

export default function AddElementForm() {
  const [selector, setSelector] = useState("");
  const addElement = useStore((s) => s.addElement);

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const val = selector.trim();
    if (!val) return;
    addElement(val);
    setSelector("");
  }

  return (
    <form onSubmit={onAdd} className="flex gap-2">
      <input
        value={selector}
        onChange={(e) => setSelector(e.target.value)}
        placeholder=".page-title or #hero"
        className="px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        type="submit"
        className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
      >
        Add Element
      </button>
    </form>
  );
}
