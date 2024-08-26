document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = {
    acceptAll: document.getElementById('acceptAll'),
    functionalCookies: document.getElementById('functionalCookies'),
    analyticsCookies: document.getElementById('analyticsCookies'),
    advertisingCookies: document.getElementById('advertisingCookies')
  };

  // Load current preferences
  chrome.runtime.sendMessage({action: 'getUserPreferences'}, (preferences) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading preferences:', chrome.runtime.lastError);
    } else {
      for (let [key, checkbox] of Object.entries(checkboxes)) {
        checkbox.checked = preferences[key];
      }
    }
  });

  // Save preferences
  document.getElementById('save').addEventListener('click', () => {
    const preferences = {};
    for (let [key, checkbox] of Object.entries(checkboxes)) {
      preferences[key] = checkbox.checked;
    }
    chrome.storage.sync.set({ preferences }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving preferences:', chrome.runtime.lastError);
      } else {
        alert('Preferences saved successfully!');
      }
    });
  });
});