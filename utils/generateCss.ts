import { ElementData } from "@/store/useStore";
import { generateClamp } from "./generateClamp";

/**
 * Generates CSS per breakpoint, skips empty elements/properties
 */
export function generateCSS(elements: ElementData[], breakpoints: number[]) {
  const sortedBps = [...breakpoints].sort((a, b) => b - a);
  let css = "";

  for (const bp of sortedBps) {
    let bpCss = "";

    for (const el of elements) {
      const activeProps = el.properties.filter((prop) =>
        Object.values(prop.values).some((v) => typeof v === "number")
      );

      if (!activeProps.length) continue; // skip element entirely

      let propsCss = "";
      for (const prop of activeProps) {
        const clampMap = generateClamp(prop.values, breakpoints);
        if (clampMap[bp]) propsCss += `    ${prop.name}: ${clampMap[bp]};\n`;
      }

      if (propsCss) bpCss += `  ${el.selector} {\n${propsCss}  }\n`;
    }

    if (bpCss) css += `@media (max-width: ${bp}px) {\n${bpCss}}\n\n`;
  }

  return css;
}
