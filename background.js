// Default preferences
const defaultPreferences = {
    acceptAll: false,
    functionalCookies: true,
    analyticsCookies: false,
    advertisingCookies: false
  };
  
  // Initialize preferences
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ preferences: defaultPreferences });
  });
  
  // Listen for messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getUserPreferences') {
      chrome.storage.sync.get('preferences', (data) => {
        sendResponse(data.preferences || defaultPreferences);
      });
      return true; // Indicates we wish to send a response asynchronously
    } else if (request.action === 'setUserPreferences') {
      chrome.storage.sync.set({ preferences: request.preferences }, () => {
        sendResponse({ status: 'success' });
        // Notify all tabs about the preference change
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { action: 'preferencesUpdated' });
          });
        });
      });
      return true;
    }
  });
  
  // Listen for navigation events to inject content script
  chrome.webNavigation.onCompleted.addListener((details) => {
    chrome.tabs.sendMessage(details.tabId, { action: 'checkForConsentForm' });
  });