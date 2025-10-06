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
  /** List of breakpoints in descending order */
  breakpoints: number[];

  /** All elements with their properties */
  elements: ElementData[];

  /** Add a new element (like .hero-title) */
  addElement: (selector: string) => void;

  /** Remove element by id */
  removeElement: (id: string) => void;

  /** Change an element’s selector */
  setSelector: (id: string, selector: string) => void;

  /** Add a new breakpoint */
  addBreakpoint: (bp: number) => void;

  /** Reset everything (clear localStorage) */
  reset: () => void;
}

/* ----------------------------- STORE ----------------------------- */

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      breakpoints: [2560, 1920, 1280, 1024, 744, 390],
      elements: [],

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

      addBreakpoint: (bp) =>
        set((state) => {
          if (state.breakpoints.includes(bp)) return state; // avoid duplicates

          const updatedBreakpoints = [...state.breakpoints, bp].sort(
            (a, b) => b - a
          );

          const updatedElements = state.elements.map((el) => ({
            ...el,
            properties: el.properties.map((prop) => ({
              ...prop,
              values: {
                ...prop.values,
                [bp]: "" as "", // <- cast to "" so TS knows it matches Record<number, number | "">
              },
            })),
          }));

          return {
            breakpoints: updatedBreakpoints,
            elements: updatedElements,
          };
        }),

      reset: () => ({
        breakpoints: [2560, 1920, 1280, 1024, 744, 390],
        elements: [],
      }),
    }),
    { name: "css-clamp-store" }
  )
);
