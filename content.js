// Debugging function
function debugLog(message) {
    console.log(`%c[Biscoti.io Debug]: ${message}`, 'background: #f0f0f0; color: #333; padding: 2px 4px; border-radius: 2px;');
  }
  
  // Function to detect consent forms using common patterns
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
  
    // Check for keywords in the page content
    const pageContent = document.body.innerText.toLowerCase();
    const hasKeywords = keywords.some(keyword => pageContent.includes(keyword));
    debugLog(`Keywords found: ${hasKeywords}`);
  
    // Check for common consent form selectors
    const consentElement = selectors.find(selector => document.querySelector(selector));
    debugLog(`Consent element found: ${consentElement ? 'Yes' : 'No'}`);
  
    return hasKeywords && consentElement;
  }
  
  // Function to handle consent based on user preferences
  async function handleConsent(preferences) {
    debugLog('Handling consent...');
    const buttons = document.querySelectorAll('button');
    for (let button of buttons) {
      if (button.innerText.toLowerCase().includes('accept') && preferences.acceptAll) {
        debugLog('Clicking "Accept" button');
        button.click();
        return;
      }
      if (button.innerText.toLowerCase().includes('customize') && !preferences.acceptAll) {
        debugLog('Clicking "Customize" button');
        button.click();
        await customizeConsent(preferences);
        return;
      }
    }
    debugLog('No suitable buttons found');
  }
  
  // Function to customize consent options
  async function customizeConsent(preferences) {
    debugLog('Customizing consent options...');
    // Wait for the customization dialog to appear
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let checkbox of checkboxes) {
      const label = checkbox.closest('label');
      if (label) {
        if (label.innerText.toLowerCase().includes('necessary')) {
          checkbox.checked = true;
          debugLog('Set necessary cookies: true');
        } else if (label.innerText.toLowerCase().includes('functional')) {
          checkbox.checked = preferences.functionalCookies;
          debugLog(`Set functional cookies: ${preferences.functionalCookies}`);
        } else if (label.innerText.toLowerCase().includes('analytics')) {
          checkbox.checked = preferences.analyticsCookies;
          debugLog(`Set analytics cookies: ${preferences.analyticsCookies}`);
        } else if (label.innerText.toLowerCase().includes('advertising')) {
          checkbox.checked = preferences.advertisingCookies;
          debugLog(`Set advertising cookies: ${preferences.advertisingCookies}`);
        }
      }
    }
    
    // Find and click the save button
    const saveButton = Array.from(document.querySelectorAll('button')).find(
      button => button.innerText.toLowerCase().includes('save') || button.innerText.toLowerCase().includes('confirm')
    );
    if (saveButton) {
      debugLog('Clicking save button');
      saveButton.click();
    } else {
      debugLog('Save button not found');
    }
  }
  
  // Function to add visual indicator
  function addVisualIndicator(message) {
    const indicator = document.createElement('div');
    indicator.textContent = `Biscoti.io: ${message}`;
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      border-radius: 5px;
      z-index: 9999;
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;
    document.body.appendChild(indicator);
    setTimeout(() => indicator.remove(), 5000);
  }
  
  // Main function
  async function main() {
    debugLog('Biscoti.io script started');
    const isConsentForm = detectConsentForm();
    if (isConsentForm) {
      debugLog('Consent form detected');
      addVisualIndicator('Consent form detected');
      const preferences = await chrome.runtime.sendMessage({action: 'getUserPreferences'});
      debugLog('User preferences received');
      await handleConsent(preferences);
      addVisualIndicator('Consent handled');
    } else {
      debugLog('No consent form detected');
      addVisualIndicator('No consent form detected');
    }
  }
  
  // Run the main function when the page is loaded
  window.addEventListener('load', () => {
    debugLog('Page loaded, running main function');
    main();
  });
  
  // Listen for preference changes
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'preferencesUpdated') {
      debugLog('Preferences updated, running main function again');
      main();
    }
  });