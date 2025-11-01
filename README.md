This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Mark as Read Chrome Extension

A simple Chrome extension that helps you track which URLs you've already read. Mark pages as read, see visual indicators on marked pages, and manage your reading history. Built with Plasmo framework and styled with Tailwind CSS.

## Features

- **Popup Interface**: Mark the current page as read/unread with a single click
- **Visual Indicator**: Marked pages display a subtle "✅ Read" badge in the top-right corner
- **History Page**: View and manage all marked URLs in a convenient table format
- **Persistent Storage**: All data is stored locally using Chrome's storage API
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Smart URL Matching**: 
  - Automatically ignores URL fragments (#)
  - Configurable query parameter filtering (e.g., utm_source, ref)

## Tech Stack

- **Framework**: [Plasmo](https://docs.plasmo.com/)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript
- **Storage**: Plasmo Storage API

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

## Usage

1. **Mark a URL**: Click the extension icon and press "Mark as Read" button
2. **Unmark a URL**: Click the extension icon on a marked page and press "Mark as Unread"
3. **View History**: Right-click the extension icon and select "Options" to see all marked URLs
4. **Configure Settings**: Navigate to the Settings page to:
   - Add query parameters to ignore (e.g., utm_source, ref, fbclid)
   - Customize URL matching behavior
5. **Visual Indicator**: Marked pages automatically show a green "✅ Read" badge

### Smart URL Matching

The extension intelligently matches URLs by:
- **Ignoring fragments**: `example.com#section1` and `example.com#section2` are treated as the same URL
- **Ignoring configured query params**: If you add `utm_source` to the ignore list, then `example.com?utm_source=google` and `example.com` are treated as the same URL

**Default Ignored Parameters:**
The extension comes pre-configured with **9 system default UTM tracking parameters** that cannot be removed:
- `utm_source`, `utm_medium`, `utm_campaign`
- `utm_term`, `utm_content`, `utm_id`
- `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`

These parameters are always ignored and displayed separately in the Settings page. You can add your own custom parameters (like `ref`, `fbclid`, etc.) which can be removed at any time.

## Data Structure

Marked URLs are stored with the following structure:

```json
{
  "url": "https://www.example.com/abc.html",
  "title": "An Example Page",
  "domain": "example.com",
  "marked_at": "1761978965"
}
```

## Project Structure

- `popup.tsx` - Extension popup interface
- `content.ts` - Content script for visual indicators
- `tabs/marked-urls.tsx` - History page for managing marked URLs
- `tabs/settings.tsx` - Settings page for extension configuration
- `components/Layout.tsx` - Shared layout component for tab pages
- `utils/storage.ts` - Storage utility functions
- `types.ts` - TypeScript type definitions

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
