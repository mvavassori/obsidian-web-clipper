# Obsidian Web Clipper

## Description

Obsidian Web Clipper is a simple Chrome extension for users of [Obsidian](https://obsidian.md/), a popular note-taking application. With this extension, you can quickly capture notes directly from your web browser and save them to your Obsidian vaults.

## Features

- **Efficient Note-Taking:** Click the extension icon to open a popup where you can jot down notes related to the current webpage.
- **Customizable Titles:** The title of the note defaults to the webpage title, but can be easily edited.
- **Page Link Tracking:** The link to the current webpage is automatically added at the top of the note content for reference. You can choose to remove this link if you prefer.
- **Direct Obsidian Integration:** Define the Obsidian vault where your clippings will be saved. Specify the folder structure using `Folder Name/{title}` format, or simply use `{title}` to save the note with the title used in the extension popup.

- **Character Limits:** A maximum character limit of 50 characters for the note title and 1500 characters for the note content is enforced to ensure smooth handling with Obsidian URI.

## Installation

Download the extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/obsidian-web-clipper/akiokmdijehkppdjnfdhdgcoeehpbfgd), the [Microsoft Edge Add-ons store](https://microsoftedge.microsoft.com/addons/detail/jgjacbgaegejdeiodlknbamdpmocmecg) or the [Firefox Add-ons store](https://addons.mozilla.org/it/firefox/addon/obsidian-web-clipper-add-on/)

Once installed, right-click the extension icon in the toolbar and select **Options** to specify your Obsidian vault name and desired note-saving format.

## For Developers

This extension is built with React (version 18.2.0) and uses Webpack for bundling. Other notable dependencies include react-textarea-autosize for the note-taking textarea, and tailwindcss for styling.

### Getting Started

To get a local copy up and running follow these simple steps:

1. Clone the repository: `git clone https://github.com/mvavassori/obsidian-web-clipper.git`

2. Navigate to the project directory: `cd obsidian-web-clipper`

3. Install dependencies: `npm install`

### Available Scripts

In the project directory, you can run the following scripts:

- `npm run dev`: Runs the webpack in the development mode. The bundle will be automatically rebuilt upon file changes.

- `npm run build`: Runs the webpack in the production mode, creating a bundled output ready for distribution.

Please note that you will need to have Node.js and npm installed on your machine to run these commands.

## Roadmap

Here are some features and improvements that are planned for future updates of Obsidian Web Clipper:

- [x] **Support for Firefox:** Extend the availability of the extension to Firefox users, allowing them to benefit from the same note-taking capabilities within their preferred browser.

- [ ] **Markdown Preview in Popup:** Enable a markdown preview feature directly within the extension popup, allowing users to preview the rendered markdown of their notes before saving them to their Obsidian vaults.

Please note that the roadmap is subject to change and these features are not yet implemented. However, they represent the direction and potential enhancements for future versions of Obsidian Web Clipper.

## Support

If you find it helpful and wish to support its development, consider making a [donation through PayPal](https://www.paypal.com/donate/?hosted_button_id=M8RTMTXKV46EC).
