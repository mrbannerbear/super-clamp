"use client";
import React, { useState } from "react";

interface Props {
  onSelect: (name: string) => void;
}

const allProperties = [
  "font-size",
  "margin-top",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "padding",
  "padding-top",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "width",
  "height",
  "line-height",
  "letter-spacing",
  "border-radius",
  "opacity",
  "top",
  "left",
  "right",
  "bottom",
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
