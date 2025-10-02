# Browserbase MCP Contracts

This directory contains JSON Schema contracts for browser automation operations.

## Operations

### browserbase.navigate (v1)
**Purpose:** Navigate to a URL and wait for page load.

#### Request
Validates against: `contracts/browserbase/navigate.request.json`

- `url` (string uri, required) - URL to navigate to
- `waitUntil` (enum, default: "load") - Navigation completion criteria:
  - `load` - Wait for load event
  - `domcontentloaded` - Wait for DOM content loaded
  - `networkidle0` - Wait until no network connections
  - `networkidle2` - Wait until ≤2 network connections
- `timeout` (integer, default: 30000) - Navigation timeout in ms (1000-300000)
- `viewport` (object, optional) - Browser viewport:
  - `width` (integer, default: 1920) - Width in pixels (320-3840)
  - `height` (integer, default: 1080) - Height in pixels (240-2160)

#### Response
Validates against: `contracts/browserbase/navigate.response.json`

- `success` (boolean) - Whether navigation completed successfully
- `url` (string uri) - Final URL (may differ due to redirects)
- `title` (string, optional) - Page title
- `statusCode` (integer, optional) - HTTP status code (100-599)
- `loadTime` (number, optional) - Page load time in ms

#### Errors
Uses `error.envelope.json` with codes:
- `INVALID_INPUT` - Invalid URL or parameters
- `AUTH_REQUIRED` - Missing or invalid API key
- `NOT_FOUND` - Page not found (404)
- `RATE_LIMIT` - Rate limit exceeded
- `UPSTREAM_ERROR` - Browser service error
- `UNAVAILABLE` - Service temporarily unavailable
- `INTERNAL_ERROR` - Unexpected internal error

---

### browserbase.screenshot (v1)
**Purpose:** Capture screenshot of page or element.

#### Request
Validates against: `contracts/browserbase/screenshot.request.json`

- `fullPage` (boolean, default: false) - Capture full scrollable page
- `selector` (string, optional) - CSS selector for element to screenshot
- `format` (enum, default: "png") - Image format: png, jpeg, webp
- `quality` (integer, default: 80) - Image quality 0-100 (jpeg/webp only)
- `omitBackground` (boolean, default: false) - Transparent background

#### Response
Validates against: `contracts/browserbase/screenshot.response.json`

- `data` (string base64) - Base64-encoded screenshot data
- `format` (enum) - Image format: png, jpeg, webp
- `width` (integer, optional) - Image width in pixels
- `height` (integer, optional) - Image height in pixels
- `size` (integer, optional) - Image size in bytes

#### Errors
Uses `error.envelope.json` with codes:
- `INVALID_INPUT` - Invalid selector or parameters
- `AUTH_REQUIRED` - Missing or invalid API key
- `NOT_FOUND` - Element not found
- `RATE_LIMIT` - Rate limit exceeded
- `UPSTREAM_ERROR` - Browser service error
- `UNAVAILABLE` - Service temporarily unavailable
- `INTERNAL_ERROR` - Unexpected internal error

## Example Usage

```javascript
import { validateBrowserbaseNavigate, validateBrowserbaseScreenshot } from '../validators/browserbase';

// Navigate example
const navRequest = {
  url: "https://example.com",
  waitUntil: "networkidle0",
  timeout: 60000,
  viewport: { width: 1920, height: 1080 }
};

await validateBrowserbaseNavigate(navRequest);

// Screenshot example
const screenshotRequest = {
  fullPage: true,
  format: "jpeg",
  quality: 90
};

await validateBrowserbaseScreenshot(screenshotRequest);
```

## Best Practices

1. Choose appropriate `waitUntil` based on page characteristics
2. Use `networkidle0` for SPAs that load data after initial render
3. Set reasonable timeouts for slow-loading pages
4. Use `selector` for element screenshots to reduce data transfer
5. Optimize quality/format trade-offs for performance

## Version History

- **v1.0.0** (2024-10) - Initial contract definitions
