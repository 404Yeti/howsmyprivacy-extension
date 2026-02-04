# Quick Start Guide - HowsMyPrivacy Extension

Get up and running in 5 minutes! 🚀

## Step 1: Get the Icons

Before loading the extension, you need icon files. Choose one option:

### Option A: Use a Generator (Fastest)
1. Go to [favicon.io/favicon-converter](https://favicon.io/favicon-converter/)
2. Create a simple design with:
   - Yellow (#fcc800) shield or lock
   - Black (#0a0a0a) background
3. Download and extract to `icons/` folder
4. Rename files to: `icon16.png`, `icon48.png`, `icon128.png`

### Option B: Use ImageMagick
```bash
cd icons/

# Create a simple yellow shield on black background
convert -size 128x128 xc:'#0a0a0a' \
  -fill '#fcc800' \
  -draw "polygon 64,20 100,50 100,100 64,120 28,100 28,50" \
  icon128.png

# Resize for other sizes
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
```

### Option C: Use Placeholder
```bash
cd icons/

# Create simple colored squares as placeholders
convert -size 128x128 xc:'#fcc800' icon128.png
convert -size 48x48 xc:'#fcc800' icon48.png
convert -size 16x16 xc:'#fcc800' icon16.png
```

## Step 2: Load Extension in Chrome

1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Toggle **"Developer mode"** ON (top right)
4. Click **"Load unpacked"**
5. Select the `howsmyprivacy-extension` folder
6. Done! ✓

You should now see the HowsMyPrivacy icon in your toolbar.

## Step 3: Run Your First Scan

1. **Visit any website** (try google.com, facebook.com, etc.)
2. **Click the extension icon** in your toolbar
3. **Wait a moment** while the scan completes
4. **View your score!** (0-100)

## Step 4: Explore Features

### View Details
- Click any category to expand and see specific issues
- Each issue shows:
  - Severity level (Critical, High, Medium, Low)
  - What the problem is
  - How to fix it

### Manual Refresh
- Click the refresh icon (↻) to re-scan

### Context Menu
- Right-click on any page
- Select "Scan page privacy"

### Badge Indicator
- Small badge on icon shows quick score
- Green checkmark (✓) = Excellent (80-100)
- Yellow number = Good/Fair (40-79)
- Red exclamation (!) = Poor (0-39)

## Understanding Your Score

### Score Ranges
- **80-100**: 🟢 Excellent - Keep it up!
- **60-79**: 🟡 Good - A few improvements recommended
- **40-59**: 🟠 Fair - Several issues to address
- **20-39**: 🔴 Poor - Multiple vulnerabilities
- **0-19**: 🔴 Critical - Immediate action needed!

### Score Categories

Each category is worth 20 points:

1. **🍪 Cookie Privacy** (20 pts)
   - Checks third-party cookies
   - Monitors cookie count
   - Validates cookie security

2. **👁️ Tracking Protection** (20 pts)
   - Do Not Track status
   - Tracking script detection
   - Ad blocker presence

3. **🔒 Privacy Settings** (20 pts)
   - WebRTC leaks
   - HTTPS usage
   - localStorage limits

4. **🛡️ Security Headers** (20 pts)
   - HTTPS enforcement
   - Mixed content checks
   - Content Security Policy

5. **🎭 Fingerprinting** (20 pts)
   - Canvas protection
   - WebGL exposure
   - Browser uniqueness

## Common Issues & Quick Fixes

### Low Score?

**Issue**: Third-party cookies enabled
- **Fix**: Chrome Settings → Privacy → Cookies → Block third-party cookies

**Issue**: No ad blocker detected
- **Fix**: Install [uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/)

**Issue**: WebRTC IP leak
- **Fix**: Install [WebRTC Leak Prevent](https://chrome.google.com/webstore/detail/webrtc-leak-prevent/)

**Issue**: Do Not Track disabled
- **Fix**: Chrome Settings → Privacy → Send "Do Not Track" request

### Extension Not Working?

**Icon not appearing**
- Check that icons exist in `icons/` folder
- Reload extension in `chrome://extensions/`

**Scan not running**
- Open Developer Tools (F12)
- Check Console for errors
- Verify website allows extension access

**Badge not showing**
- Wait for page to fully load
- Try manual refresh in popup
- Check auto-scan is enabled (coming in settings)

## Tips for Better Privacy

1. **Use HTTPS Everywhere**
   - Only visit HTTPS sites
   - Install HTTPS Everywhere extension

2. **Block Tracking**
   - Use uBlock Origin
   - Enable tracking protection
   - Use Privacy Badger

3. **Manage Cookies**
   - Block third-party cookies
   - Clear cookies regularly
   - Use automatic cookie deletion

4. **Protect Fingerprinting**
   - Use Firefox's fingerprint protection
   - Consider Brave browser
   - Disable WebGL if not needed

5. **Use Privacy-Focused Tools**
   - DuckDuckGo for search
   - Proton services for email
   - Signal for messaging

## For Firefox Users

1. **Use Firefox manifest**:
   ```bash
   mv manifest.json manifest-chrome.json
   mv manifest-firefox.json manifest.json
   ```

2. **Load extension**:
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select any file in the extension folder

3. **Differences**:
   - Firefox has better built-in tracking protection
   - Some checks work differently in Firefox
   - Scores may vary slightly

## Next Steps

- Explore different websites to compare scores
- Click categories to learn about specific issues
- Implement recommendations for better privacy
- Share your scores with friends!

## Need Help?

- **Documentation**: See main README.md
- **Issues**: [GitHub Issues](https://github.com/yourusername/howsmyprivacy-extension/issues)
- **Website**: [NotFoundSec.com](https://notfoundsec.com)

---

**Happy Private Browsing! 🔒**
