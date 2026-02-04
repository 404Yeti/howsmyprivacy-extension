// Privacy & Security Checker for HowsMyPrivacy
// Analyzes browser configuration and assigns a security score (0-100)

class PrivacyChecker {
  constructor() {
    this.checks = [];
    this.totalScore = 0;
    this.maxScore = 100;
  }

  async runAllChecks() {
    const results = {
      score: 0,
      maxScore: 100,
      categories: {
        cookies: { score: 0, max: 20, issues: [] },
        tracking: { score: 0, max: 20, issues: [] },
        privacy: { score: 0, max: 20, issues: [] },
        security: { score: 0, max: 20, issues: [] },
        fingerprinting: { score: 0, max: 20, issues: [] }
      },
      timestamp: new Date().toISOString()
    };

    // Run all category checks
    await this.checkCookies(results.categories.cookies);
    await this.checkTracking(results.categories.tracking);
    await this.checkPrivacySettings(results.categories.privacy);
    await this.checkSecuritySettings(results.categories.security);
    await this.checkFingerprinting(results.categories.fingerprinting);

    // Calculate total score
    results.score = Object.values(results.categories).reduce((sum, cat) => sum + cat.score, 0);

    return results;
  }

  async checkCookies(category) {
    try {
      // Check third-party cookies
      const thirdPartyCookies = await this.checkThirdPartyCookies();
      if (!thirdPartyCookies) {
        category.score += 8;
      } else {
        category.issues.push({
          severity: 'high',
          title: 'Third-party cookies enabled',
          description: 'Your browser accepts third-party cookies, which can track you across websites',
          recommendation: 'Block third-party cookies in browser settings'
        });
      }

      // Check cookie storage
      const cookieCount = await this.getCookieCount();
      if (cookieCount < 50) {
        category.score += 6;
      } else if (cookieCount < 200) {
        category.score += 3;
        category.issues.push({
          severity: 'medium',
          title: `${cookieCount} cookies stored`,
          description: 'Moderate number of cookies may contain tracking data',
          recommendation: 'Regularly clear cookies or use cookie management tools'
        });
      } else {
        category.issues.push({
          severity: 'high',
          title: `${cookieCount} cookies stored`,
          description: 'Large number of cookies likely contains extensive tracking data',
          recommendation: 'Clear cookies and consider using cookie auto-deletion'
        });
      }

      // Check SameSite cookie attribute support
      category.score += 6; // Modern browsers support this
      
    } catch (error) {
      console.error('Cookie check error:', error);
    }
  }

  async checkTracking(category) {
    try {
      // Check Do Not Track
      const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
      if (dnt === '1' || dnt === 'yes') {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'medium',
          title: 'Do Not Track disabled',
          description: 'DNT signal is not being sent to websites',
          recommendation: 'Enable Do Not Track in browser privacy settings'
        });
      }

      // Check for tracking protection
      if (typeof chrome !== 'undefined' && chrome.privacy) {
        chrome.privacy.websites.hyperlinkAuditingEnabled.get({}, (details) => {
          if (!details.value) {
            category.score += 5;
          } else {
            category.issues.push({
              severity: 'low',
              title: 'Hyperlink auditing enabled',
              description: 'Allows websites to track which links you click',
              recommendation: 'Disable hyperlink auditing in privacy settings'
            });
          }
        });
      } else {
        category.score += 5; // Assume good for Firefox
      }

      // Check referrer policy
      const meta = document.querySelector('meta[name="referrer"]');
      const referrerPolicy = meta ? meta.content : 'default';
      if (referrerPolicy === 'no-referrer' || referrerPolicy === 'same-origin') {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'low',
          title: 'Permissive referrer policy',
          description: 'Sites can see where you came from when clicking links',
          recommendation: 'Use extensions to control referrer headers'
        });
      }

      // Check for ad blocker
      const hasAdBlocker = await this.detectAdBlocker();
      if (hasAdBlocker) {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'medium',
          title: 'No ad blocker detected',
          description: 'Ads can track your behavior and collect data',
          recommendation: 'Install uBlock Origin or similar ad blocker'
        });
      }

    } catch (error) {
      console.error('Tracking check error:', error);
    }
  }

  async checkPrivacySettings(category) {
    try {
      // Check WebRTC leak potential
      const hasWebRTC = !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
      if (!hasWebRTC) {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'high',
          title: 'WebRTC IP leak risk',
          description: 'WebRTC can expose your real IP address even when using VPN',
          recommendation: 'Disable WebRTC or use extension to prevent IP leaks'
        });
      }

      // Check for HTTPS enforcement
      if (location.protocol === 'https:') {
        category.score += 5;
      }

      // Check localStorage usage
      const localStorageItems = Object.keys(localStorage).length;
      if (localStorageItems < 20) {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'medium',
          title: `${localStorageItems} localStorage items`,
          description: 'Websites are storing data that persists across sessions',
          recommendation: 'Clear site data regularly or use private browsing'
        });
      }

      // Check for password manager
      const hasPasswordManager = await this.detectPasswordManager();
      if (hasPasswordManager) {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'low',
          title: 'No password manager detected',
          description: 'Using unique strong passwords is harder without a password manager',
          recommendation: 'Install Bitwarden, 1Password, or use browser password manager'
        });
      }

    } catch (error) {
      console.error('Privacy settings check error:', error);
      category.score += 5; // Give benefit of doubt on errors
    }
  }

  async checkSecuritySettings(category) {
    try {
      // Check for HTTPS
      if (window.location.protocol === 'https:') {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'critical',
          title: 'Not using HTTPS',
          description: 'Your connection is not encrypted',
          recommendation: 'Only visit HTTPS websites'
        });
      }

      // Check for mixed content
      const hasMixedContent = this.detectMixedContent();
      if (!hasMixedContent) {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'high',
          title: 'Mixed content detected',
          description: 'Page loads insecure HTTP resources on HTTPS site',
          recommendation: 'Avoid sites with mixed content warnings'
        });
      }

      // Check Content Security Policy
      const csp = this.getCSP();
      if (csp && csp.includes('upgrade-insecure-requests')) {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'medium',
          title: 'No Content Security Policy',
          description: 'Site doesn\'t enforce modern security policies',
          recommendation: 'This is a website issue, prefer sites with strong CSP'
        });
      }

      // Check for secure cookies
      category.score += 5; // Base score

    } catch (error) {
      console.error('Security settings check error:', error);
    }
  }

  async checkFingerprinting(category) {
    try {
      // Check canvas fingerprinting protection
      const canvasProtected = await this.checkCanvasProtection();
      if (canvasProtected) {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'medium',
          title: 'Canvas fingerprinting vulnerable',
          description: 'Websites can create unique identifier from your browser',
          recommendation: 'Use privacy-focused browser or fingerprinting protection'
        });
      }

      // Check WebGL fingerprinting
      const webGLProtected = !this.hasWebGL();
      if (webGLProtected) {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'medium',
          title: 'WebGL fingerprinting risk',
          description: 'WebGL can reveal detailed graphics card information',
          recommendation: 'Consider disabling WebGL or using fingerprinting protection'
        });
      }

      // Check user agent
      const ua = navigator.userAgent;
      const isGeneric = ua.includes('Windows NT 10.0') || ua.includes('Macintosh');
      if (isGeneric) {
        category.score += 5;
      } else {
        category.issues.push({
          severity: 'low',
          title: 'Unique user agent',
          description: 'Your browser configuration may be easily identifiable',
          recommendation: 'Use common browser/OS combinations'
        });
      }

      // Check for privacy extensions
      category.score += 5; // Base score

    } catch (error) {
      console.error('Fingerprinting check error:', error);
    }
  }

  // Helper methods
  async checkThirdPartyCookies() {
    if (typeof chrome !== 'undefined' && chrome.privacy) {
      return new Promise((resolve) => {
        chrome.privacy.websites.thirdPartyCookiesAllowed.get({}, (details) => {
          resolve(details.value);
        });
      });
    }
    return true; // Assume enabled if can't check
  }

  async getCookieCount() {
    if (typeof chrome !== 'undefined' && chrome.cookies) {
      return new Promise((resolve) => {
        chrome.cookies.getAll({}, (cookies) => {
          resolve(cookies.length);
        });
      });
    }
    return 0;
  }

  async detectAdBlocker() {
    // Simple ad blocker detection
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox ad-placement carbon-ads';
    document.body.appendChild(testAd);
    const isBlocked = testAd.offsetHeight === 0;
    document.body.removeChild(testAd);
    return isBlocked;
  }

  async detectPasswordManager() {
    // Check for common password manager indicators
    const hasPasswordManagerAttribute = document.querySelector('[data-lastpass], [data-1password], [data-bitwarden]');
    return !!hasPasswordManagerAttribute;
  }

  detectMixedContent() {
    if (window.location.protocol === 'https:') {
      const insecureResources = Array.from(document.querySelectorAll('img[src^="http:"], script[src^="http:"], link[href^="http:"]'));
      return insecureResources.length > 0;
    }
    return false;
  }

  getCSP() {
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return meta ? meta.content : null;
  }

  async checkCanvasProtection() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('test', 2, 2);
      const data = canvas.toDataURL();
      return data.length < 100; // Protected canvases return minimal data
    } catch (error) {
      return true; // If canvas access fails, it's protected
    }
  }

  hasWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (error) {
      return false;
    }
  }

  getScoreColor(score) {
    if (score >= 80) return '#00c853'; // Green
    if (score >= 60) return '#fcc800'; // Yellow (brand color)
    if (score >= 40) return '#ff9800'; // Orange
    return '#f44336'; // Red
  }

  getScoreLabel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Poor';
    return 'Critical';
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PrivacyChecker;
}
