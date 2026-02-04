# HowsMyPrivacy Extension - Deployment Guide

Complete guide to deploying your extension to production.

## 📋 Pre-Deployment Checklist

### Required Items
- [ ] Extension icons created (16x16, 48x48, 128x128)
- [ ] All code tested in both Chrome and Firefox
- [ ] No console errors
- [ ] README.md completed
- [ ] LICENSE file included
- [ ] Version number finalized in manifests
- [ ] Privacy policy created (if required)
- [ ] Store screenshots prepared

### Testing Checklist
- [ ] Tested on 10+ different websites
- [ ] All categories show correct scores
- [ ] Badge updates properly
- [ ] Auto-scan works
- [ ] Manual refresh works
- [ ] Categories expand/collapse
- [ ] Issues display correctly
- [ ] No memory leaks
- [ ] Works in incognito mode
- [ ] Context menu functions

## 🎨 Creating Icons (Required!)

You MUST create icons before deployment. Choose one method:

### Method 1: Online Generator (Easiest)
1. Visit [favicon.io/favicon-converter](https://favicon.io/favicon-converter/)
2. Design with brand colors:
   - Background: #0a0a0a (black)
   - Foreground: #fcc800 (yellow)
   - Design: Shield or lock symbol
3. Download and extract
4. Rename to: icon16.png, icon48.png, icon128.png
5. Copy to `icons/` folder

### Method 2: Figma/Canva (Professional)
1. Create 128x128px artboard
2. Design icon with shield/lock
3. Use brand colors (#fcc800, #0a0a0a)
4. Export as PNG at 128x128
5. Resize to 48x48 and 16x16
6. Save all to `icons/` folder

### Method 3: ImageMagick (Quick)
```bash
cd icons/

# Create simple yellow shield on black
convert -size 128x128 xc:'#0a0a0a' \
  -fill '#fcc800' \
  -draw "polygon 64,20 100,50 100,100 64,120 28,100 28,50" \
  icon128.png

# Resize for other sizes
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
```

## 📸 Store Screenshots

### Requirements
- **Chrome Web Store**: 1280x800 or 640x400
- **Firefox AMO**: Any size (recommend 1280x800)
- **Number needed**: 3-5 screenshots

### What to Capture
1. **Main popup** showing excellent score
2. **Category expanded** with issues
3. **Fair/poor score** example
4. **Badge indicator** in toolbar
5. **Multiple categories** expanded

### How to Capture
```bash
# Use browser screenshot tools
# Or command line:
# Chrome DevTools: Cmd+Shift+P → "Screenshot"
# Firefox: Right-click → "Take Screenshot"
```

## 🏪 Chrome Web Store Deployment

### Step 1: Developer Account
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pay $5 one-time registration fee
3. Complete developer profile

### Step 2: Build Package
```bash
# Create distribution build
cd howsmyprivacy-extension
bash scripts/build-chrome.sh

# Package as ZIP
cd dist/chrome
zip -r ../../howsmyprivacy-chrome-v1.0.0.zip .
```

### Step 3: Store Listing

**Required Information:**
- **Extension Name**: HowsMyPrivacy
- **Summary**: Privacy and security scoring for your browser (132 chars max)
- **Description**: See template below
- **Category**: Productivity
- **Language**: English (United States)

**Description Template:**
```
HowsMyPrivacy provides real-time privacy and security analysis for your browser.

KEY FEATURES:
• Real-time privacy scoring (0-100)
• 5 comprehensive security categories
• Detailed issue detection and recommendations
• Auto-scan on page load
• Visual score ring and badge indicator
• Zero data collection - 100% local analysis

PRIVACY CATEGORIES:
🍪 Cookie Privacy - Third-party tracking
👁️ Tracking Protection - Analytics & ads
🔒 Privacy Settings - WebRTC, HTTPS
🛡️ Security Headers - CSP, mixed content
🎭 Fingerprinting - Canvas, WebGL

Perfect for privacy-conscious users who want to understand and improve their browser security posture.

NO DATA COLLECTION - All analysis happens locally in your browser.
```

**Required Assets:**
- **Icon**: 128x128 PNG (your icon128.png)
- **Small tile**: 440x280 PNG (design from icon)
- **Screenshots**: 3-5 images (1280x800)
- **Promotional tile**: 1400x560 PNG (optional but recommended)

### Step 4: Privacy & Permissions

**Privacy Policy** (if you have a website):
```
Privacy Policy URL: https://notfoundsec.com/howsmyprivacy/privacy

OR paste inline:

HowsMyPrivacy Privacy Policy

Data Collection: None
We do not collect, store, or transmit any user data.

Analysis: Local Only  
All privacy checks happen locally in your browser.

Third-Party Services: None
No external APIs or services are used.

Permissions:
- cookies: Read cookie count (not content)
- storage: Store results locally only
- tabs: Access current tab URL
- webRequest: Monitor network requests
- privacy: Read privacy settings

Contact: support@notfoundsec.com
Last Updated: February 4, 2026
```

**Permission Justifications**:
For each permission, explain why:

- `cookies`: "Required to count cookies and detect tracking cookies"
- `storage`: "Store scan results locally in browser"
- `tabs`: "Access current page URL for analysis"
- `webRequest`: "Detect tracking scripts and resources"
- `privacy`: "Check browser privacy settings status"
- `<all_urls>`: "Content script analyzes privacy on all websites"

### Step 5: Submit
1. Upload ZIP file
2. Complete store listing
3. Add screenshots
4. Set pricing (free)
5. Select regions (Worldwide)
6. Submit for review

**Review Time**: 2-5 business days

## 🦊 Firefox Add-ons (AMO) Deployment

### Step 1: Developer Account
1. Go to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
2. Create free account
3. Accept agreements

### Step 2: Build Package
```bash
# Create Firefox build
cd howsmyprivacy-extension
bash scripts/build-firefox.sh

# Package as ZIP (will be renamed to XPI)
cd dist/firefox
zip -r ../../howsmyprivacy-firefox-v1.0.0.zip .
```

### Step 3: Submit Add-on

1. Go to [Submit Add-on](https://addons.mozilla.org/developers/addon/submit/)
2. Upload ZIP file
3. Firefox will auto-validate

**Required Information:**
- **Name**: HowsMyPrivacy
- **Slug**: howsmyprivacy
- **Summary**: Browser privacy and security scoring tool (max 250 chars)
- **Categories**: Privacy & Security, Web Development
- **Tags**: privacy, security, tracking, fingerprinting, cookies

**Description** (supports Markdown):
```markdown
# HowsMyPrivacy

Real-time privacy and security analysis for your browser with 0-100 scoring.

## Features

- **Real-time Scoring**: Instant privacy score (0-100)
- **5 Categories**: Comprehensive analysis across:
  - Cookie Privacy
  - Tracking Protection  
  - Privacy Settings
  - Security Headers
  - Fingerprinting Protection
- **Detailed Issues**: Specific problems with actionable fixes
- **Auto-scan**: Automatic analysis on page load
- **Zero Tracking**: All analysis is local, no data sent anywhere

## Privacy Guarantee

HowsMyPrivacy does not collect, store, or transmit any user data. All analysis happens locally in your browser.

## Support

- Website: https://notfoundsec.com
- Issues: https://github.com/yourusername/howsmyprivacy-extension/issues
```

**Version Notes**:
```
Initial release (v1.0.0)
- Privacy scoring system
- 5 category analysis
- Issue detection and recommendations
- Auto-scan capability
```

### Step 4: Source Code

Firefox requires source code for review if using minification/compilation.

Since we use vanilla JS (no build process):
- Select "Source code is included in the add-on" in submission

### Step 5: License

- Select "MIT License" (or your choice)
- Provide link to LICENSE file in repo

### Step 6: Review Process

**Timeline**: 1-2 weeks for initial review
- Auto-validation checks immediately
- Manual review by Mozilla staff
- May request changes

## 🚀 GitHub Release

### Create Release

```bash
# Tag version
git tag -a v1.0.0 -m "Initial release - HowsMyPrivacy Extension"
git push origin v1.0.0

# Or via GitHub interface:
# 1. Go to repository
# 2. Click "Releases"
# 3. Click "Create a new release"
```

### Release Information

**Tag**: v1.0.0
**Title**: HowsMyPrivacy v1.0.0 - Initial Release

**Description**:
```markdown
# HowsMyPrivacy v1.0.0

Browser extension for real-time privacy and security analysis.

## 🎉 Initial Release Features

- Real-time privacy scoring (0-100)
- 5 comprehensive security categories
- Detailed issue detection
- Actionable recommendations
- Auto-scan on page load
- Visual score indicators
- Chrome/Firefox support

## 📦 Downloads

- [Chrome Extension](./howsmyprivacy-chrome-v1.0.0.zip)
- [Firefox Add-on](./howsmyprivacy-firefox-v1.0.0.zip)

## 🏪 Store Links

- [Chrome Web Store](link-after-approval)
- [Firefox Add-ons](link-after-approval)

## 📖 Documentation

See [README.md](./README.md) for installation and usage instructions.

## 🐛 Known Issues

None at release.

## 🙏 Acknowledgments

Thanks to the privacy community for feedback and testing!
```

**Attachments**:
- howsmyprivacy-chrome-v1.0.0.zip
- howsmyprivacy-firefox-v1.0.0.zip
- Source code (auto-attached)

## 📣 Marketing & Launch

### Landing Page (Optional)
Create page on notfoundsec.com with:
- Extension overview
- Screenshots/demo
- Install links
- Privacy policy
- Support info

### Social Media Announcement
```
🚀 Just launched HowsMyPrivacy - a browser extension that gives you a real-time privacy score (0-100) for your browser!

✅ 5 comprehensive security categories
✅ Detailed issue detection
✅ Actionable recommendations  
✅ Zero data collection

Get it now:
Chrome: [link]
Firefox: [link]

#privacy #cybersecurity #infosec
```

### Communities to Share
- r/privacy (Reddit)
- r/cybersecurity (Reddit)
- Hacker News (news.ycombinator.com)
- Privacy-focused forums
- InfoSec Twitter/Mastodon
- LinkedIn

## 📊 Post-Launch

### Monitor

**Metrics to track:**
- Install count
- Ratings/reviews
- Crash reports (if any)
- User feedback
- GitHub issues

**Response Plan:**
- Respond to reviews within 48 hours
- Fix critical bugs within 1 week
- Address feature requests in roadmap

### Update Schedule

**Patch releases (1.0.x)**: Bug fixes, no new features
**Minor releases (1.x.0)**: New features, backwards compatible
**Major releases (x.0.0)**: Breaking changes

### Version Updates

When releasing updates:

1. Update version in manifests
2. Update CHANGELOG.md
3. Test thoroughly
4. Build packages
5. Submit to stores
6. Create GitHub release
7. Announce update

## ⚠️ Common Issues

### Rejection Reasons

**Chrome:**
- Misleading description
- Excessive permissions
- Privacy policy missing
- Screenshots don't match

**Firefox:**
- Code obfuscation
- Unnecessary permissions
- Privacy concerns
- Trademark issues

### How to Appeal
- Read rejection reason carefully
- Make requested changes
- Resubmit with explanation
- Contact store support if unfair

## 🎯 Success Checklist

- [ ] Icons created and look professional
- [ ] Tested on 10+ websites
- [ ] Zero console errors
- [ ] Screenshots captured
- [ ] Store listings completed
- [ ] Privacy policy written
- [ ] Packages built (Chrome & Firefox)
- [ ] Chrome Web Store submitted
- [ ] Firefox AMO submitted  
- [ ] GitHub release created
- [ ] Landing page created (optional)
- [ ] Social media announced
- [ ] Communities notified

## 📞 Support

If you need help:
- Check store documentation
- Read rejection emails carefully
- Ask in developer communities
- Contact store support

---

**Good luck with your launch! 🚀**

**Questions?** support@notfoundsec.com
