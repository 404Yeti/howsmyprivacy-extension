# Changelog

All notable changes to HowsMyPrivacy Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Options/settings page
- Detailed HTML report generation
- Historical score tracking
- Site comparison feature
- Export results (PDF/JSON)

## [1.0.0] - 2026-02-04

### Added
- Initial release of HowsMyPrivacy extension
- Real-time privacy and security scoring (0-100)
- Five category analysis system:
  - Cookie Privacy (20 pts)
  - Tracking Protection (20 pts)
  - Privacy Settings (20 pts)
  - Security Headers (20 pts)
  - Fingerprinting Protection (20 pts)
- Wappalyzer-inspired popup interface
- Expandable category details with issues and recommendations
- Visual score ring with color coding:
  - Green (Excellent: 80-100)
  - Yellow (Good: 60-79)
  - Orange (Fair: 40-59)
  - Red (Poor/Critical: 0-39)
- Auto-scan on page load
- Manual refresh capability
- Browser toolbar badge with quick score
- Context menu integration (right-click)
- Desktop notifications for scan results
- Chrome/Chromium support (Manifest V3)
- Firefox support (Manifest V2)
- Brand colors (#fcc800 yellow, #0a0a0a black)

### Privacy Checks Implemented
- Third-party cookie detection
- Cookie count analysis
- Tracking script identification (Google Analytics, Facebook Pixel, etc.)
- Do Not Track status
- Ad blocker detection
- WebRTC IP leak vulnerability
- Canvas fingerprinting detection
- WebGL fingerprinting detection
- HTTPS enforcement
- Mixed content detection
- Content Security Policy validation
- localStorage usage monitoring
- Geolocation API exposure
- Notification permission status
- Browser plugin fingerprinting
- User agent uniqueness analysis

### Documentation
- Comprehensive README.md
- Quick Start Guide (QUICKSTART.md)
- Contributing Guidelines (CONTRIBUTING.md)
- Project Summary (PROJECT_SUMMARY.md)
- MIT License

### Build Tools
- Chrome build script
- Firefox build script
- package.json for project metadata
- Distribution preparation scripts

## Version History

### v1.0.0 (2026-02-04)
Initial public release with core privacy analysis features.

---

## Release Notes Template

When creating a new release, include:

### [X.Y.Z] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes in existing functionality

#### Deprecated
- Soon-to-be removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Security improvements

---

**Legend:**
- `Added` - New features
- `Changed` - Changes to existing features
- `Deprecated` - Features that will be removed
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security-related changes
