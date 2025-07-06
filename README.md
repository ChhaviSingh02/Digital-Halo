# 🌟 Digital Halo - Chrome Extension

**Elegant social media mindfulness with Dynamic Island-inspired UI**

Digital Halo is a sophisticated Chrome extension that helps you build healthier relationships with social media through real-time usage tracking, gentle nudges, and beautiful visualizations. Inspired by iPhone's Dynamic Island, it provides a minimalist yet powerful interface that stays out of your way while keeping you mindful of your digital habits.

## ✨ Features

### 🎯 **Smart Monitoring**
- **Real-time tracking** of time spent on social media platforms
- **Automatic pause** when tabs are inactive or not in focus
- **Customizable site selection** - monitor Instagram, YouTube, Twitter/X, Facebook, Reddit, and more
- **Add custom domains** for niche platforms

### 🌙 **Dynamic Island UI**
- **Floating halo** positioned near your laptop's camera (top-center)
- **Compact pill view** showing current usage with animated progress ring
- **Expandable dashboard** with detailed analytics and charts
- **Smooth animations** and transitions for a premium feel

### 📊 **Rich Analytics**
- **Daily usage breakdowns** by platform
- **Visual progress rings** inspired by Apple Watch
- **Interactive charts** showing usage patterns
- **Historical data** with automatic cleanup

### 🎨 **Beautiful Design**
- **Neumorphic styling** with soft shadows and blur effects
- **Dark/Light theme** support
- **Responsive design** that works on all screen sizes
- **Accessibility-first** approach

### 🚦 **Gentle Limits**
- **Per-site daily limits** with customizable durations
- **Smart warning system** with visual cues
- **Soft blocking** with encouraging break reminders
- **Motivational messaging** to support healthy habits

## 🚀 Installation

### Method 1: Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Search for "Digital Halo"
3. Click "Add to Chrome"

### Method 2: Developer Mode (Current)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The Digital Halo icon should appear in your extensions

## 📁 Project Structure

```
digital-halo/
├── manifest.json          # Extension configuration
├── content.js            # Main tracking and UI logic
├── background.js         # Service worker for data management
├── halo.css             # Dynamic Island styling
├── popup.html           # Settings interface
├── popup.js             # Settings functionality
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```

## 🔧 Technical Details

### **Built With**
- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No external dependencies
- **CSS3** - Modern styling with backdrop-filter and animations
- **Chrome Storage API** - Secure, synced data storage
- **Canvas API** - Custom chart rendering

### **Key Components**

#### `content.js` - The Heart of Digital Halo
- **DigitalHalo class** - Main application logic
- **Real-time tracking** - Monitors active tab usage
- **UI rendering** - Creates and manages the floating halo
- **Data persistence** - Saves usage data locally

#### `background.js` - Service Worker
- **Tab monitoring** - Tracks navigation and tab changes
- **Data cleanup** - Removes old usage data automatically
- **Settings sync** - Propagates settings across tabs

#### `halo.css` - Dynamic Island Styling
- **CSS variables** - Theme-aware color system
- **Blur effects** - Backdrop-filter for glass morphism
- **Animations** - Smooth transitions and micro-interactions
- **Responsive design** - Works on all screen sizes

### **Permissions Used**
- `tabs` - Monitor active tabs and navigation
- `storage` - Save settings and usage data
- `activeTab` - Track time on current tab
- `scripting` - Inject content scripts dynamically

## 🎛️ Configuration

### **Default Monitored Sites**
- Instagram (60 min limit)
- YouTube (120 min limit)
- Twitter/X (30 min limit)
- Facebook (45 min limit)
- Reddit (90 min limit)
- TikTok (30 min limit)
- LinkedIn (60 min limit)

### **Customization Options**
- **Add new sites** - Monitor any domain
- **Adjust time limits** - Set per-site daily limits
- **Theme selection** - Choose dark or light mode
- **Notification settings** - Enable/disable alerts
- **Soft blocking** - Toggle gentle limit enforcement

## 🔒 Privacy & Security

Digital Halo is built with privacy as a core principle:

- **No data collection** - All data stays on your device
- **Local storage only** - Uses Chrome's sync storage for settings
- **No external servers** - No data transmitted anywhere
- **No tracking** - No analytics or usage reporting
- **Open source** - Code is fully transparent

## 🎨 Design Philosophy

Digital Halo embraces the philosophy of **gentle technology** - tools that enhance rather than exploit our digital lives. The interface is designed to be:

- **Unobtrusive** - Stays out of your way until needed
- **Beautiful** - Brings joy to the mindfulness process
- **Informative** - Provides insights without judgment
- **Encouraging** - Supports positive behavior change

## 🤝 Contributing

We welcome contributions to Digital Halo! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Setup**
```bash
# Clone the repository
git clone https://github.com/yourusername/digital-halo.git

# Load in Chrome
1. Open chrome://extensions/
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the project folder
```

## 🐛 Known Issues

- **Tab detection** - May not work on some special Chrome pages
- **Performance** - Heavy usage sites may impact browser performance
- **Sync delay** - Settings changes may take a moment to propagate

## 🗺️ Roadmap

- [ ] **Weekly/Monthly reports** - Extended analytics
- [ ] **Goal setting** - Personal usage targets
- [ ] **Focus mode** - Block distracting sites temporarily
- [ ] **Productivity insights** - AI-powered usage analysis
- [ ] **Social features** - Share progress with friends
- [ ] **Mobile companion** - Extend tracking to mobile devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Apple** - Inspiration from Dynamic Island design
- **Chrome Extensions API** - Robust platform for browser extensions
- **Community** - Thanks to all beta testers and contributors

---

**Digital Halo** - *Building mindful relationships with technology, one moment at a time.* 🌟