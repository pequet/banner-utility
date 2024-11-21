# Banner Utility

## Overview

Standalone tool designed to render customizable ASCII banners. It's perfect for adding a unique touch to your projects, whether you're working on a Node.js application, an Obsidian plugin, or any other project that could benefit from a bit of ASCII art flair.

## Features

- **Customizable Banners**: Generate banners with ASCII art logos and metadata.
- **Color Customization**: Use ANSI escape codes to colorize your banners.
- **Flexible Layout**: Adjust spacing and alignment to fit your needs.

## Installation

Since this is a single-file utility, you can easily integrate it into your project by copying the `banner.ts` file into your desired directory.

## Usage

Here's a quick example of how to use the Banner Utility:

```typescript
import { renderBanner } from './utils/banner';

const LOGO_STR = `
  ████  
 █ ████  
 ██████  
  ████  
`;

const META = { name: "MyPlugin", version: "1.0.0" };

console.log(renderBanner(LOGO_STR, META, { logoColor: "\x1b[31m", inlineMeta: false }));
```
