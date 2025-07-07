# 🌟 Digital Halo - Chrome Extension
![image](https://github.com/user-attachments/assets/1df7e5f4-7440-4c20-9804-0a2c40a0fd0a)


**Elegant social media mindfulness with Dynamic Island-inspired UI**

Digital Halo is a sophisticated Chrome extension that helps you build healthier relationships with social media through real-time usage tracking, gentle nudges, and beautiful visualizations. Inspired by iPhone's Dynamic Island, it provides a minimalist yet powerful interface that stays out of your way while keeping you mindful of your digital habits.

## ✨ Features

### 🎯 **Smart Monitoring**
- **Real-time tracking** of time spent on social media platforms
- **Automatic pause** when tabs are inactive or not in focus
- **Customizable site selection** - monitor Instagram, YouTube, Twitter/X, Facebook, Reddit, and more
- **Add custom domains** for niche platforms

### 🌙 **Dynamic Island UI**
![Screenshot 2025-07-07 225805](https://github.com/user-attachments/assets/48c9aaa4-221f-4b86-b199-7e2df401380b)
- **Floating halo** positioned near your laptop's camera (top-center)
- **Compact pill view** showing current usage with animated progress ring
- **Expandable dashboard** with detailed analytics and charts
- **Smooth animations** and transitions for a premium feel

### 📊 **Rich Analytics**

![Screenshot 2025-07-07 225814](https://github.com/user-attachments/assets/45d7b265-d72f-48d6-9050-2757d89e670f)
- **Daily usage breakdowns** by platform
- **Visual progress rings** inspired by Apple Watch
- **Interactive charts** showing usage patterns
- **Historical data** with automatic cleanup

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


## 🙏 Acknowledgments

- **Apple** - Inspiration from Dynamic Island design
- **Chrome Extensions API** - Robust platform for browser extensions
- **Community** - Thanks to all beta testers and contributors

---

**Digital Halo** - *Building mindful relationships with technology, one moment at a time.* 🌟
