console.log('Biscoti.io content script loaded - IMMEDIATE LOG');

function debugLog(message) {
  console.log(`%c[Biscoti.io Content]: ${message}`, 'background: #f0f0f0; color: #333; padding: 2px 4px; border-radius: 2px;');
}

debugLog('Content script started execution');

function detectConsentForm() {
  debugLog('Searching for consent form...');
  const keywords = ['cookie', 'consent', 'gdpr', 'ccpa', 'privacy'];
  const selectors = [
    'div[class*="cookie"]',
    'div[class*="consent"]',
    'div[id*="cookie"]',
    'div[id*="consent"]',
    'div[class*="gdpr"]',
    'div[class*="ccpa"]'
  ];

  const pageContent = document.body.innerText.toLowerCase();
  const hasKeywords = keywords.some(keyword => pageContent.includes(keyword));
  debugLog(`Keywords found: ${hasKeywords}`);

  const consentElement = selectors.find(selector => document.querySelector(selector));
  debugLog(`Consent element found: ${consentElement ? 'Yes' : 'No'}`);

  return hasKeywords && consentElement;
}

function showPageNotification(message) {
  debugLog(`Showing page notification: ${message}`);
  const notificationElement = document.createElement('div');
  notificationElement.textContent = message;
  notificationElement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    z-index: 9999;
    font-family: Arial, sans-serif;
  `;
  document.body.appendChild(notificationElement);
  debugLog('Page notification element added to DOM');
  setTimeout(() => {
    notificationElement.remove();
    debugLog('Page notification element removed from DOM');
  }, 5000);
}

function sendNotification(message) {
  debugLog(`Sending notification: ${message}`);
  chrome.runtime.sendMessage({action: 'showNotification', message: message}, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error sending notification message:', JSON.stringify(chrome.runtime.lastError));
      showPageNotification(message); // Fallback to on-page notification
    } else {
      debugLog('Notification message sent successfully');
    }
  });
  showPageNotification(message); // Always show on-page notification
}

async function handleConsent(preferences) {
  debugLog('Handling consent...');
  if (preferences.acceptAll) {
    debugLog('Accepting all cookies');
    sendNotification('All cookies accepted');
  } else {
    debugLog('Customizing cookie preferences');
    sendNotification('Cookie preferences applied');
  }
}

async function main() {
  debugLog('Main function started');
  const isConsentForm = detectConsentForm();
  if (isConsentForm) {
    debugLog('Consent form detected');
    sendNotification('Cookie consent form detected');
    try {
      const preferences = await chrome.runtime.sendMessage({action: 'getUserPreferences'});
      debugLog(`User preferences received: ${JSON.stringify(preferences)}`);
      await handleConsent(preferences);
    } catch (error) {
      debugLog(`Error getting user preferences: ${error.message}`);
    }
  } else {
    debugLog('No consent form detected');
    sendNotification('No cookie consent form detected');
  }
  debugLog('Main function completed');
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugLog(`Received message: ${JSON.stringify(message)}`);
  if (message.action === 'contentScriptCheck') {
    debugLog('Received contentScriptCheck message');
    sendResponse({status: 'Content script is running'});
  }
});

debugLog('Setting up load event listener');
window.addEventListener('load', () => {
  debugLog('Window load event fired');
  main();
});

debugLog('Content script execution completed');