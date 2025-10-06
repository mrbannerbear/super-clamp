import { ElementData } from "@/store/useStore";
import { generateClamp } from "./generateClamp";

export function generateCSS(elements: ElementData[], breakpoints: number[]) {
  let css = "";

  const sortedBps = [...breakpoints].sort((a, b) => b - a);

  for (const bp of sortedBps) {
    css += `@media (max-width: ${bp}px) {\n`;

    for (const el of elements) {
      css += `  ${el.selector} {\n`;

      for (const prop of el.properties) {
        const clampMap = generateClamp(prop.values, breakpoints);
        if (clampMap[bp]) {
          css += `    ${prop.name}: ${clampMap[bp]};\n`;
        }
      }

      css += `  }\n`;
    }

    css += `}\n\n`;
  }

  return css;
}
