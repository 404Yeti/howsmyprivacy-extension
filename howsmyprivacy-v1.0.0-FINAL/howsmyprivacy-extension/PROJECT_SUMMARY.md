# HowsMyPrivacy Extension - Project Summary

## Overview

HowsMyPrivacy is a browser extension that provides real-time privacy and security analysis with a 0-100 scoring system. It's designed to help users understand and improve their browser's privacy posture.

## Design Philosophy

### User Experience
- **Wappalyzer-inspired UI**: Familiar popup interface
- **Quick snapshot**: Instant score visibility
- **Expandable details**: Deep dive on demand
- **Actionable insights**: Specific recommendations, not just problems

### Technical Approach
- **Zero dependencies**: Pure JavaScript, no frameworks
- **Client-side only**: No data leaves the browser
- **Manifest V3 ready**: Future-proof for Chrome
- **Cross-browser compatible**: Chrome and Firefox support

## Architecture

### Component Overview

```
┌─────────────────────────────────────────┐
│          Browser Toolbar                │
│  [HowsMyPrivacy Icon + Badge]          │
└─────────────────────────────────────────┘
                  │
                  ↓ (user clicks)
┌─────────────────────────────────────────┐
│          Popup Interface                 │
│  - Score Display (0-100)                │
│  - 5 Category Breakdown                 │
│  - Issue Details & Recommendations      │
└─────────────────────────────────────────┘
                  │
                  ↓ (requests scan)
┌─────────────────────────────────────────┐
│       Content Script (Page)             │
│  - Runs privacy checks                  │
│  - Analyzes DOM, cookies, scripts      │
│  - Returns results                      │
└─────────────────────────────────────────┘
                  │
                  ↓ (stores results)
┌─────────────────────────────────────────┐
│      Background Service Worker          │
│  - Auto-scan on page load              │
│  - Manage storage                       │
│  - Update badge                         │
│  - Send notifications                   │
└─────────────────────────────────────────┘
```

### File Structure

```
howsmyprivacy-extension/
│
├── manifest.json                  # Chrome configuration
├── manifest-firefox.json          # Firefox configuration
│
├── popup/                         # User interface
│   ├── popup.html                # Structure
│   ├── popup.css                 # Styling (brand colors)
│   └── popup.js                  # UI logic & interaction
│
├── background/                    # Background processes
│   └── background.js             # Service worker (auto-scan, badge)
│
├── content/                       # Page-level scripts
│   └── content.js                # Privacy checks (runs on websites)
│
├── utils/                         # Shared utilities
│   └── privacy-checker.js        # Check algorithms (optional)
│
├── icons/                         # Extension icons
│   ├── icon16.png                # Toolbar icon
│   ├── icon48.png                # Extension management
│   └── icon128.png               # Web store
│
├── scripts/                       # Build automation
│   ├── build-chrome.sh           # Chrome build
│   └── build-firefox.sh          # Firefox build
│
├── README.md                      # Main documentation
├── QUICKSTART.md                  # Quick start guide
├── CONTRIBUTING.md                # Contribution guidelines
├── LICENSE                        # MIT License
└── package.json                   # Project metadata
```

## Privacy Check Categories

### 1. Cookie Privacy (20 points)

**Checks:**
- Third-party cookie blocking (8 pts)
- Total cookie count (6 pts)
- Tracking cookie patterns (6 pts)

**Detections:**
- Google Analytics cookies (_ga, _gid)
- Facebook Pixel (_fbp)
- UTM tracking parameters
- Cookie count and age

**Recommendations:**
- Block third-party cookies
- Clear cookies regularly
- Use cookie auto-deletion

### 2. Tracking Protection (20 points)

**Checks:**
- Do Not Track header (5 pts)
- Tracking script detection (5 pts)
- Tracking pixels (5 pts)
- Ad blocker presence (5 pts)

**Detections:**
- Google Analytics scripts
- Facebook tracking
- Advertising networks
- Analytics pixels

**Recommendations:**
- Enable Do Not Track
- Install uBlock Origin
- Use tracking protection
- Block advertising scripts

### 3. Privacy Settings (20 points)

**Checks:**
- WebRTC leak protection (5 pts)
- HTTPS enforcement (5 pts)
- localStorage usage (5 pts)
- Sensitive APIs (5 pts)

**Detections:**
- WebRTC availability
- Geolocation API
- Notification permissions
- localStorage data

**Recommendations:**
- Disable WebRTC
- Use HTTPS only
- Manage site permissions
- Clear site data

### 4. Security Headers (20 points)

**Checks:**
- HTTPS connection (8 pts)
- Mixed content (6 pts)
- Content Security Policy (6 pts)

**Detections:**
- HTTP vs HTTPS
- Insecure resources
- CSP headers
- Security headers

**Recommendations:**
- Use HTTPS everywhere
- Avoid mixed content
- Check site security
- Use secure sites

### 5. Fingerprinting Protection (20 points)

**Checks:**
- Canvas fingerprinting (5 pts)
- WebGL fingerprinting (5 pts)
- User agent uniqueness (5 pts)
- Browser plugins (5 pts)

**Detections:**
- Canvas rendering
- WebGL renderer info
- Unique user agents
- Plugin counts

**Recommendations:**
- Use fingerprint protection
- Disable WebGL
- Use common configurations
- Minimize plugins

## Scoring Algorithm

### Total Score Calculation
```javascript
totalScore = cookieScore + trackingScore + 
             privacyScore + securityScore + 
             fingerprintingScore

// Range: 0-100
```

### Score Thresholds
- **80-100**: Excellent (Green)
- **60-79**: Good (Yellow/Brand)
- **40-59**: Fair (Orange)
- **20-39**: Poor (Red)
- **0-19**: Critical (Red)

### Issue Severity Levels
- **Critical**: Immediate security risk (e.g., HTTP site)
- **High**: Significant privacy concern (e.g., tracking scripts)
- **Medium**: Moderate issue (e.g., many cookies)
- **Low**: Minor improvement (e.g., hyperlink auditing)

## Brand Guidelines

### Colors
```css
--brand-yellow: #fcc800  /* Primary: Buttons, highlights, badges */
--brand-black: #0a0a0a   /* Secondary: Text, backgrounds, headers */
--white: #ffffff         /* Backgrounds, text on dark */
--green: #00c853        /* Excellent scores */
--orange: #ff9800       /* Fair scores */
--red: #f44336          /* Poor scores */
```

### Typography
- **Font Family**: System fonts (-apple-system, Segoe UI, Roboto)
- **Headers**: 700 weight, uppercase for section titles
- **Body**: 400-600 weight
- **Scores**: 700 weight, large size

### UI Elements
- **Border Radius**: 8px for cards, 4-6px for buttons
- **Spacing**: 16-20px for sections, 8-12px for elements
- **Shadows**: Subtle on hover, prominent when active
- **Animations**: 0.3s ease for transitions

## Browser API Usage

### Chrome APIs
```javascript
chrome.tabs          // Tab management and messaging
chrome.storage       // Result persistence
chrome.cookies       // Cookie inspection
chrome.privacy       // Privacy settings access
chrome.notifications // Desktop notifications
chrome.contextMenus  // Right-click menu
chrome.action        // Toolbar icon and badge
```

### Firefox Differences
- Manifest V2 (vs V3 for Chrome)
- `browser.*` API prefix
- Different permission model
- Temporary loading process

## Data Flow

### 1. Page Load (Auto-scan)
```
Page loads → Background detects → 
Wait 2s → Send message to content script →
Content runs checks → Return results →
Background updates badge → Store results
```

### 2. Manual Scan (Popup)
```
User clicks icon → Popup opens →
Load cached results → Display score →
User clicks refresh → Send message to content →
Content runs checks → Return results →
Popup updates display → Store results
```

### 3. Category Expansion
```
User clicks category → Category expands →
Display issues list → Show recommendations →
User reads details → Can collapse again
```

## Storage Schema

### chrome.storage.local
```javascript
{
  // Last scan results
  "lastResults": {
    score: 85,
    categories: { ... },
    timestamp: "2026-02-04T12:00:00Z",
    url: "https://example.com"
  },
  
  // Per-tab results (temporary)
  "results_123": { ... },  // tabId 123
  "results_456": { ... },  // tabId 456
  
  // Settings
  "autoScan": true,
  "showBadge": true,
  "notifications": true,
  
  // Timestamps
  "lastScan": "2026-02-04T12:00:00Z"
}
```

## Performance Considerations

### Optimization Strategies
1. **Debouncing**: Wait 2s after page load before scanning
2. **Caching**: Store results per tab, reuse when popup reopens
3. **Lazy Loading**: Only expand categories when clicked
4. **Minimal DOM**: Small popup, simple checks
5. **Async Operations**: Non-blocking checks with promises

### Resource Usage
- **Memory**: ~5-10MB (popup + background)
- **CPU**: Minimal (checks run once per page)
- **Network**: Zero (all checks are local)

## Security & Privacy

### Data Privacy
- **No external servers**: All analysis is local
- **No telemetry**: No usage tracking
- **No user data collection**: Zero data leaves browser
- **Open source**: Code is auditable

### Permissions Justification
- `cookies`: Read cookie count and attributes
- `storage`: Store scan results locally
- `tabs`: Query active tab URL
- `webRequest`: Monitor network requests
- `privacy`: Access privacy settings
- `<all_urls>`: Content script runs on all pages

## Future Enhancements

### Version 1.1 (Next)
- [ ] Settings/options page
- [ ] Detailed HTML report
- [ ] Export results as PDF/JSON
- [ ] Historical score tracking
- [ ] Site comparison mode

### Version 1.2
- [ ] VPN/proxy detection
- [ ] Browser fingerprint uniqueness score
- [ ] Recommended extensions list
- [ ] One-click fix buttons
- [ ] Privacy recommendations API

### Version 2.0
- [ ] Multi-language support (i18n)
- [ ] Custom scoring weights
- [ ] Privacy coach mode
- [ ] Browser sync
- [ ] Advanced fingerprinting tests

## Testing Strategy

### Manual Testing
1. Load on different websites
2. Test each category's checks
3. Verify score calculations
4. Test UI interactions
5. Check badge updates
6. Verify auto-scan

### Browser Testing
- Chrome (latest)
- Edge (latest)
- Brave (latest)
- Firefox (latest)

### Test Websites
- High privacy: DuckDuckGo, ProtonMail
- Medium privacy: Wikipedia, GitHub
- Low privacy: Facebook, Google
- Tracking-heavy: News sites, blogs

## Distribution

### Chrome Web Store
1. Create developer account ($5 fee)
2. Prepare store listing:
   - Title: "HowsMyPrivacy"
   - Description: Privacy scoring tool
   - Screenshots: 1280x800px or 640x400px
   - Icons: 128x128px
3. Upload ZIP package
4. Submit for review (2-3 days)

### Firefox Add-ons (AMO)
1. Create AMO account (free)
2. Prepare listing:
   - Name: "HowsMyPrivacy"
   - Summary: One-line description
   - Screenshots: Any size
   - Icon: 128x128px
3. Upload XPI package
4. Submit for review (1-2 weeks)

### GitHub Releases
1. Tag version: `git tag v1.0.0`
2. Create release notes
3. Attach ZIP files
4. Publish release

## License

MIT License - see LICENSE file

## Credits

- **Created by**: NotFoundSec
- **Inspired by**: Wappalyzer UI/UX
- **Built for**: Privacy-conscious users
- **Community**: Open source contributors

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Status**: Production Ready (pending icons)
