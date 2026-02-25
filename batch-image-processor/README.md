# Batch Image Processor

A privacy-first, browser-based batch image processing tool. Compress, resize, watermark, and convert images in bulk without uploading to any server.

## Features

- **Batch Compress**: Reduce file size while maintaining quality, with EXIF preservation
- **Batch Resize**: Multiple presets for social media and e-commerce, plus custom dimensions
- **Batch Watermark**: Text and image watermarks with customizable position, opacity, and rotation
- **Format Convert**: Support for JPEG, PNG, WebP, and AVIF formats
- **Folder Support**: Upload entire folders and maintain folder structure
- **100% Private**: All processing happens locally in your browser
- **PWA Support**: Install as an app and use offline

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Zustand (state management)
- Web Workers (for performance)
- Canvas API (image processing)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

```bash
# Run dev server with hot reload
npm run dev

# The app will be available at http://localhost:5173
```

## Usage

1. **Upload Images**: Drag and drop images or select folders
2. **Configure Options**: Adjust settings for compression, resize, watermark, or format conversion
3. **Process**: Click "Process" to batch process all images
4. **Download**: Download processed images individually or as a ZIP file

## SEO Keywords

- batch image compressor
- bulk image resize
- compress image without uploading
- privacy first image editor
- image watermark tool
- format converter

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+

## Privacy

This application processes all images locally in your browser using the Canvas API. 
No images are ever uploaded to any server, ensuring complete privacy.

## License

MIT
