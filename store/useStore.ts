"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ----------------------------- TYPES ----------------------------- */

/** Supported CSS units */
export type CSSUnit = "px" | "rem" | "em" | "%" | "vw" | "vh";

/** Each property has a name (like font-size), a map of breakpoints → value, and a unit */
export interface CSSProperty {
  id: string;
  name: string;
  values: Record<number, number | "">; // numeric values only (unit handled separately)
  unit: CSSUnit;
}

/** Represents a single element like `.page-title` or `#hero` */
export interface ElementData {
  id: string;
  selector: string;
  properties: CSSProperty[];
}

/** Zustand store shape */
export interface Store {
  mode: string;
  breakpoints: number[];
  elements: ElementData[];

  // Element methods
  addElement: (selector: string) => void;
  removeElement: (id: string) => void;
  setSelector: (id: string, selector: string) => void;

  // Breakpoint methods
  addBreakpoint: (bp: number) => void;
  removeBreakpoint: (bp: number) => void;
  updateBreakpoint: (oldBp: number, newBp: number) => void;

  // Property methods
  addProperty: (elementId: string, name: string, unit: CSSUnit) => void;
  updatePropertyValue: (
    elementId: string,
    propertyId: string,
    bp: number,
    value: number | ""
  ) => void;
  removeProperty: (elementId: string, propertyId: string) => void;

  // clear breakpoint values
  clearBreakpointValues: (bp: number) => void;

  // Toggle between simple and advanced calculators
  toggleMode: () => void

  // reset all
  reset: () => void;
}

/* ----------------------------- STORE ----------------------------- */

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      breakpoints: [2560, 1920, 1280, 1024, 744, 390],
      elements: [],

      /* ----------------- ELEMENT METHODS ----------------- */
      addElement: (selector) => {
        const trimmed = selector.trim();
        if (!trimmed) return;
        const id = crypto.randomUUID();

        set((state) => ({
          elements: [
            ...state.elements,
            {
              id,
              selector: trimmed,
              properties: [],
            },
          ],
        }));
      },

      removeElement: (id) =>
        set((state) => ({
          elements: state.elements.filter((el) => el.id !== id),
        })),

      setSelector: (id, selector) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            el.id === id ? { ...el, selector } : el
          ),
        })),

      /* ----------------- BREAKPOINT METHODS ----------------- */

      addBreakpoint: (bp) => {
        const state = get();
        if (state.breakpoints.includes(bp)) return;
        const updated = [...state.breakpoints, bp].sort((a, b) => b - a);
        set({ breakpoints: updated });
      },

      removeBreakpoint: (bp) => {
        const updated = get().breakpoints.filter((b) => b !== bp);
        set({ breakpoints: updated });
      },

      updateBreakpoint: (oldBp, newBp) => {
        const state = get();
        const updated = state.breakpoints
          .map((b) => (b === oldBp ? newBp : b))
          .sort((a, b) => b - a);
        set({ breakpoints: updated });
      },

      /* ----------------- PROPERTY METHODS ----------------- */

      addProperty: (elementId, name, unit) =>
        set((state) => ({
          elements: state.elements.map((el) => {
            if (el.id !== elementId) return el;
            const newProp: CSSProperty = {
              id: crypto.randomUUID(),
              name,
              unit,
              values: Object.fromEntries(
                state.breakpoints.map((bp) => [bp, ""])
              ) as Record<number, number | "">,
            };
            return { ...el, properties: [...el.properties, newProp] };
          }),
        })),

      updatePropertyValue: (elementId, propertyId, bp, value) =>
        set((state) => ({
          elements: state.elements.map((el) => {
            if (el.id !== elementId) return el;
            const properties = el.properties.map((prop) => {
              if (prop.id !== propertyId) return prop;
              return { ...prop, values: { ...prop.values, [bp]: value } };
            });
            return { ...el, properties };
          }),
        })),

      removeProperty: (elementId, propertyId) =>
        set((state) => ({
          elements: state.elements.map((el) => {
            if (el.id !== elementId) return el;
            return {
              ...el,
              properties: el.properties.filter((p) => p.id !== propertyId),
            };
          }),
        })),

      /* ----------------- CLEAR VALUES FOR SPECIFIC BP ----------------- */

      clearBreakpointValues: (bp) => {
        set((state) => {
          const updatedElements = state.elements
            .map((el) => {
              const updatedProperties = el.properties
                .map((prop) => {
                  // Remove the specific breakpoint key entirely
                  const newValues = { ...prop.values };
                  delete newValues[bp];
                  return { ...prop, values: newValues };
                })
                // Remove properties that now have no values left
                .filter((prop) => Object.keys(prop.values).length > 0);

              return { ...el, properties: updatedProperties };
            })
            // Remove elements that now have no properties
            .filter((el) => el.properties.length > 0);

          return { elements: updatedElements };
        });
      },

      mode: "advanced", // "advanced" | "simple"
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "advanced" ? "simple" : "advanced",
        })),


      /* ----------------- RESET EVERYTHING ----------------- */

      reset: () =>
        set({
          elements: [],
          breakpoints: [2560, 1920, 1280, 1024, 744, 390],
        }),
    }),
    { name: "css-clamp-store" }
  )
);
