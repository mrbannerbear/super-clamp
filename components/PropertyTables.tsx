"use client";
import React, { useState } from "react";
import { useStore, CSSUnit } from "@/store/useStore";
import PropertyDropdown from "./PropertyDropdown";

interface Props {
  elementId: string;
}

const units: CSSUnit[] = ["px", "rem", "em", "%", "vw", "vh"];

export default function PropertyTable({ elementId }: Props) {
  const breakpoints = useStore((s) => s.breakpoints);
  const element = useStore((s) => s.elements.find((el) => el.id === elementId));
  const addProperty = useStore((s) => s.addProperty);
  const updateValue = useStore((s) => s.updatePropertyValue);
  const removeProperty = useStore((s) => s.removeProperty);

  const [showDropdown, setShowDropdown] = useState(false);

  if (!element) return null;

  return (
    <div className="bg-gray-800 p-3 rounded-md shadow-sm mt-3">
      <h4 className="text-gray-100 mb-2 font-medium">Properties</h4>

      <table className="w-full text-gray-100 border border-gray-600">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-2 py-1 border-r border-gray-600">Property</th>
            <th className="px-2 py-1 border-r border-gray-600">Unit</th>
            {breakpoints.map((bp) => (
              <th key={bp} className="px-2 py-1 border-r border-gray-600">
                {bp}px
              </th>
            ))}
            <th className="px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {element.properties.map((prop, rowIndex) => (
            <tr key={prop.id} className="hover:bg-gray-700">
              <td className="px-2 py-1">{prop.name}</td>
              <td className="px-2 py-1">
                <select
                  value={prop.unit}
                  onChange={(e) => {
                    const newUnit = e.target.value as CSSUnit;
                    addProperty(elementId, prop.name, newUnit);
                  }}
                  className="bg-gray-700 text-gray-100 border border-gray-600 rounded px-1 py-0.5"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </td>

              {breakpoints.map((bp, colIndex) => (
                <td key={bp} className="px-1 py-1">
                  <input
                    type="number"
                    value={prop.values[bp] ?? ""}
                    data-row={rowIndex}
                    data-col={colIndex}
                    onKeyDown={(e) => {
                      if (
                        e.altKey &&
                        (e.key === "ArrowDown" || e.key === "ArrowUp")
                      ) {
                        e.preventDefault();

                        const current = e.currentTarget;
                        const row = Number(current.dataset.row);
                        const col = Number(current.dataset.col);

                        const nextRow =
                          e.key === "ArrowDown" ? row + 1 : row - 1;

                        const nextInput = document.querySelector(
                          `input[data-row="${nextRow}"][data-col="${col}"]`
                        ) as HTMLInputElement | null;

                        if (nextInput) {
                          nextInput.focus();
                        }
                      }
                    }}
                    onChange={(e) =>
                      updateValue(
                        elementId,
                        prop.id,
                        bp,
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-16 bg-gray-700 text-gray-100 border border-gray-600 rounded px-1 py-0.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </td>
              ))}

              <td className="px-1 py-1">
                <button
                  onClick={() => removeProperty(elementId, prop.id)}
                  className="text-red-500 hover:bg-red-700/20 px-2 py-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add property button */}
      <div className="mt-2">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700"
        >
          Add Property
        </button>
        {showDropdown && (
          <div className="mt-1">
            <PropertyDropdown
              onSelect={(name) => {
                addProperty(elementId, name, "px");
                setShowDropdown(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
