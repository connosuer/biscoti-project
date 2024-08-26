document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = {
      acceptAll: document.getElementById('acceptAll'),
      functionalCookies: document.getElementById('functionalCookies'),
      analyticsCookies: document.getElementById('analyticsCookies'),
      advertisingCookies: document.getElementById('advertisingCookies')
    };
  
    // Load current preferences
    chrome.runtime.sendMessage({action: 'getUserPreferences'}, (preferences) => {
      for (let [key, checkbox] of Object.entries(checkboxes)) {
        checkbox.checked = preferences[key];
      }
    });
  
    // Handle "Accept All" checkbox
    checkboxes.acceptAll.addEventListener('change', (e) => {
      const checked = e.target.checked;
      for (let checkbox of Object.values(checkboxes)) {
        checkbox.checked = checked;
      }
    });
  
    // Save preferences
    document.getElementById('save').addEventListener('click', () => {
      const preferences = {};
      for (let [key, checkbox] of Object.entries(checkboxes)) {
        preferences[key] = checkbox.checked;
      }
      chrome.runtime.sendMessage({action: 'setUserPreferences', preferences}, (response) => {
        if (response.status === 'success') {
          alert('Preferences saved successfully!');
        }
      });
    });
  });