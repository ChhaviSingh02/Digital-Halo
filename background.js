// Digital Halo - Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('Digital Halo installed');
  
  // Set default settings
  chrome.storage.sync.get(['haloSettings'], (result) => {
    if (!result.haloSettings) {
      const defaultSettings = {
        sites: {
          'instagram.com': { enabled: true, limit: 60 },
          'youtube.com': { enabled: true, limit: 120 },
          'twitter.com': { enabled: true, limit: 30 },
          'x.com': { enabled: true, limit: 30 },
          'facebook.com': { enabled: true, limit: 45 },
          'reddit.com': { enabled: true, limit: 90 },
          'tiktok.com': { enabled: true, limit: 30 },
          'linkedin.com': { enabled: true, limit: 60 }
        },
        theme: 'dark',
        notifications: true,
        softBlock: true
      };
      
      chrome.storage.sync.set({ haloSettings: defaultSettings });
    }
  });
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    const hostname = url.hostname.replace('www.', '');
    
    // Check if this is a monitored site
    chrome.storage.sync.get(['haloSettings'], (result) => {
      const settings = result.haloSettings;
      if (settings && settings.sites[hostname]?.enabled) {
        // Inject content script if not already present
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            // Check if Digital Halo is already active
            return !!document.getElementById('digital-halo');
          }
        }).then((results) => {
          if (results && results[0] && !results[0].result) {
            // Digital Halo not present, inject it
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ['content.js']
            });
          }
        }).catch((error) => {
          console.log('Error checking/injecting content script:', error);
        });
      }
    });
  }
});

// Handle active tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      const url = new URL(tab.url);
      const hostname = url.hostname.replace('www.', '');
      
      // Send message to content script about tab change
      chrome.tabs.sendMessage(activeInfo.tabId, {
        action: 'tabActivated',
        hostname: hostname
      }).catch(() => {
        // Content script might not be loaded yet
      });
    }
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getUsageData') {
    chrome.storage.sync.get(['haloUsage'], (result) => {
      sendResponse(result.haloUsage || {});
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'resetUsageData') {
    chrome.storage.sync.set({ haloUsage: {} }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'updateSettings') {
    chrome.storage.sync.set({ haloSettings: request.settings }, () => {
      // Notify all tabs about settings update
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'settingsUpdated',
            settings: request.settings
          }).catch(() => {
            // Tab might not have content script
          });
        });
      });
      sendResponse({ success: true });
    });
    return true;
  }
});

// Periodic cleanup of old usage data (keep last 30 days)
chrome.alarms.create('cleanup', { periodInMinutes: 1440 }); // Daily

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    chrome.storage.sync.get(['haloUsage'], (result) => {
      const usage = result.haloUsage || {};
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);
      
      const cleanedUsage = {};
      Object.keys(usage).forEach(dateStr => {
        const date = new Date(dateStr);
        if (date >= cutoffDate) {
          cleanedUsage[dateStr] = usage[dateStr];
        }
      });
      
      chrome.storage.sync.set({ haloUsage: cleanedUsage });
    });
  }
});