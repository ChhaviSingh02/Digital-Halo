// Digital Halo - Popup JavaScript

class HaloPopup {
    constructor() {
        this.settings = {};
        this.usage = {};
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderUI();
        this.setupEventListeners();
        this.hideLoading();
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

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }

    renderUI() {
        this.renderStats();
        this.renderSitesList();
        this.renderSettings();
    }

    renderStats() {
        const today = new Date().toDateString();
        const todayUsage = this.usage[today] || {};
        
        const totalTime = Object.values(todayUsage).reduce((sum, time) => sum + time, 0);
        const activeSites = Object.keys(todayUsage).filter(site => todayUsage[site] > 0).length;
        
        document.getElementById('total-time').textContent = this.formatTime(totalTime);
        document.getElementById('active-sites').textContent = activeSites;
    }

    renderSitesList() {
        const sitesList = document.getElementById('sites-list');
        const today = new Date().toDateString();
        const todayUsage = this.usage[today] || {};
        
        sitesList.innerHTML = '';
        
        Object.entries(this.settings.sites).forEach(([site, config]) => {
            const siteItem = document.createElement('div');
            siteItem.className = 'site-item';
            
            const usage = todayUsage[site] || 0;
            const usageText = usage > 0 ? ` (${this.formatTime(usage)} today)` : '';
            
            siteItem.innerHTML = `
                <div class="site-info">
                    <div class="site-name">${site}</div>
                    <div class="site-limit">${config.limit} min limit${usageText}</div>
                </div>
                <div class="site-controls">
                    <input type="number" class="limit-input" value="${config.limit}" min="1" max="999" data-site="${site}">
                    <div class="toggle ${config.enabled ? 'active' : ''}" data-site="${site}"></div>
                </div>
            `;
            
            sitesList.appendChild(siteItem);
        });
    }

    renderSettings() {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.settings.theme);
        });
    }

    setupEventListeners() {
        // Toggle switches
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle')) {
                const site = e.target.dataset.site;
                const isActive = e.target.classList.contains('active');
                
                e.target.classList.toggle('active');
                this.settings.sites[site].enabled = !isActive;
                this.saveSettings();
            }
        });

        // Limit inputs
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('limit-input')) {
                const site = e.target.dataset.site;
                const limit = parseInt(e.target.value) || 1;
                
                this.settings.sites[site].limit = Math.max(1, Math.min(999, limit));
                this.saveSettings();
            }
        });

        // Theme selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.settings.theme = option.dataset.theme;
                this.saveSettings();
            });
        });

        // Add new site
        document.getElementById('add-site-btn').addEventListener('click', () => {
            const input = document.getElementById('new-site');
            const site = input.value.trim().toLowerCase();
            
            if (site && !this.settings.sites[site]) {
                this.settings.sites[site] = { enabled: true, limit: 60 };
                input.value = '';
                this.renderSitesList();
                this.saveSettings();
            }
        });

        // Enter key for add site
        document.getElementById('new-site').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('add-site-btn').click();
            }
        });

        // Save settings button
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
            this.showSavedMessage();
        });

        // Reset data button
        document.getElementById('reset-data').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset today\'s usage data?')) {
                this.resetTodayData();
            }
        });

        // Remove site (double-click site name)
        document.addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('site-name')) {
                const site = e.target.textContent;
                if (confirm(`Remove ${site} from monitoring?`)) {
                    delete this.settings.sites[site];
                    this.renderSitesList();
                    this.saveSettings();
                }
            }
        });
    }

    async saveSettings() {
        await chrome.storage.sync.set({ haloSettings: this.settings });
        
        // Notify content scripts
        chrome.runtime.sendMessage({
            action: 'updateSettings',
            settings: this.settings
        });
    }

    async resetTodayData() {
        const today = new Date().toDateString();
        delete this.usage[today];
        
        await chrome.storage.sync.set({ haloUsage: this.usage });
        this.renderStats();
        this.renderSitesList();
        
        // Show success message
        this.showMessage('Today\'s data has been reset!', 'success');
    }

    showSavedMessage() {
        this.showMessage('Settings saved successfully!', 'success');
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#34C759' : '#007AFF'};
            color: white;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        message.textContent = text;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 2000);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return `${seconds}s`;
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    new HaloPopup();
});