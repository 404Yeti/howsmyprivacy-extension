// HowsMyPrivacy Background Service Worker
// Handles extension lifecycle and badge updates

// Firefox compatibility
if (typeof browser !== 'undefined' && !chrome.runtime) {
  window.chrome = browser;
}

// Install event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('HowsMyPrivacy installed');
    
    // Set default settings
    chrome.storage.local.set({
      autoScan: true,
      showBadge: true,
      notifications: true
    });

    // Open welcome page
    chrome.tabs.create({ url: 'welcome.html' });
  } else if (details.reason === 'update') {
    console.log('HowsMyPrivacy updated to version', chrome.runtime.getManifest().version);
  }
});

// Tab update listener - scan when page loads
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Skip chrome:// and extension pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      return;
    }

    // Check if auto-scan is enabled
    const { autoScan, showBadge } = await chrome.storage.local.get(['autoScan', 'showBadge']);
    
    if (autoScan) {
      try {
        // Wait a bit for page to settle
        setTimeout(async () => {
          const results = await chrome.tabs.sendMessage(tabId, { action: 'runPrivacyCheck' });
          
          if (results && showBadge) {
            updateBadge(tabId, results.score);
          }

          // Store results
          await chrome.storage.local.set({
            [`results_${tabId}`]: results,
            lastScan: new Date().toISOString()
          });
        }, 2000);
      } catch (error) {
        console.error('Auto-scan error:', error);
      }
    }
  }
});

// Tab closed listener - cleanup stored results
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`results_${tabId}`);
});

// Update badge with score
function updateBadge(tabId, score) {
  let color;
  let text;

  if (score >= 80) {
    color = '#00c853'; // Green
    text = '✓';
  } else if (score >= 60) {
    color = '#fcc800'; // Yellow (brand)
    text = String(score);
  } else if (score >= 40) {
    color = '#ff9800'; // Orange
    text = String(score);
  } else {
    color = '#f44336'; // Red
    text = '!';
  }

  // Firefox uses browserAction, Chrome uses action
  const badgeAPI = chrome.browserAction || chrome.action;
  badgeAPI.setBadgeBackgroundColor({ color, tabId });
  badgeAPI.setBadgeText({ text, tabId });
}

// Clear badge
function clearBadge(tabId) {
  const badgeAPI = chrome.browserAction || chrome.action;
  badgeAPI.setBadgeText({ text: '', tabId });
}

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateBadge') {
    updateBadge(sender.tab.id, request.score);
    sendResponse({ success: true });
  } else if (request.action === 'clearBadge') {
    clearBadge(sender.tab.id);
    sendResponse({ success: true });
  } else if (request.action === 'getSettings') {
    chrome.storage.local.get(['autoScan', 'showBadge', 'notifications'], (settings) => {
      sendResponse(settings);
    });
    return true;
  }
});

// Context menu (right-click)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scanPage',
    title: 'Scan page privacy',
    contexts: ['page']
  });

  chrome.contextMenus.create({
    id: 'viewReport',
    title: 'View detailed report',
    contexts: ['page']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'scanPage') {
    try {
      const results = await chrome.tabs.sendMessage(tab.id, { action: 'runPrivacyCheck' });
      
      if (results) {
        updateBadge(tab.id, results.score);
        
        // Show notification
        const { notifications } = await chrome.storage.local.get(['notifications']);
        if (notifications) {
          showNotification(results.score);
        }
      }
    } catch (error) {
      console.error('Context menu scan error:', error);
    }
  } else if (info.menuItemId === 'viewReport') {
    chrome.tabs.create({ url: chrome.runtime.getURL('report/report.html') });
  }
});

// Show notification with score
function showNotification(score) {
  let title, message, iconPath;

  if (score >= 80) {
    title = '✓ Excellent Privacy';
    message = `Privacy score: ${score}/100. Your browser is well protected!`;
    iconPath = 'icons/icon128.png';
  } else if (score >= 60) {
    title = '⚠ Good Privacy';
    message = `Privacy score: ${score}/100. Some improvements recommended.`;
    iconPath = 'icons/icon128.png';
  } else if (score >= 40) {
    title = '⚠️ Fair Privacy';
    message = `Privacy score: ${score}/100. Multiple issues found.`;
    iconPath = 'icons/icon128.png';
  } else {
    title = '🚨 Poor Privacy';
    message = `Privacy score: ${score}/100. Immediate action needed!`;
    iconPath = 'icons/icon128.png';
  }

  chrome.notifications.create({
    type: 'basic',
    iconUrl: iconPath,
    title: title,
    message: message,
    priority: 2
  });
}

// Keep service worker alive
let keepAliveInterval;

function keepAlive() {
  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo(() => {
      // Just checking if runtime is still valid
    });
  }, 20000);
}

keepAlive();

console.log('HowsMyPrivacy background service worker loaded');
