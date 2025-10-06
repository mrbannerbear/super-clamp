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
  breakpoints: number[];
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

  /* ----------------- PROPERTY METHODS ----------------- */
  addProperty: (elementId: string, name: string, unit: CSSUnit) => void;
  updatePropertyValue: (elementId: string, propertyId: string, bp: number, value: number | "") => void;
  removeProperty: (elementId: string, propertyId: string) => void;
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

      /* ----------------- PROPERTY METHODS ----------------- */

      // Add a new property to an element
      addProperty: (elementId: string, name: string, unit: CSSUnit) =>
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

      // Update a value of a property for a specific breakpoint
      updatePropertyValue: (
        elementId: string,
        propertyId: string,
        bp: number,
        value: number | ""
      ) =>
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

      // Remove a property from an element
      removeProperty: (elementId: string, propertyId: string) =>
        set((state) => ({
          elements: state.elements.map((el) => {
            if (el.id !== elementId) return el;
            return {
              ...el,
              properties: el.properties.filter((p) => p.id !== propertyId),
            };
          }),
        })),

      reset: () => ({
        breakpoints: [2560, 1920, 1280, 1024, 744, 390],
        elements: [],
      }),
    }),
    { name: "css-clamp-store" }
  )
);
