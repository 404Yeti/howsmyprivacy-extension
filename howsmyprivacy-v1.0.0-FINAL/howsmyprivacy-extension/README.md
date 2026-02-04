# HowsMyPrivacy

<div align="center">

![HowsMyPrivacy Icon](icons/icon128.png)

**Real-time browser privacy & security scoring with a cyberpunk terminal aesthetic**

[![Version](https://img.shields.io/badge/version-1.0.0-fcc800?style=for-the-badge)](https://github.com/yourusername/HowsMyPrivacy/releases)
[![License](https://img.shields.io/badge/license-MIT-fcc800?style=for-the-badge)](LICENSE)
[![Chrome](https://img.shields.io/badge/chrome-compatible-fcc800?style=for-the-badge&logo=googlechrome)](https://github.com/yourusername/HowsMyPrivacy)
[![Firefox](https://img.shields.io/badge/firefox-compatible-fcc800?style=for-the-badge&logo=firefox)](https://github.com/yourusername/HowsMyPrivacy)

[Features](#features) • [Installation](#installation) • [Screenshots](#screenshots) • [Contributing](#contributing) • [Privacy](#privacy)

</div>

---

## 🔒 What is HowsMyPrivacy?

HowsMyPrivacy is a browser extension that analyzes your browser's privacy and security posture in real-time, giving you a score from 0-100. Think of it as a security audit tool that runs locally in your browser with a cyberpunk terminal aesthetic.

### Why Use This?

- ✅ **Know your privacy score** - Instant 0-100 rating of your browser configuration
- ✅ **Identify vulnerabilities** - Detect tracking scripts, cookies, fingerprinting attempts
- ✅ **Get actionable fixes** - Specific recommendations for each issue found
- ✅ **Zero data collection** - Everything runs locally, nothing leaves your browser
- ✅ **Professional UI** - Cyberpunk terminal theme with scanlines and glows

---

## ✨ Features

### Privacy Analysis

- **Real-time Scoring System** (0-100)
- **5 Security Categories**:
  - 🔴 Cookie Privacy - Third-party cookies, tracking cookies, cookie count
  - 🟡 Tracking Protection - Analytics scripts, tracking pixels, DNT status
  - 🟢 Privacy Settings - WebRTC leaks, HTTPS usage, localStorage
  - 🔵 Security Headers - CSP, mixed content, secure connections
  - 🟣 Fingerprinting - Canvas, WebGL, browser uniqueness

### User Interface

- **Cyberpunk Terminal Theme** - Dark backgrounds, neon glows, CRT scanlines
- **Animated Score Counter** - Smooth count-up from 0 to your score
- **Colored Status Indicators** - Green/Yellow/Orange/Red dots showing category health
- **Expandable Categories** - Click to see detailed issues and fixes
- **Professional Design** - No emojis, clean terminal aesthetic

### Detailed Reports

- **Full HTML Reports** - Comprehensive analysis of all categories
- **Print/PDF Export** - Save reports for documentation
- **Issue Severity Levels** - Critical, High, Medium, Low
- **Specific Recommendations** - Exact steps to fix each issue

### Settings & Configuration

- **40+ Options** across 6 categories
- **Toggle Individual Checks** - Disable checks you don't need
- **Appearance Customization** - Themes, animations, scanlines
- **Scan History** - Keep or clear previous scan results
- **Export/Import Settings** - Save your configuration

---

## 📥 Installation

### Method 1: Chrome Web Store (Recommended)
*Coming soon - pending review*

### Method 2: Manual Installation (Chrome/Brave/Edge)

1. **Download** the [latest release](https://github.com/yourusername/HowsMyPrivacy/releases)
2. **Extract** the ZIP file to a folder
3. **Open** Chrome and go to `chrome://extensions/`
4. **Enable** "Developer mode" (toggle in top-right)
5. **Click** "Load unpacked"
6. **Select** the extracted folder
7. **Done!** The extension icon should appear in your toolbar

### Method 3: Firefox

1. Download the [Firefox-specific build](https://github.com/yourusername/HowsMyPrivacy/releases)
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select any file from the extracted folder

*Note: Firefox installation is temporary. For permanent installation, we're working on getting it signed by Mozilla.*

---

## 🖼️ Screenshots

> **Add screenshots after installation:**
> 1. Install extension
> 2. Take screenshots of popup, report, and settings
> 3. Add them to a `screenshots/` folder
> 4. Update image paths below

### Main Popup
*Score display with cyberpunk terminal theme*

<!-- ![Main Popup](screenshots/popup.png) -->

### Category Details
*Expandable categories showing specific issues*

<!-- ![Category Details](screenshots/categories.png) -->

### Detailed Report
*Full HTML report with all findings*

<!-- ![Detailed Report](screenshots/report.png) -->

### Settings Page
*40+ configuration options*

<!-- ![Settings](screenshots/settings.png) -->

---

## 🎯 How It Works

1. **Click** the extension icon in your toolbar
2. **Wait** ~2 seconds while HowsMyPrivacy scans the current page
3. **View** your privacy score and category breakdown
4. **Expand** categories to see specific issues
5. **Follow** recommendations to improve your score

### What Gets Checked?

#### Cookie Privacy (20 points)
- Third-party cookie blocking
- Cookie count and management
- Tracking cookie detection

#### Tracking Protection (20 points)
- Do Not Track status
- Analytics script detection (Google Analytics, Facebook Pixel, etc.)
- Tracking pixel identification
- Ad blocker presence

#### Privacy Settings (20 points)
- WebRTC IP leak vulnerability
- HTTPS enforcement
- localStorage usage
- Sensitive API exposure (geolocation, notifications)

#### Security Headers (20 points)
- HTTPS connection verification
- Mixed content detection
- Content Security Policy validation
- Secure cookie attributes

#### Fingerprinting Protection (20 points)
- Canvas fingerprinting detection
- WebGL information exposure
- Browser uniqueness analysis
- Plugin fingerprinting

---

## 🔒 Privacy Policy

### Zero Data Collection

HowsMyPrivacy is built with privacy as the #1 priority:

- ✅ **No data collection** - We don't collect, store, or transmit any user data
- ✅ **No external API calls** - All analysis happens locally in your browser
- ✅ **No telemetry** - No usage statistics, crash reports, or analytics
- ✅ **No tracking** - Ironic for a privacy tool to track you, right?
- ✅ **Open source** - Fully auditable code

### Permissions Explained

The extension requires certain permissions to function:

- **`cookies`** - Read cookie count (not content) to analyze privacy
- **`storage`** - Store scan results and settings locally only
- **`tabs`** - Access current tab URL for scanning
- **`webRequest`** - Monitor network requests to detect tracking
- **`<all_urls>`** - Content script runs on all pages for analysis

**None of these permissions are used to collect or transmit data.**

---

## 🛠️ Development

### Tech Stack

- **Vanilla JavaScript** - No frameworks, no build process
- **Manifest V3** - Chrome's latest extension format
- **CSS3** - Modern styling with animations
- **Chrome Extension APIs** - tabs, storage, cookies, privacy

### Project Structure

```
HowsMyPrivacy/
├── icons/              # Extension icons (16, 48, 128px)
├── popup/              # Main popup interface
│   ├── popup.html
│   ├── popup.css      # Cyberpunk theme styles
│   └── popup.js       # UI logic
├── background/         # Background service worker
│   └── background.js  # Auto-scan, badge updates
├── content/            # Content script (runs on pages)
│   └── content.js     # Privacy checks
├── options/            # Settings page
│   ├── options.html
│   ├── options.css
│   └── options.js
├── report/             # Detailed report page
│   ├── report.html
│   ├── report.css
│   └── report.js
├── utils/              # Shared utilities
│   └── privacy-checker.js
├── manifest.json       # Chrome manifest (V3)
├── manifest-firefox.json  # Firefox manifest (V2)
├── README.md
├── LICENSE
├── CHANGELOG.md
└── CONTRIBUTING.md
```

### Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/HowsMyPrivacy.git
cd HowsMyPrivacy

# No build step needed! Load directly in browser

# For Chrome:
# 1. Go to chrome://extensions/
# 2. Enable Developer Mode
# 3. Load unpacked
# 4. Select the project folder

# For distribution:
zip -r HowsMyPrivacy.zip . -x "*.git*" "*.DS_Store"
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** - Open an issue with detailed steps to reproduce
- 💡 **Suggest features** - Share your ideas for improvements
- 📝 **Improve docs** - Help make documentation clearer
- 🎨 **Design** - Suggest UI/UX improvements
- 💻 **Code** - Submit pull requests

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📜 Changelog

### v1.0.0 (2026-02-04)

**Initial Release**

- Real-time privacy scoring system (0-100)
- 5 security categories with 20+ checks
- Cyberpunk terminal UI theme
- Animated score counter
- Professional colored indicators
- Detailed HTML reports
- Comprehensive settings page (40+ options)
- Chrome/Brave/Edge support
- Firefox compatibility
- Zero data collection

See [CHANGELOG.md](CHANGELOG.md) for full version history.

---

## 📞 Support

### Get Help

- 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/HowsMyPrivacy/issues)
- 📧 **Email**: support@notfoundsec.com
- 🌐 **Website**: [notfoundsec.com](https://notfoundsec.com)

### FAQ

**Q: Does this extension slow down my browser?**  
A: No. Scans run only when you click the icon (or optionally on page load), and analysis is very lightweight.

**Q: Can I use this on Firefox?**  
A: Yes! See the Firefox installation instructions above.

**Q: Will this extension send my data anywhere?**  
A: Absolutely not. Everything runs locally. Check the source code to verify!

**Q: My score is low. Is that bad?**  
A: Not necessarily. Context matters. Review the specific issues and decide which ones are important to you.

---

## 🙏 Acknowledgments

- **Built by**: [NotFoundSec](https://notfoundsec.com)
- **Inspired by**: Cyberpunk terminal aesthetics and the privacy community
- **Icon**: Privacy eye concept representing "no tracking"

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Star This Repo!

If you find HowsMyPrivacy useful, please give it a star! It helps others discover the project.

---

<div align="center">

**Made with ❤️ for privacy by [NotFoundSec](https://notfoundsec.com)**

[Report Bug](https://github.com/404yeti/howsmyprivacy/issues) • [Request Feature](https://github.com/404yeti/howsmyprivacy/issues) • [Website](https://notfoundsec.com)

</div>
