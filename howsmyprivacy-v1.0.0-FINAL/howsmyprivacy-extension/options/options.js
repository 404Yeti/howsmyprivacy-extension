// HowsMyPrivacy Settings Script

// Firefox compatibility
if (typeof browser !== 'undefined' && !chrome.runtime) {
  window.chrome = browser;
}

// Default settings
const DEFAULT_SETTINGS = {
  autoScan: true,
  showBadge: true,
  notifications: true,
  scanDelay: 2000,
  theme: 'cyberpunk',
  checkCookies: true,
  checkTracking: true,
  checkFingerprinting: true,
  checkSecurity: true,
  detailedReports: true,
  saveHistory: true,
  historyRetention: 30,
  animations: true,
  scanlines: true,
  developerMode: false,
  contextMenu: true,
  scoreThreshold: 60
};

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
});

async function loadSettings() {
  try {
    const settings = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
    
    // Apply saved settings or defaults
    document.getElementById('autoScan').checked = settings.autoScan ?? DEFAULT_SETTINGS.autoScan;
    document.getElementById('showBadge').checked = settings.showBadge ?? DEFAULT_SETTINGS.showBadge;
    document.getElementById('notifications').checked = settings.notifications ?? DEFAULT_SETTINGS.notifications;
    document.getElementById('scanDelay').value = settings.scanDelay ?? DEFAULT_SETTINGS.scanDelay;
    document.getElementById('theme').value = settings.theme ?? DEFAULT_SETTINGS.theme;
    
    // Privacy checks
    document.getElementById('checkCookies').checked = settings.checkCookies ?? DEFAULT_SETTINGS.checkCookies;
    document.getElementById('checkTracking').checked = settings.checkTracking ?? DEFAULT_SETTINGS.checkTracking;
    document.getElementById('checkFingerprinting').checked = settings.checkFingerprinting ?? DEFAULT_SETTINGS.checkFingerprinting;
    document.getElementById('checkSecurity').checked = settings.checkSecurity ?? DEFAULT_SETTINGS.checkSecurity;
    
    // Reporting
    document.getElementById('detailedReports').checked = settings.detailedReports ?? DEFAULT_SETTINGS.detailedReports;
    document.getElementById('saveHistory').checked = settings.saveHistory ?? DEFAULT_SETTINGS.saveHistory;
    document.getElementById('historyRetention').value = settings.historyRetention ?? DEFAULT_SETTINGS.historyRetention;
    
    // Appearance
    document.getElementById('animations').checked = settings.animations ?? DEFAULT_SETTINGS.animations;
    document.getElementById('scanlines').checked = settings.scanlines ?? DEFAULT_SETTINGS.scanlines;
    
    // Advanced
    document.getElementById('developerMode').checked = settings.developerMode ?? DEFAULT_SETTINGS.developerMode;
    document.getElementById('contextMenu').checked = settings.contextMenu ?? DEFAULT_SETTINGS.contextMenu;
    document.getElementById('scoreThreshold').value = settings.scoreThreshold ?? DEFAULT_SETTINGS.scoreThreshold;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

function setupEventListeners() {
  // Scan settings
  document.getElementById('autoScan').addEventListener('change', (e) => {
    saveSetting('autoScan', e.target.checked);
  });

  document.getElementById('showBadge').addEventListener('change', (e) => {
    saveSetting('showBadge', e.target.checked);
  });

  document.getElementById('notifications').addEventListener('change', async (e) => {
    if (e.target.checked) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          e.target.checked = false;
          alert('Please enable notifications in your browser settings');
          return;
        }
      }
    }
    saveSetting('notifications', e.target.checked);
  });

  document.getElementById('scanDelay').addEventListener('change', (e) => {
    saveSetting('scanDelay', parseInt(e.target.value));
  });

  document.getElementById('theme').addEventListener('change', (e) => {
    saveSetting('theme', e.target.value);
  });
  
  // Privacy checks
  document.getElementById('checkCookies').addEventListener('change', (e) => {
    saveSetting('checkCookies', e.target.checked);
  });
  
  document.getElementById('checkTracking').addEventListener('change', (e) => {
    saveSetting('checkTracking', e.target.checked);
  });
  
  document.getElementById('checkFingerprinting').addEventListener('change', (e) => {
    saveSetting('checkFingerprinting', e.target.checked);
  });
  
  document.getElementById('checkSecurity').addEventListener('change', (e) => {
    saveSetting('checkSecurity', e.target.checked);
  });
  
  // Reporting
  document.getElementById('detailedReports').addEventListener('change', (e) => {
    saveSetting('detailedReports', e.target.checked);
  });
  
  document.getElementById('saveHistory').addEventListener('change', (e) => {
    saveSetting('saveHistory', e.target.checked);
  });
  
  document.getElementById('historyRetention').addEventListener('change', (e) => {
    saveSetting('historyRetention', parseInt(e.target.value));
  });
  
  // Appearance
  document.getElementById('animations').addEventListener('change', (e) => {
    saveSetting('animations', e.target.checked);
  });
  
  document.getElementById('scanlines').addEventListener('change', (e) => {
    saveSetting('scanlines', e.target.checked);
  });
  
  // Advanced
  document.getElementById('developerMode').addEventListener('change', (e) => {
    saveSetting('developerMode', e.target.checked);
  });
  
  document.getElementById('contextMenu').addEventListener('change', (e) => {
    saveSetting('contextMenu', e.target.checked);
  });
  
  document.getElementById('scoreThreshold').addEventListener('change', (e) => {
    saveSetting('scoreThreshold', parseInt(e.target.value));
  });

  // Clear data button
  document.getElementById('clearData').addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all scan history and cached data? This cannot be undone.')) {
      try {
        // Keep settings but clear scan data
        const settings = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
        await chrome.storage.local.clear();
        await chrome.storage.local.set(settings);
        
        showSaveIndicator('Data cleared successfully');
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Failed to clear data');
      }
    }
  });

  // Export settings button
  document.getElementById('exportSettings').addEventListener('click', async () => {
    try {
      const settings = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `howsmyprivacy-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSaveIndicator('Settings exported');
    } catch (error) {
      console.error('Error exporting settings:', error);
      alert('Failed to export settings');
    }
  });
}

async function saveSetting(key, value) {
  try {
    await chrome.storage.local.set({ [key]: value });
    showSaveIndicator();
  } catch (error) {
    console.error('Error saving setting:', error);
  }
}

function showSaveIndicator(customText = null) {
  const indicator = document.getElementById('saveIndicator');
  const textElement = indicator.querySelector('.save-text');
  
  if (customText) {
    textElement.textContent = customText;
  } else {
    textElement.textContent = 'Settings saved';
  }
  
  indicator.classList.add('show');
  
  setTimeout(() => {
    indicator.classList.remove('show');
  }, 2000);
}
