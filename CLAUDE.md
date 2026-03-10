# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-file React web app for preparing images for Gemini's outpainting feature. Designed primarily for Magic: The Gathering card scans from Scryfall. The entire application lives in `gemini-outpaint-prepper.html` (~1827 lines).

## Repository Structure

```
gemini-outpaint-prepper.html   # The entire app (HTML + CSS + JS + base64 overlays)
Dockerfile                      # nginx:alpine serving the HTML as index.html
docker-compose.yml              # Serves on port 6622
README.md                       # User-facing documentation
CLAUDE.md                       # This file
.gitignore                      # Ignores .claude/, .DS_Store, editor files
```

## Running & Development

No build step. Open the HTML file directly in a browser or use Docker:

```bash
docker compose up -d       # Serves on port 6622 via nginx
docker compose down        # Shuts the docker container down
```

For local dev, just open `gemini-outpaint-prepper.html` in a browser — React and Babel run in the browser via CDN.

## Architecture

**Single-file monolith**: All CSS (Tailwind CDN + custom), JS (React 18 + Babel Standalone via CDN), and base64-encoded overlay images are embedded in one HTML file. There is no package.json, no build toolchain, and no separate JS/CSS files.

### CDN Dependencies

- Tailwind CSS: `https://cdn.tailwindcss.com`
- React 18: `https://unpkg.com/react@18/umd/react.development.js`
- ReactDOM 18: `https://unpkg.com/react-dom@18/umd/react-dom.development.js`
- Babel Standalone: `https://unpkg.com/@babel/standalone/babel.min.js`

### File Layout (top to bottom)

1. **`<head>`** (lines 1–72): Meta tags, Tailwind config (custom colors, animations), custom CSS (scrollbar, mobile styles)
2. **React component** (lines 73–1610): `DetailPreserveImageResizer` — the main and only React component
3. **Outpaint prompt section** (lines 1618–1709): Static HTML with two pre-written Gemini prompts and copy buttons
4. **Copy-to-clipboard utility** (lines 1711–1823): Vanilla JS IIFE handling clipboard with multiple fallbacks

### Main Component: `DetailPreserveImageResizer`

A single React function component managing all state and canvas rendering. Key sections:

- **Overlay sources** (lines 82–106): `OVERLAY_SOURCES` array with base64-encoded PNG guide images
- **State declarations** (lines 108–145): All `useState` hooks
- **Image loading & clamping** (lines 146–210): Auto-fit, DPI scaling, boundary enforcement
- **Canvas drawing** (`drawPreview` callback, lines ~240–360): Three-canvas pipeline
- **Responsive scaling** (lines ~580–625): Dynamic `canvasScale` based on viewport width
- **Event handlers** (lines ~640–780): Mouse/touch drag, resize handles, keyboard, scale buttons
- **Download/export** (`downloadPNG`, lines ~920–980): Full-size canvas render → blob download
- **Aspect ratio prompt updater** (lines 986–1040): Auto-updates textarea line 6 with current canvas ratio
- **JSX render** (lines 1042–1610): UI layout with controls, canvas, and info section

### Canvas Rendering Pipeline (three-canvas approach)

1. **Final canvas**: `canvasW × canvasH` (default 3520×4800px) target output
2. **Temp canvas**: Sized to current image dimensions, applies resize algorithm
3. **Display canvas**: Scaled by `canvasScale` (responsive, typically 0.13–0.25) for live preview

### Export Flow

`downloadPNG()` → create full-size canvas → fill `#808080` gray background → apply resize algorithm to temp canvas → composite → blob download as PNG.

### Resize Algorithms (user-selectable)

- `detail-preserve` (default): Custom multi-pass algorithm preserving fine detail
- `standard`: Browser canvas interpolation (`imageSmoothingQuality: "high"`)

### DPI Scaling

Formula: `scale = 1200 / DPI`. Changing DPI triggers a `useEffect` that auto-scales image dimensions. Presets: 300 DPI (Scryfall standard), 270 DPI.

### Interaction Model

- Mouse/touch events → state updates → canvas redraw
- Arrow keys nudge position 1px
- Hold-to-repeat via `repeatRef` interval for scale buttons
- Corner handles for resize (with optional aspect ratio lock)

### Overlays

Multiple base64-encoded PNG guides stored in `OVERLAY_SOURCES` array. Loaded async on mount. Drawn on display canvas only, never exported. Each overlay has: `name`, `src` (base64), `enabled` (default state), `opacity`.

### Outpaint Prompts Section

Two pre-written Gemini prompts below the canvas:
1. **"First the handshake"** (`#outpaint-1`): System role prompt establishing rules for neutral photo extension
2. **"Now the out-paint command"** (`#outpaint-2`): The actual outpaint instruction to attach with the image

Line 6 of prompt 1 is auto-updated by the React component to reflect the current canvas aspect ratio (e.g., "5:7 Vertical Ratio").

### Tailwind Custom Config

Custom colors defined in `tailwind.config`:
- `bg-dark`: `#111111`
- `text-light`: `#eeeeee`
- `border-dark`: `#333333`
- `bg-input`: `#0b0b0b`

Custom animation: `fade-in` (0.3s ease-in-out translateY)

## Key State Variables

| Variable | Type | Default | Description |
|---|---|---|---|
| `canvasW` / `canvasH` | number | 3520 / 4800 | Canvas output dimensions (user-adjustable) |
| `canvasScale` | number | 0.25 | Display preview scale (responsive) |
| `imgState` | `{x, y, w, h}` | centered | Image position and size in canvas pixels |
| `imageObj` | Image \| null | null | Loaded HTML Image element |
| `keepAspect` | boolean | true | Lock aspect ratio during resize |
| `resizeAlgorithm` | string | `"detail-preserve"` | `"detail-preserve"` or `"standard"` |
| `dpiOverride` | string | `""` | DPI value for auto-scaling (empty = disabled) |
| `overlays` | array | `[]` | Loaded overlay objects with enabled/opacity state |

## Important Notes

- The canvas dimensions (3520×4800) are the defaults but can be changed by the user via input fields
- Background color `#808080` is hardcoded for the gray zone that Gemini fills
- The preview scale is responsive — it adapts based on viewport width, not a fixed 0.25
- Images are clamped to stay within canvas bounds after any state change
- No tests exist — this is a presentation/UI project with no test framework
