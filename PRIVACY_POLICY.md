# Privacy Policy for Mark as Read Extension

**Last Updated: November 1, 2025**

This Privacy Policy describes how the "Mark as Read" Chrome Extension (the "Extension") handles your data. Your privacy is important to us, and this policy is intended to be as simple and transparent as possible.

The core principle of this Extension is that **your data is your own**. All data collected is stored locally on your computer using the browser's built-in storage and is never transmitted to our servers or any third parties.

## 1. Data We Collect and Why

To provide its features, the Extension needs to store some information. This data includes:

- **Marked URLs**: The web addresses (URLs), page titles, and domains of the pages you explicitly choose to mark as "read". This is the core data required for the Extension to remember which pages you have visited.
- **Timestamps**: The date and time when you mark a page. This is used for sorting and displaying your history.
- **User Settings**: Any custom query parameters you configure in the settings page to be ignored. This allows the Extension to tailor its URL matching behavior to your needs.

This data is collected only when you interact with the Extension's features, such as clicking the "Mark as Read" button or changing settings.

## 2. How Your Data is Stored

All the data listed above is stored **locally** on your device using the standard `chrome.storage` API provided by your web browser.

- **No External Transmission**: Your data is **never** sent over the internet to us or any third-party service.
- **Data Control**: Your data remains within your browser's sandboxed storage, and you have full control over it. Clearing your browser's local storage for this extension will permanently delete all your marked URLs and settings.

## 3. Data Sharing

We **do not share** any of your personal information or browsing data with any third parties. Since the data never leaves your computer, it is impossible for us to access, view, or share it.

## 4. Permissions We Request

The Extension requests certain permissions in your browser to function correctly. Here is a list of the permissions and why we need them:

- **`storage`**: This permission is essential for storing your list of marked URLs and settings locally on your device.
- **`tabs` / `activeTab`**: This permission is required to get the URL and title of the current page when you click the extension's popup icon, so that you can mark it as read.
- **`host_permissions` (`"http://*/*"`, `"https://*/*"`)**: This permission allows the content script to run on the pages you visit. Its sole purpose is to check if the page's URL is in your marked list and, if so, display the "✅ Read" visual badge. The Extension does not track your browsing history or collect any data in the background.

## 5. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Any changes will be reflected in a new version of the Extension and an updated "Last Updated" date on this policy. We encourage you to review this Privacy Policy periodically.

## 6. Contact Us

If you have any questions or concerns about this Privacy Policy, please feel free to contact us.

- **Author**: Alen Hu
- **Email**: huhaoyue0220@126.com
