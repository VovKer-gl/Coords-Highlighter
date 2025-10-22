# Coordinate Highlighter

A Chrome browser extension that highlights events with duplicate coordinates in Sportlogiq's EventorApp.

## Overview

The Coordinate Highlighter extension helps identify events that share the same coordinates by adding visual indicators (flag icons) to rows in the event list. This is particularly useful for data analysis and quality control when working with sports event data.

## Features

- **Duplicate Detection**: Automatically identifies events with identical x and y coordinates
- **Visual Indicators**: Adds green flag icons to highlight duplicate coordinate events
- **Toggle Control**: Easy on/off switch via the extension popup
- **Real-time Updates**: Monitors the event list for changes and updates highlights accordingly
- **Non-intrusive**: Works seamlessly with the existing EventorApp interface

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the project folder
5. The extension should now appear in your extensions list

## Usage

1. Navigate to `https://app.sportlogiq.com/EventorApp.php`
2. Click the Coordinate Highlighter extension icon in your browser toolbar
3. Toggle the "Highlight Duplicates" switch to enable/disable the feature
4. Events with duplicate coordinates will be marked with green flag icons in the first column

## How It Works

The extension consists of several components:

- **Content Script** (`content.js`): Injects the main functionality into the EventorApp page
- **Injected Script** (`injected.js`): Contains the core highlighting logic and DOM manipulation
- **Popup Interface** (`popup.html/js/css`): Provides the user interface for toggling the feature
- **Manifest** (`manifest.json`): Defines the extension's permissions and configuration

### Technical Details

- Monitors the `#game-events tbody` table for changes using MutationObserver
- Analyzes the `window.eventListControl.eventList` data to identify coordinate duplicates
- Adds a new column to each table row for the highlight indicators
- Uses Chrome's storage API to persist user preferences
- Communicates between popup and content scripts via Chrome messaging API

## File Structure

```
coordshighlight/
├── manifest.json          # Extension configuration
├── content.js             # Content script for page injection
├── injected.js            # Main highlighting logic
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── popup.css              # Popup styling
└── README.md              # This file
```

## Permissions

The extension requires the following permissions:
- `storage`: To save user preferences
- `activeTab`: To interact with the current tab
- `scripting`: To inject scripts into the page
- `host_permissions`: Access to `https://app.sportlogiq.com/*`

## Browser Compatibility

- Chrome (Manifest V3)
- Other Chromium-based browsers (Edge, Brave, etc.)

## Development

To modify or extend the extension:

1. Make your changes to the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Coordinate Highlighter extension
4. Test your changes on the EventorApp page

## Version

Current version: 1.0

## License

This project is open source. Please check the license terms before use.
