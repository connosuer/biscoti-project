// Function to detect consent forms using common patterns
function detectConsentForm() {
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
  
    // Check for common consent form selectors
    const hasConsentElement = selectors.some(selector => document.querySelector(selector));
  
    return hasKeywords && hasConsentElement;
  }
  
  // Function to handle consent based on user preferences
  async function handleConsent(preferences) {
    const buttons = document.querySelectorAll('button');
    for (let button of buttons) {
      if (button.innerText.toLowerCase().includes('accept') && preferences.acceptAll) {
        button.click();
        return;
      }
      if (button.innerText.toLowerCase().includes('customize') && !preferences.acceptAll) {
        button.click();
        await customizeConsent(preferences);
        return;
      }
    }
  }
  
  // Function to customize consent options
  async function customizeConsent(preferences) {
    // Wait for the customization dialog to appear
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let checkbox of checkboxes) {
      const label = checkbox.closest('label');
      if (label) {
        if (label.innerText.toLowerCase().includes('necessary')) {
          checkbox.checked = true;
        } else if (label.innerText.toLowerCase().includes('functional')) {
          checkbox.checked = preferences.functionalCookies;
        } else if (label.innerText.toLowerCase().includes('analytics')) {
          checkbox.checked = preferences.analyticsCookies;
        } else if (label.innerText.toLowerCase().includes('advertising')) {
          checkbox.checked = preferences.advertisingCookies;
        }
      }
    }
    
    // Find and click the save button
    const saveButton = Array.from(document.querySelectorAll('button')).find(
      button => button.innerText.toLowerCase().includes('save') || button.innerText.toLowerCase().includes('confirm')
    );
    if (saveButton) saveButton.click();
  }
  
  // Main function
  async function main() {
    const isConsentForm = detectConsentForm();
    if (isConsentForm) {
      const preferences = await chrome.runtime.sendMessage({action: 'getUserPreferences'});
      await handleConsent(preferences);
    }
  }
  
  // Run the main function when the page is loaded
  window.addEventListener('load', main);
  
  // Listen for preference changes
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'preferencesUpdated') {
      main();
    }
  });