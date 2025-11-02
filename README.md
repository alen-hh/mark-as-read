This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Mark as Read Chrome Extension

Track and mark pages as "read" in Chrome. Instantly see which URLs you've visited, and manage your reading history easily.

## Features

- **One-Click Marking**: Mark the current page as read or unread directly from the extension popup.
- **Keyboard Shortcuts**: Quickly toggle the mark status using a customizable keyboard shortcut.
- **Visual Indicators**: 
  - A subtle "✅ Read" badge displayed on marked pages in the top-right corner.
  - Temporary notification showing "Marked!" or "Unmarked!" when you toggle the status.
- **History Page**: A dedicated page to view, search, and manage all your marked URLs in a clean, table format.
- **Settings Page**: Customize the extension's behavior by specifying URL query parameters to ignore.
- **Smart URL Matching**: 
  - Automatically ignores URL fragments (`#`).
  - Filters out common tracking parameters by default (e.g., `utm_source`).
  - Allows you to add your own custom query parameters to ignore (e.g., `ref`, `fbclid`).
- **Persistent Storage**: All data is stored locally and securely using Chrome's storage API.
- **Modern UI**: A clean and responsive interface built with React and Tailwind CSS.

## How It Works

The extension uses a combination of a popup, content script, background service worker, and option pages to deliver its functionality:

1.  **Popup (`popup.tsx`)**: When you click the extension icon, the popup appears. It displays the current tab's URL and title, and checks against stored data to see if the page is already marked. You can toggle the "read" status with a button click. The popup also provides a button to configure keyboard shortcuts.
2.  **Content Script (`content.ts`)**: This script runs on all pages (`<all_urls>`). It checks if the current page's URL is in your list of marked URLs. If it is, it injects a small "✅ Read" badge into the top-right corner of the page. It also listens for changes in storage and keyboard shortcut commands, displaying notifications when you mark/unmark pages. The badge appears or disappears in real-time if you mark/unmark a page.
3.  **Background Service Worker (`background.ts`)**: This listens for keyboard shortcut commands and communicates with the content script to execute the toggle action. It works seamlessly even when the popup isn't open.
4.  **Storage (`utils/storage.ts`)**: All marked URLs and settings are stored in Chrome's local storage. Before checking a URL, it is "normalized" by removing the URL fragment (`#...`) and any ignored query parameters. This means `example.com?utm_source=google` and `example.com` are treated as the same page.
5.  **Pages (`tabs/`)**: The "History" and "Settings" pages are built as separate HTML pages within the extension, allowing for a richer user experience.

## Tech Stack

- **Framework**: [Plasmo](https://docs.plasmo.com/)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript
- **Storage**: Plasmo Storage API (`@plasmohq/storage`)

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-recompile and reload the extension on changes.

## Usage

1.  **Mark a URL**: Click the extension icon on any page and press the "Mark as Read" button.
2.  **Unmark a URL**: On a marked page, click the extension icon and press "Mark as Unread".
3.  **Quick Toggle with Keyboard**: Use shortcut to instantly toggle the current page's status without opening the popup.
4.  **Configure Keyboard Shortcut**: Click the "⌨️ Shortcut" button in the popup to customize your keyboard shortcut. You'll be taken to `chrome://extensions/shortcuts` where you can set any key combination you prefer.
5.  **View History**: Right-click the extension icon and select "Options", or navigate from the popup, to see all marked URLs.
6.  **Configure Settings**: Navigate to the Settings page to add or remove query parameters that should be ignored when matching URLs.
7.  **Visual Feedback**: 
   - Marked pages display a green "✅ Read" badge in the top-right corner.
   - When you toggle the mark status, a temporary notification appears showing "Marked!" or "Unmarked!".

### Smart URL Matching

The extension intelligently matches URLs by:
- **Ignoring fragments**: `example.com/#section1` and `example.com/#section2` are treated as the same URL.
- **Ignoring configured query params**: If `utm_source` is on the ignore list, then `example.com/?utm_source=google` and `example.com/` are treated as the same URL.

**Default Ignored Parameters:**
The extension comes pre-configured with a set of common tracking parameters that cannot be removed:
- `utm_source`, `utm_medium`, `utm_campaign`
- `utm_term`, `utm_content`, `utm_id`
- `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`

You can add your own custom parameters (like `ref`, `fbclid`, etc.) in the Settings page.

## Data Structure

Marked URLs are stored with the following structure:

```json
{
  "url": "https://www.example.com/some/path",
  "title": "An Example Page Title",
  "domain": "www.example.com",
  "marked_at": "1672531200000"
}
```

## Project Structure

- **`popup.tsx`**: The main popup interface with mark/unread button and shortcut configuration.
- **`background.ts`**: The background service worker for handling keyboard shortcut commands.
- **`content.ts`**: The content script responsible for injecting the "Read" badge and handling notifications on pages.
- **`tabs/`**: Directory for standalone extension pages.
  - **`marked-urls.tsx`**: The "History" page for viewing and managing all marked URLs.
  - **`settings.tsx`**: The "Settings" page for configuring ignored query parameters.
- **`components/`**: Shared React components.
  - **`Layout.tsx`**: A shared layout component for the `tabs` pages, providing consistent navigation and header.
- **`utils/`**: Utility functions.
  - **`storage.ts`**: Handles all interactions with Chrome's storage, including getting/setting marked URLs and settings, and URL normalization logic.
- **`types.ts`**: TypeScript type definitions for `MarkedUrl`, `Settings`, etc.
- **`style.css`**: Global styles and Tailwind CSS imports.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making a Production Build

Run the following:

```bash
pnpm build
# or
npm run build
```

This will create a production-ready bundle in the `build` directory, which can be zipped and published to the web stores.

## Submitting to Web Stores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
