# Biscoti.io Project Overview

Biscoti.io is an ambitious browser extension project aimed at simplifying the management of cookie consents across various websites. This document provides an overview of the project's goals, architecture, and current status.

## Project Goals

1. Automate the process of handling cookie consent forms on websites.
2. Provide users with granular control over their cookie preferences.
3. Ensure consistent privacy settings across different websites.
4. Improve overall browsing experience by reducing interruptions from consent popups.

## Architecture

Biscoti.io is built as a Chrome extension using Manifest V3. It consists of the following main components:

1. **Background Script (background.js)**: Manages the extension's lifecycle, handles message passing, and coordinates actions between different parts of the extension.

2. **Content Script (content.js)**: Injects into web pages to detect and interact with cookie consent forms. It also handles on-page notifications.

3. **Popup (popup.html, popup.js)**: Provides a user interface for setting cookie preferences.

4. **Manifest (manifest.json)**: Defines the extension's permissions and structure.

## Current Status

As of now, Biscoti.io is in the early stages of development. The following features are being worked on:

- Basic detection of cookie consent forms
- User preference setting through the popup interface
- On-page notifications for consent actions
- Browser notifications (currently facing some issues)

## Planned Features

- Machine learning-based consent form detection
- Adaptive learning to improve detection over time
- Support for a wider range of websites
- Detailed dashboard for consent history
- Performance optimizations

## Known Issues

- Browser notifications may not appear consistently
- Consent form detection may not work on all websites
- Limited to a few specific websites for testing purposes

## Next Steps

1. Improve the reliability of consent form detection
2. Enhance the user interface for a more intuitive experience
3. Implement more robust error handling and logging
4. Expand the range of supported websites
5. Conduct thorough testing and gather user feedback

I appreciate your interest in Biscoti.io and welcome any feedback or contributions as we continue to develop this extension.
