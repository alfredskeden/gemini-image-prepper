# Gemini Image Outpaint Prepper

A browser-based image preparation tool for Gemini's outpainting feature. Designed primarily for Magic: The Gathering card scans from Scryfall, but works with any image.

## What It Does

Place an image on a gray canvas, position and scale it, then export as PNG. The gray border (`#808080`) becomes the "work zone" that Gemini fills in when outpainting. Built-in prompts guide Gemini to seamlessly extend the image into the gray area.

## Features

- **Interactive Canvas** -- Drag to position, corner handles to resize, arrow keys for pixel-perfect nudging
- **Detail-Preserving Resize** -- Custom multi-pass algorithm that maintains fine detail during scaling (also offers standard browser interpolation)
- **DPI-Based Scaling** -- Auto-scale images by DPI value, with presets for Scryfall 300 DPI and 270 DPI
- **Adjustable Canvas Size** -- Default 3520 x 4800 px, user-configurable width and height
- **Aspect Ratio Lock** -- Maintain original proportions during resize
- **Centering Tools** -- One-click horizontal and vertical centering
- **Visual Overlay Guides** -- Optional guide overlays drawn on preview only (never exported)
- **Built-in Outpaint Prompts** -- Two pre-written Gemini prompts with copy buttons; aspect ratio auto-updates to match your canvas
- **Mobile Responsive** -- Fully responsive layout for phones, tablets, and desktops
- **Lossless PNG Export** -- Full-resolution output at canvas dimensions

## Quick Start

### Option 1: Open directly

No build step required. Open `gemini-outpaint-prepper.html` in any modern browser.

### Option 2: Docker

```bash
docker compose up -d
```

The app will be available at `http://localhost:6622`.

To stop:

```bash
docker compose down
```

### Option 3: Build and run manually

```bash
docker build -t gemini-image-prepper .
docker run -d -p 6622:80 --name gemini-image-prepper gemini-image-prepper
```

## How to Use

### 1. Prepare Your Image

1. Upload an image using the file input
2. Position it on the canvas by dragging
3. Resize using corner handles (aspect ratio lock is on by default)
4. Use DPI presets for Scryfall scans (300 DPI applies 4x scale)
5. Adjust canvas dimensions if needed

### 2. Export

Click **Download PNG** to export the full-resolution canvas with image composited onto the gray background.

### 3. Outpaint with Gemini

Below the canvas are two prompt textareas:

1. **"First the handshake"** -- Paste this into Gemini to establish the outpainting rules. Line 6 auto-updates to match your canvas aspect ratio.
2. **"Now the out-paint command"** -- Attach your exported PNG and paste this prompt to trigger the outpaint.

Each prompt has a **Copy** button for quick clipboard access.

## Controls

| Input | Action |
|---|---|
| Click + drag | Move image on canvas |
| Corner handles | Resize image |
| Arrow keys | Nudge image 1 px |
| Scale +/- buttons | Adjust image size (hold to repeat) |
| Keep aspect ratio | Toggle proportional resize |
| Center H / Center V | Center image on axis |
| DPI input | Auto-scale image by DPI value |
| Download PNG | Export full-size composition |

## DPI Scaling

Formula: `scale = 1200 / DPI`

| Preset | DPI | Scale |
|---|---|---|
| Scryfall standard | 300 | 4x |
| 270 DPI | 270 | ~4.44x |
| Custom | any | 1200 / DPI |

## Canvas Defaults

| Property | Value |
|---|---|
| Width | 3520 px |
| Height | 4800 px |
| Background | `#808080` (gray) |
| Output format | PNG (lossless) |

## Technical Details

- **Single-file app** -- All HTML, CSS, JS, and base64 overlay images in one file
- **No build step** -- React 18 + Babel Standalone transpile JSX in the browser
- **Styling** -- Tailwind CSS via CDN
- **Server** -- nginx on Alpine Linux (Docker), or open the file directly
- **Port** -- 6622 (mapped to container port 80)
- **Restart policy** -- `unless-stopped`

### CDN Dependencies

- [Tailwind CSS](https://tailwindcss.com)
- [React 18](https://react.dev)
- [ReactDOM 18](https://react.dev)
- [Babel Standalone](https://babeljs.io/docs/babel-standalone)

## Repository Structure

```
gemini-outpaint-prepper.html   # The entire application
Dockerfile                     # nginx:alpine serving the HTML
docker-compose.yml             # Serves on port 6622
README.md                      # This file
CLAUDE.md                      # AI assistant instructions
```
