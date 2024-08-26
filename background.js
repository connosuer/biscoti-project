console.log('Biscoti.io background script initialized');

const defaultPreferences = {
  acceptAll: false,
  functionalCookies: true,
  analyticsCookies: false,
  advertisingCookies: false
};

function debugLog(message) {
  console.log(`[Biscoti.io Background]: ${message}`);
}

function errorLog(error) {
  console.error(`[Biscoti.io Error]: ${error.message}`, error);
}

function showNotification(message) {
  console.log(`Attempting to show notification: ${message}`);
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon48.png',
    title: 'Biscoti.io',
    message: message
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('Notification error:', JSON.stringify(chrome.runtime.lastError));
    } else {
      console.log(`Notification created with ID: ${notificationId}`);
    }
  });
}

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url && tab.url.match(/^https:\/\/(www\.)?(theguardian|bbc|reuters)\.com/)) {
    debugLog(`Injecting content script into tab ${tabId}`);
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).then(() => {
      debugLog('Content script injected successfully');
      chrome.tabs.sendMessage(tabId, {action: 'contentScriptCheck'}, (response) => {
        if (chrome.runtime.lastError) {
          errorLog(chrome.runtime.lastError);
        } else {
          debugLog(`Response from content script: ${JSON.stringify(response)}`);
        }
      });
    }).catch(err => {
      errorLog(err);
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`Received message:`, request);
  
  if (request.action === 'getUserPreferences') {
    chrome.storage.sync.get('preferences', (data) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting preferences:', JSON.stringify(chrome.runtime.lastError));
        sendResponse({ error: 'Failed to get preferences' });
      } else {
        console.log('Sending user preferences');
        sendResponse(data.preferences || defaultPreferences);
      }
    });
    return true; // Indicates we wish to send a response asynchronously
  } else if (request.action === 'showNotification') {
    console.log('Received showNotification message');
    showNotification(request.message);
    sendResponse({status: 'Notification shown'});
  }
});