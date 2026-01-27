# Gemini Image Prepper

A web-based image preparation tool for preparing images (especially Magic: The Gathering card scans from Scryfall) for use with Gemini's image generation and outpainting features.

## Overview

This tool provides a canvas-based interface where you can:
- Upload and position images on a fixed-size canvas (3264 × 4440 px)
- Resize images with detail-preserving algorithms
- Apply DPI-based scaling (with presets for Scryfall's 300 DPI scans)
- Download the prepared image as a lossless PNG

The application runs as a standalone HTML file served via nginx in a Docker container.

## Features

- **Interactive Canvas**: Drag and drop images, resize with corner handles
- **Detail-Preserving Resize**: Uses advanced algorithms to maintain image quality during scaling
- **DPI Override**: Automatically scale images based on DPI settings (270 DPI and 300 DPI presets included)
- **Visual Overlay Guide**: Optional overlay guide (visual only, not exported)
- **Keyboard Controls**: Arrow keys for pixel-perfect positioning
- **Aspect Ratio Lock**: Maintain original image proportions
- **Centering Tools**: Quick horizontal and vertical centering buttons

## Canvas Specifications

- **Size**: 3264 × 4440 pixels
- **Background Color**: #808080 (gray)
- **Output Format**: PNG (lossless)

## DPI Scaling

The tool includes DPI-based scaling functionality:
- **Formula**: Scale = 1200 / DPI
- **Scryfall Preset**: 300 DPI (400% scale) - Scryfall scans are always 300 DPI
- **270 DPI Preset**: ≈444% scale
- **Custom DPI**: Enter any DPI value for automatic scaling

## Usage

### Running with Docker Compose

```bash
docker-compose up -d
```

The application will be available at `http://localhost:6622`

### Building the Docker Image

```bash
docker build -t gemini-image-prepper .
```

### Running the Container

```bash
docker run -d -p 6622:80 --name gemini-image-prepper gemini-image-prepper
```

## Controls

- **Click and drag**: Move the image on the canvas
- **Corner handles**: Resize the image
- **Arrow keys**: Nudge the image by 1 pixel
- **Keep aspect ratio**: Checkbox to maintain original proportions
- **Center buttons**: Quickly center horizontally or vertically
- **Download PNG**: Export the final composition

## Technical Details

- **Web Server**: nginx (Alpine Linux)
- **Port**: 6622 (mapped to container port 80)
- **File**: `gemini-outpaint-prepper.html` served as `index.html`
- **Container Restart Policy**: `unless-stopped`

## Notes

- The overlay guide (if enabled) is visual-only and will not be included in downloaded images
- The preview is scaled down to 25% for display purposes
- The canvas maintains a fixed size optimized for Gemini image processing
- Background color is embedded in the exported PNG
