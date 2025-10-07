# Responsive CSS Clamp Generator

**Single-line description:**  
**Responsive CSS Clamp Generator** – Generate CSS with responsive clamp values per breakpoint for multiple elements, with live preview, copy, and clear controls.

**Live Demo:** [Try it here](https://your-live-link.com)

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Dynamic breakpoints** – Add, remove, or update breakpoints easily.
- **Element-based CSS** – Manage multiple elements like `.hero-title` or `#header`.
- **Property management** – Add CSS properties per element with numeric values and units.
- **Responsive `clamp()`** – Automatically generates CSS using `clamp()` for smooth scaling across breakpoints.
- **Live preview** – View generated CSS in real-time per breakpoint.
- **Per-breakpoint controls** – Copy or clear CSS for each breakpoint individually.
- **Reset functionality** – Clear all elements and breakpoints with one click.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mrbannerbear/super-clamp.git
```

2. Install dependencies:

```bash
npm install  
or  
yarn
```

3. Run the development server:

```bash
npm run dev  
or  
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. Click **Add Element** to create a new CSS selector.  
2. Add **properties** (e.g., `font-size`, `margin-top`) and set values per breakpoint.  
3. Add or remove **breakpoints** dynamically as needed.  
4. Click **Result** to open the slide-over panel:  
   - Each breakpoint has its own section with CSS output.  
   - Use **Copy** to copy CSS for that breakpoint.  
   - Use **Clear** to clear values for a specific breakpoint.  
5. Click **Clear All** to reset the entire store.

---

## How It Works

### 1. Breakpoints
- All breakpoints are stored in descending order.
- Missing values for a property at a breakpoint are ignored in that breakpoint's CSS.
- Adding a new breakpoint automatically inserts it in the correct descending order.

### 2. Elements & Properties
- Each element (e.g., `.hero`) has multiple properties (e.g., `font-size`).
- Properties store numeric values per breakpoint and a separate unit (e.g., `px`, `rem`).

### 3. Clamp Calculation
- The tool uses the `clamp()` formula for smooth scaling between breakpoints:

slope = (maxValue - minValue) / (maxBreakpoint - minBreakpoint) * 100  
intercept = minValue - slope * minBreakpoint / 100  
clampValue = clamp(minValue, slope * vw + intercept, maxValue)

- Only active properties (with values) are included in the generated CSS.

### 4. CSS Generation
- For each breakpoint, only elements with active properties are included.
- Each breakpoint has its own section in the result panel for easier control.
- Copy or clear CSS per breakpoint without affecting others.

---

## Project Structure

/components  
  ResultPanel.tsx     # Slide-over UI panel for CSS results  
/utils  
  generateCss.ts      # Generates CSS per breakpoint  
  generateClamp.ts    # Calculates clamp values for responsive scaling  
/store  
  useStore.ts         # Zustand store for elements, properties, breakpoints  
/helpers  
  breakpoints.ts      # Helper functions for sorting and managing breakpoints  

---

## Contributing

Contributions are welcome!  

- Submit bug reports or feature requests via Issues.  
- Fork the repo and create pull requests for improvements.

---

## License

MIT License
