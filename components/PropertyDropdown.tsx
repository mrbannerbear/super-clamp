"use client";
import React, { useState } from "react";

interface Props {
  onSelect: (name: string) => void;
}

export const allProperties = [
  // 📏 Size & Box Model
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",

  // 🧱 Margin & Padding
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",

  // 🎨 Border & Radius
  "border-width",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-radius",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "outline-width",
  "outline-offset",

  // ✍️ Typography
  "font-size",
  "line-height", // can use px
  "letter-spacing",
  "word-spacing",
  "text-indent",

  // 🧭 Position & Layout
  "top",
  "right",
  "bottom",
  "left",
  "inset",
  "gap",
  "row-gap",
  "column-gap",

  // 🧩 Flex & Grid
  "flex-basis",
  "grid-gap",
  "grid-column-gap",
  "grid-row-gap",
  "grid-template-columns",
  "grid-template-rows",
  "grid-auto-rows",
  "grid-auto-columns",

  // 🌀 Transform & Effects
  "translate",      // e.g. translate(10px)
  "translate-x",
  "translate-y",
  "perspective",
  "skew-x",
  "skew-y",

  // 📐 Miscellaneous
  "object-position",
  "object-position-x",
  "object-position-y",
  "background-position",
  "background-position-x",
  "background-position-y"
];

export default function PropertyDropdown({ onSelect }: Props) {
  const [search, setSearch] = useState("");
  const filtered = allProperties.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-64">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search property..."
        className="w-full px-3 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      {search && (
        <ul className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-md mt-1 max-h-40 overflow-y-auto z-50">
          {filtered.map((prop) => (
            <li
              key={prop}
              onClick={() => {
                onSelect(prop);
                setSearch("");
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-700 text-gray-100"
            >
              {prop}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-gray-400">No matches</li>
          )}
        </ul>
      )}
    </div>
  );
}
