/**
 *  ████  Banner Utility
 * ████   Version: 1.0.0
 *  ████  Author: Benjamin Pequet
 * ████   Github: https://github.com/pequet
 *
 * @file banner.ts
 * @description A standalone utility for rendering customizable ASCII banners, designed for use across various projects.
 *
 * @license
 * These files are provided for educational purposes only. Collaboration is welcome.
 *
 * @notes
 * This script is part of a meta project aimed at creating unique and adaptable ASCII banners for any programming language.
 * The design allows for easy translation and integration into different environments.
 */

// Example usage for inline mode
// const LOGO_STR = `
// ^
//   ├─
//   ├─
//   └─
// `;

/**
 * Renders a visually aligned banner with a logo and metadata.
 * Combines an ASCII logo with plugin metadata (e.g., name, version) to create
 * a formatted output suitable for terminal display. The metadata keys can be 
 * capitalized, excluded, or rendered inline.
 * 
 * @param {string} logo - ASCII logo string.
 * @param {Object} meta - Metadata object containing plugin information (e.g., name, version).
 * @param {Object} options - Configuration options for rendering.
 * @param {string} [options.logoColor="\x1b[0m"] - ANSI escape code for logo color.
 * @param {string} [options.textColor="\x1b[0m"] - ANSI escape code for text color.
 * @param {number} [options.spacing=2] - Number of spaces between the logo and metadata text.
 * @param {boolean} [options.inlineMeta=false] - Whether to render metadata inline with the logo.
 * @param {string[]} [options.excludeKeys=[]] - List of metadata keys to exclude from rendering.
 * 
 * @returns {string} - Aligned banner string with logo and metadata.
 * 
 * @example
 * const meta = { name: "MyPlugin", version: "1.0.0" };
 * console.log(renderBanner(LOGO_STR, meta, { logoColor: "\x1b[31m", inlineMeta: true }));
 */
export function renderBanner(
    logo,
    meta,
    { 
        logoColor = "\x1b[0m", 
        textColor = "\x1b[0m", 
        spacing = 2, 
        inlineMeta = false, 
        excludeKeys = [] 
    } = {}
) {
    const logoLines = logo
        .split("\n") // Split the logo into lines
        .slice(logo.split("\n").findIndex(line => line.trim() !== "")); // Skip leading empty lines
    const maxLogoWidth = Math.max(...logoLines.map(line => line.length)); // Find the longest logo line
    const maxKeyWidth = Math.max(
        ...Object.keys(meta).map(key => (excludeKeys.includes(key.toLowerCase()) ? 0 : key.length)) // Exclude keys correctly
    ); // Find the longest meta key (only for non-excluded keys)
    const paddingLength = maxKeyWidth + spacing;

    // Normalize excludeKeys to lowercase for consistent comparison
    const excludeSet = new Set(excludeKeys.map(key => key.toLowerCase()));

    // Extract meta as [key, value] pairs
    const metaEntries = Object.entries(meta);

    // Determine the maximum number of rows to output
    const maxRows = Math.max(logoLines.length, metaEntries.length);

    // Combine each logo line with meta keys (capitalized or replaced) and values
    const alignedLines = Array.from({ length: maxRows }).map((_, index) => {
        const logoLine = logoLines[index] || ""; // Use an empty string if no logo line
        const paddedLine = `${logoColor}${logoLine.padEnd(maxLogoWidth + spacing, " ")}${textColor}`; // Add color to logo

        const metaEntry = metaEntries[index]; // Get the corresponding meta key-value pair
        if (metaEntry) {
            const [key, value] = metaEntry;
            const isExcluded = excludeSet.has(key.toLowerCase());
            const keyLabel = isExcluded ? "" : `${key.charAt(0).toUpperCase() + key.slice(1)}:`;
            // const keyAndValue = `${keyLabel.padEnd(paddingLength)} ${value}`; // Maintain spacing even when excluding
            const keyAndValue = isExcluded 
            ? `${value}`.padStart(paddingLength) // Skip key label and its padding, align value with other keys
            : inlineMeta ? `${keyLabel} ${value}`
            : `${keyLabel.padEnd(paddingLength)} ${value}`;

            if (inlineMeta) {
                // Inline mode: combine logo and meta value directly
                return `${logoColor}${logoLine} ${textColor}${keyAndValue.trim()}`;
            } else {
                // Default: meta aligns to the right
                return `${paddedLine}${keyAndValue}`;
            }
        } else {
            return paddedLine; // If no meta entry, return the padded logo line
        }
    });

    return alignedLines.join("\n");
}

/**
 * Retrieves a terminal-compatible ANSI escape code for a color in the HSL color space.
 * Converts HSL to RGB and returns the ANSI escape sequence for the color.
 * @param {number} index - Zero-based index of the desired color in the palette.
 * @param {number} count - Total number of colors in the palette.
 * @param {number} saturation - Saturation level for all colors (0–100%, default is 70%).
 * @param {number} lightness - Lightness level for all colors (0–100%, default is 50%).
 * @returns {string} - ANSI escape code for the color.
 * Example:
 *   const logoColor = getAnsiColorFromPalette(3, 6);
 *   console.log(`${logoColor}This is cyan text\x1b[0m`); // Resets afterward
 */
export function getAnsiColorFromPalette(index, count, saturation = 70, lightness = 50) {
    if (index < 0 || index >= count) {
        throw new Error(`Invalid index ${index}. Must be between 0 and ${count - 1}.`);
    }
    const step = 360 / count; // Divide the hue range evenly
    const hue = Math.round(index * step); // Calculate the hue for the given index

    // Convert HSL to RGB
    function hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const k = (n) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n) =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [
            Math.round(f(0) * 255),
            Math.round(f(8) * 255),
            Math.round(f(4) * 255),
        ];
    }

    const [r, g, b] = hslToRgb(hue, saturation, lightness); // Convert HSL to RGB

    // Return the ANSI escape code for the RGB color
    return `\x1b[38;2;${r};${g};${b}m`;
}
