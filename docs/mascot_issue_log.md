# Investigation Log: Failure to Render `mascot.png`

**To:** Senior Frontend Engineer
**From:** AI Frontend Engineer
**Date:** 2024-07-26

## 1. Summary

This document outlines the investigation into a persistent issue where the `mascot.png` image asset fails to render when referenced via an `<img>` tag. Multiple pathing and import strategies have been attempted without success. The current workaround involves using an inline SVG, which is not a scalable solution for managing our application's image assets.

This log has been created to request guidance on the intended asset handling pipeline for this project.

## 2. Environment & Technical Stack

The application is built with the following technologies, as inferred from the project structure and configuration files:

- **Framework:** React `19.2.0`
- **Styling:** Tailwind CSS (loaded via CDN)
- **Module System:** Native ES Modules (`<script type="module">`, `importmap` in `index.html`)
- **Dependencies (via CDN):**
  - `@google/genai`: `^1.27.0`
  - `d3`: `^7.9.0`
  - `react`, `react-dom`: `^19.2.0`
- **Development Server:** The environment appears to use a modern, minimal-configuration development server (e.g., Vite, esbuild) that handles TypeScript/JSX transformation on the fly. The specific configuration for serving static assets from directories like `/assets` is not apparent.

## 3. Attempts and Results

### Attempt 1: Module Import

- **Code:** `import mascotIcon from '/assets/images/mascot.png'; <img src={mascotIcon} />`
- **Result:** This approach failed, leading to a module resolution error in the browser.
- **Error:** `Uncaught TypeError: Failed to resolve module specifier "/assets/images/mascot.png". Relative references must start with either "/", "./", or "../".`
- **Analysis:** This error indicates that the development server and/or the browser's module resolver is not configured to handle image files as importable modules. This typically requires a bundler like Webpack or Vite with specific loaders/plugins (e.g., `file-loader`, `url-loader`).

### Attempt 2: Absolute Public Path

- **Code:** `<img src="/assets/images/mascot.png" />`
- **Result:** The image failed to load, displaying a broken image icon. No console errors were reported.
- **Analysis:** This suggests that the development server is not configured to serve the `assets` directory from the web root (`/`). The file is not accessible at that public URL.

### Attempt 3: Relative Public Path from Root

- **Code:** `<img src="assets/images/mascot.png" />` or `<img src="./assets/images/mascot.png" />`
- **Result:** Identical to the absolute path attempt—a broken image icon.
- **Analysis:** This confirms that the issue is likely with the server's static file configuration, as it cannot resolve the path relative to the `index.html` file either.

## 4. Current Workaround

To ensure the mascot is visible, the `Mascot.tsx` component was updated to render an inline SVG of the mascot directly in the JSX.

- **Pros:** Guarantees the image will always render without external dependencies or pathing issues.
- **Cons:** This is not a sustainable solution. It tightly couples the image data to the component, makes updating the asset difficult for designers, and is not feasible for managing a larger library of images.

## 5. Request for Guidance

The core issue appears to be a mismatch between the application's code and the development environment's configuration for handling static assets.

Could you please provide clarification on the following:

1.  What is the correct way to reference static image files (like `.png` or `.jpg`) within React components in this project?
2.  Is there a specific public directory from which the server is configured to serve assets?
3.  Are there any plans to integrate a more powerful bundler (like Vite) that would handle these asset imports automatically?

Any advice on the standard operating procedure for assets would be greatly appreciated to resolve this issue correctly and establish a scalable pattern for future development.