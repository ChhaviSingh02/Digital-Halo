// Digital Halo - Content Script
class DigitalHalo {
  constructor() {
    this.isExpanded = false;
    this.currentSite = this.getCurrentSite();
    this.startTime = Date.now();
    this.isActive = true;
    this.settings = {};
    this.usage = {};
    this.warningShown = false;
    
    this.init();
  }

  async init() {
    // Load settings and usage data
    await this.loadData();
    
    // Only show halo on monitored sites
    if (this.isMonitoredSite()) {
      this.createHalo();
      this.startTracking();
      this.setupEventListeners();
    }
  }

  async loadData() {
    const data = await chrome.storage.sync.get(['haloSettings', 'haloUsage']);
    this.settings = data.haloSettings || this.getDefaultSettings();
    this.usage = data.haloUsage || {};
  }

  getDefaultSettings() {
    return {
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
  }

  getCurrentSite() {
    const hostname = window.location.hostname;
    return hostname.replace('www.', '');
  }

  isMonitoredSite() {
    return this.settings.sites[this.currentSite]?.enabled || false;
  }

  createHalo() {
    // Remove existing halo if any
    const existing = document.getElementById('digital-halo');
    if (existing) existing.remove();

    const halo = document.createElement('div');
    halo.id = 'digital-halo';
    halo.setAttribute('data-theme', this.settings.theme);
    
    this.renderCompactView(halo);
    document.body.appendChild(halo);
    
    // Add click handler
    halo.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleExpanded();
    });
  }

  renderCompactView(container) {
    const todayUsage = this.getTodayUsage();
    const siteUsage = todayUsage[this.currentSite] || 0;
    const limit = this.settings.sites[this.currentSite]?.limit || 60;
    const progress = Math.min((siteUsage / limit) * 100, 100);
    
    let status = 'normal';
    if (progress > 80) status = 'warning';
    if (progress >= 100) status = 'danger';

    container.innerHTML = `
      <div class="halo-pill halo-${status}">
        <div class="halo-ring" style="--progress: ${progress}%"></div>
        <div class="halo-info">
          <div class="halo-time">${this.formatTime(siteUsage)}</div>
          <div class="halo-site">${this.currentSite}</div>
        </div>
      </div>
    `;
  }

  renderExpandedView(container) {
    const todayUsage = this.getTodayUsage();
    const totalToday = Object.values(todayUsage).reduce((sum, time) => sum + time, 0);
    const siteUsage = todayUsage[this.currentSite] || 0;
    const limit = this.settings.sites[this.currentSite]?.limit || 60;
    
    container.innerHTML = `
      <div class="halo-expanded">
        <div class="halo-header">
          <div class="halo-title">Digital Halo</div>
          <button class="halo-close" onclick="this.closest('#digital-halo').dispatchEvent(new Event('click'))">×</button>
        </div>
        
        <div class="halo-stats">
          <div class="halo-stat">
            <div class="halo-stat-value">${this.formatTime(siteUsage)}</div>
            <div class="halo-stat-label">Today Here</div>
          </div>
          <div class="halo-stat">
            <div class="halo-stat-value">${this.formatTime(totalToday)}</div>
            <div class="halo-stat-label">Total Today</div>
          </div>
        </div>
        
        <div class="halo-chart">
          <canvas id="halo-usage-chart" width="280" height="96"></canvas>
        </div>
        
        <div class="halo-sites">
          ${this.renderSiteList(todayUsage)}
        </div>
        
        <button class="halo-theme-toggle" onclick="this.dispatchEvent(new CustomEvent('theme-toggle'))">
          ${this.settings.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    `;
    
    // Render chart
    setTimeout(() => this.renderChart(todayUsage), 100);
  }

  renderSiteList(usage) {
    const sites = Object.entries(this.settings.sites)
      .filter(([_, config]) => config.enabled)
      .map(([site, config]) => {
        const time = usage[site] || 0;
        const progress = Math.min((time / config.limit) * 100, 100);
        return `
          <div class="halo-site-item">
            <div class="halo-site-name">${site}</div>
            <div class="halo-site-time">${this.formatTime(time)} / ${this.formatTime(config.limit)}</div>
          </div>
        `;
      })
      .join('');
    
    return sites;
  }

  renderChart(usage) {
    const canvas = document.getElementById('halo-usage-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const sites = Object.keys(this.settings.sites).filter(site => this.settings.sites[site].enabled);
    const data = sites.map(site => usage[site] || 0);
    const colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', '#FF2D92'];
    
    // Simple bar chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / sites.length;
    const maxValue = Math.max(...data, 1);
    
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (canvas.height - 20);
      const x = index * barWidth;
      const y = canvas.height - barHeight - 10;
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
      
      // Site label
      ctx.fillStyle = '#fff';
      ctx.font = '10px -apple-system';
      ctx.textAlign = 'center';
      ctx.fillText(
        sites[index].split('.')[0].slice(0, 3),
        x + barWidth / 2,
        canvas.height - 2
      );
    });
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    const container = document.getElementById('digital-halo');
    
    if (this.isExpanded) {
      this.renderExpandedView(container);
      // Add theme toggle listener
      container.addEventListener('theme-toggle', () => {
        this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
        container.setAttribute('data-theme', this.settings.theme);
        chrome.storage.sync.set({ haloSettings: this.settings });
      });
    } else {
      this.renderCompactView(container);
    }
  }

  startTracking() {
    // Track time every second
    this.trackingInterval = setInterval(() => {
      if (this.isActive && !document.hidden) {
        this.updateUsage();
        this.checkLimits();
        this.updateDisplay();
      }
    }, 1000);
  }

  updateUsage() {
    const today = new Date().toDateString();
    if (!this.usage[today]) {
      this.usage[today] = {};
    }
    
    if (!this.usage[today][this.currentSite]) {
      this.usage[today][this.currentSite] = 0;
    }
    
    this.usage[today][this.currentSite] += 1; // Add 1 second
    
    // Save to storage every 10 seconds
    if (this.usage[today][this.currentSite] % 10 === 0) {
      chrome.storage.sync.set({ haloUsage: this.usage });
    }
  }

  checkLimits() {
    const todayUsage = this.getTodayUsage();
    const siteUsage = todayUsage[this.currentSite] || 0;
    const limit = (this.settings.sites[this.currentSite]?.limit || 60) * 60; // Convert to seconds
    
    if (siteUsage >= limit && !this.warningShown) {
      this.showBreakModal();
      this.warningShown = true;
    }
  }

  showBreakModal() {
    if (!this.settings.softBlock) return;
    
    const modal = document.createElement('div');
    modal.className = 'halo-overlay';
    modal.innerHTML = `
      <div class="halo-break-modal">
        <div class="halo-break-title">Time for a break! 🌟</div>
        <div class="halo-break-subtitle">
          You've reached your daily limit for ${this.currentSite}
        </div>
        <div class="halo-break-buttons">
          <button class="halo-btn halo-btn-primary" onclick="this.closest('.halo-overlay').remove()">
            Take a Break
          </button>
          <button class="halo-btn halo-btn-secondary" onclick="this.closest('.halo-overlay').remove()">
            5 More Minutes
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 30000);
  }

  updateDisplay() {
    const container = document.getElementById('digital-halo');
    if (container && !this.isExpanded) {
      this.renderCompactView(container);
    }
  }

  getTodayUsage() {
    const today = new Date().toDateString();
    return this.usage[today] || {};
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  setupEventListeners() {
    // Handle tab visibility changes
    document.addEventListener('visibilitychange', () => {
      this.isActive = !document.hidden;
    });
    
    // Handle page navigation
    window.addEventListener('beforeunload', () => {
      chrome.storage.sync.set({ haloUsage: this.usage });
    });
    
    // Close expanded view when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isExpanded && !e.target.closest('#digital-halo')) {
        this.toggleExpanded();
      }
    });
  }

  destroy() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }
    
    const halo = document.getElementById('digital-halo');
    if (halo) {
      halo.remove();
    }
    
    // Save final usage data
    chrome.storage.sync.set({ haloUsage: this.usage });
  }
}

// Initialize Digital Halo
let digitalHalo;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    digitalHalo = new DigitalHalo();
  });
} else {
  digitalHalo = new DigitalHalo();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (digitalHalo) {
    digitalHalo.destroy();
  }
});

// Listen for settings updates from popup
chrome.runtime.onMessage?.addListener((request, sender, sendResponse) => {
  if (request.action === 'settingsUpdated') {
    if (digitalHalo) {
      digitalHalo.destroy();
    }
    digitalHalo = new DigitalHalo();
  }
});