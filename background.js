console.log('Biscoti.io background script initialized');

// Rest of the background.js code remains the same
// Default preferences
const defaultPreferences = {
  acceptAll: false,
  functionalCookies: true,
  analyticsCookies: false,
  advertisingCookies: false
};

// Debugging function
function debugLog(message) {
  console.log(`[Biscoti.io Background]: ${message}`);
}

// Error logging function
function errorLog(error) {
  console.error(`[Biscoti.io Error]: ${error.message}`, error);
}

// Initialize preferences
chrome.runtime.onInstalled.addListener(() => {
  debugLog('Extension installed. Initializing preferences.');
  chrome.storage.sync.set({ preferences: defaultPreferences }, () => {
    if (chrome.runtime.lastError) {
      errorLog(chrome.runtime.lastError);
    } else {
      debugLog('Preferences initialized successfully.');
    }
  });
});

// ... rest of the code remains the same
  
  // Listen for messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    debugLog(`Received message: ${request.action}`);
    
    if (request.action === 'getUserPreferences') {
      chrome.storage.sync.get('preferences', (data) => {
        if (chrome.runtime.lastError) {
          errorLog(chrome.runtime.lastError);
          sendResponse({ error: 'Failed to get preferences' });
        } else {
          debugLog('Sending user preferences');
          sendResponse(data.preferences || defaultPreferences);
        }
      });
      return true; // Indicates we wish to send a response asynchronously
    } else if (request.action === 'setUserPreferences') {
      chrome.storage.sync.set({ preferences: request.preferences }, () => {
        if (chrome.runtime.lastError) {
          errorLog(chrome.runtime.lastError);
          sendResponse({ status: 'error', message: 'Failed to set preferences' });
        } else {
          debugLog('Preferences updated successfully');
          sendResponse({ status: 'success' });
          // Notify all tabs about the preference change
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, { action: 'preferencesUpdated' })
                .catch(error => {
                  if (error.message !== "Could not establish connection. Receiving end does not exist.") {
                    errorLog(error);
                  }
                });
            });
          });
        }
      });
      return true;
    }
  });
  
  // Listen for navigation events to inject content script
  chrome.webNavigation.onCompleted.addListener((details) => {
    debugLog(`Navigation completed: ${details.url}`);
    chrome.tabs.sendMessage(details.tabId, { action: 'checkForConsentForm' })
      .catch(error => {
        // This error is expected if the content script is not yet loaded
        if (error.message !== "Could not establish connection. Receiving end does not exist.") {
          errorLog(error);
        }
      });
  });