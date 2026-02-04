// HowsMyPrivacy Content Script
// Runs in the context of web pages to perform privacy checks

// Firefox compatibility
if (typeof browser !== 'undefined' && !chrome.runtime) {
  window.chrome = browser;
}

// Immediately log that script is loaded
console.log('🔒 HowsMyPrivacy: Content script loaded on', window.location.href);

// Add a property to window to verify script is injected
window.howsMyPrivacyLoaded = true;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('HowsMyPrivacy: Received message:', request);
  
  if (request.action === 'runPrivacyCheck') {
    runPrivacyCheck()
      .then(results => {
        console.log('HowsMyPrivacy: Sending results:', results);
        sendResponse(results);
      })
      .catch(error => {
        console.error('HowsMyPrivacy: Check error:', error);
        sendResponse({ 
          error: error.message,
          score: 0,
          categories: {
            cookies: { score: 0, max: 20, issues: [] },
            tracking: { score: 0, max: 20, issues: [] },
            privacy: { score: 0, max: 20, issues: [] },
            security: { score: 0, max: 20, issues: [] },
            fingerprinting: { score: 0, max: 20, issues: [] }
          }
        });
      });
    return true; // Keep message channel open for async response
  }
});

async function runPrivacyCheck() {
  console.log('HowsMyPrivacy: Starting privacy check...');
  
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
    timestamp: new Date().toISOString(),
    url: window.location.href
  };

  try {
    // Run all category checks
    await checkCookies(results.categories.cookies);
    await checkTracking(results.categories.tracking);
    await checkPrivacySettings(results.categories.privacy);
    await checkSecuritySettings(results.categories.security);
    await checkFingerprinting(results.categories.fingerprinting);

    // Calculate total score
    results.score = Object.values(results.categories).reduce((sum, cat) => sum + cat.score, 0);

    console.log('HowsMyPrivacy: Check complete. Score:', results.score);
    console.log('Categories:', results.categories);
    
    return results;
  } catch (error) {
    console.error('HowsMyPrivacy: Error during check:', error);
    // Return partial results instead of failing completely
    results.score = Object.values(results.categories).reduce((sum, cat) => sum + (cat.score || 0), 0);
    return results;
  }
}

async function checkCookies(category) {
  // Check for third-party cookies via document.cookie
  const cookieCount = document.cookie.split(';').filter(c => c.trim()).length;
  
  if (cookieCount === 0) {
    category.score += 10;
  } else if (cookieCount < 5) {
    category.score += 7;
  } else if (cookieCount < 20) {
    category.score += 4;
    category.issues.push({
      severity: 'medium',
      title: `${cookieCount} cookies from this site`,
      description: 'This website has set multiple cookies that may track your activity',
      recommendation: 'Use browser settings to limit cookies or enable automatic cookie deletion'
    });
  } else {
    category.issues.push({
      severity: 'high',
      title: `${cookieCount} cookies from this site`,
      description: 'This website has set many cookies, likely including tracking cookies',
      recommendation: 'Clear cookies regularly and consider blocking third-party cookies'
    });
  }

  // Check for tracking cookies by name patterns
  const trackingPatterns = /_ga|_gid|_fbp|__utm|_hjid/;
  const hasSuspiciousCookies = document.cookie.split(';').some(cookie => 
    trackingPatterns.test(cookie)
  );

  if (!hasSuspiciousCookies) {
    category.score += 10;
  } else {
    category.issues.push({
      severity: 'high',
      title: 'Analytics cookies detected',
      description: 'This site uses Google Analytics, Facebook Pixel, or similar tracking',
      recommendation: 'Use privacy extensions like uBlock Origin or Privacy Badger'
    });
  }
}

async function checkTracking(category) {
  // Check Do Not Track
  const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  if (dnt === '1' || dnt === 'yes') {
    category.score += 5;
  } else {
    category.issues.push({
      severity: 'medium',
      title: 'Do Not Track disabled',
      description: 'Your browser is not sending Do Not Track signals to websites',
      recommendation: 'Enable DNT in Privacy Settings (chrome://settings/privacy)'
    });
  }

  // Check for common tracking scripts
  const trackingScripts = [
    'google-analytics.com',
    'googletagmanager.com',
    'facebook.net',
    'doubleclick.net',
    'scorecardresearch.com',
    'amazon-adsystem.com'
  ];

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const foundTrackers = scripts.filter(script => 
    trackingScripts.some(tracker => script.src.includes(tracker))
  );

  if (foundTrackers.length === 0) {
    category.score += 10;
  } else {
    category.issues.push({
      severity: 'high',
      title: `${foundTrackers.length} tracking scripts found`,
      description: 'This page loads scripts from known tracking services',
      recommendation: 'Install uBlock Origin or use Brave browser for automatic blocking'
    });
  }

  // Check for beacons/pixels
  const trackingPixels = document.querySelectorAll('img[src*="analytics"], img[src*="track"], img[src*="pixel"]');
  if (trackingPixels.length === 0) {
    category.score += 5;
  } else {
    category.issues.push({
      severity: 'medium',
      title: 'Tracking pixels detected',
      description: 'This page uses invisible tracking images',
      recommendation: 'Ad blockers can prevent these tracking pixels from loading'
    });
  }
}

async function checkPrivacySettings(category) {
  // Check WebRTC
  const hasWebRTC = !!(
    window.RTCPeerConnection || 
    window.webkitRTCPeerConnection || 
    window.mozRTCPeerConnection
  );
  
  if (!hasWebRTC) {
    category.score += 5;
  } else {
    category.issues.push({
      severity: 'high',
      title: 'WebRTC enabled - IP leak risk',
      description: 'WebRTC can leak your real IP address even when using a VPN',
      recommendation: 'Use WebRTC leak prevent extension or disable in chrome://flags'
    });
  }

  // Check localStorage usage
  const localStorageSize = Object.keys(localStorage).length;
  if (localStorageSize === 0) {
    category.score += 5;
  } else if (localStorageSize < 10) {
    category.score += 3;
  } else {
    category.issues.push({
      severity: 'medium',
      title: `${localStorageSize} items in localStorage`,
      description: 'This site stores data locally that persists across sessions',
      recommendation: 'Clear site data regularly in browser settings'
    });
  }

  // Check for geolocation
  if (!navigator.geolocation) {
    category.score += 5;
  } else {
    category.score += 3;
    category.issues.push({
      severity: 'low',
      title: 'Geolocation API available',
      description: 'Sites can request your physical location',
      recommendation: 'Deny location permissions unless absolutely necessary'
    });
  }

  // Check for notification permission
  if (Notification.permission === 'denied' || Notification.permission === 'default') {
    category.score += 5;
  } else {
    category.issues.push({
      severity: 'low',
      title: 'Notifications enabled',
      description: 'This site can send you notifications',
      recommendation: 'Revoke notification permission if not needed'
    });
  }
}

async function checkSecuritySettings(category) {
  // Check HTTPS
  if (window.location.protocol === 'https:') {
    category.score += 8;
  } else {
    category.issues.push({
      severity: 'critical',
      title: 'Not using HTTPS',
      description: 'This connection is not encrypted - data can be intercepted',
      recommendation: 'Leave this site immediately and only visit HTTPS sites'
    });
  }

  // Check for mixed content
  if (window.location.protocol === 'https:') {
    const insecureResources = document.querySelectorAll(
      'img[src^="http:"], script[src^="http:"], link[href^="http:"], iframe[src^="http:"]'
    );
    
    if (insecureResources.length === 0) {
      category.score += 6;
    } else {
      category.issues.push({
        severity: 'high',
        title: 'Mixed content detected',
        description: `${insecureResources.length} insecure resources on HTTPS page`,
        recommendation: 'Avoid sites with mixed content warnings'
      });
    }
  }

  // Check Content Security Policy
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  const hasCSP = !!cspMeta;
  
  if (hasCSP) {
    category.score += 6;
  } else {
    category.issues.push({
      severity: 'medium',
      title: 'No Content Security Policy',
      description: 'Site lacks modern security headers',
      recommendation: 'This is a website issue - prefer sites with strong CSP headers'
    });
  }
}

async function checkFingerprinting(category) {
  // Check canvas fingerprinting
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Browser fingerprint', 2, 15);
    
    const dataURL = canvas.toDataURL();
    if (dataURL.length < 100) {
      category.score += 5;
    } else {
      category.issues.push({
        severity: 'medium',
        title: 'Canvas fingerprinting vulnerable',
        description: 'Your browser can be uniquely identified via canvas rendering',
        recommendation: 'Use Brave browser or Canvas Fingerprint Defender extension'
      });
    }
  } catch (error) {
    category.score += 5; // Protected if canvas access fails
  }

  // Check WebGL fingerprinting
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      category.score += 5;
    } else {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        category.issues.push({
          severity: 'medium',
          title: 'WebGL fingerprinting risk',
          description: 'WebGL reveals detailed graphics card information',
          recommendation: 'Disable WebGL or use fingerprinting protection extensions'
        });
      } else {
        category.score += 3;
      }
    }
  } catch (error) {
    category.score += 5;
  }

  // Check user agent uniqueness
  const ua = navigator.userAgent;
  const commonUAs = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X',
    'Mozilla/5.0 (X11; Linux x86_64)'
  ];
  
  const isCommonUA = commonUAs.some(common => ua.includes(common));
  if (isCommonUA) {
    category.score += 5;
  } else {
    category.issues.push({
      severity: 'low',
      title: 'Unique user agent',
      description: 'Your browser configuration is easily identifiable',
      recommendation: 'Use common browser/OS combinations'
    });
  }

  // Check plugins
  const pluginCount = navigator.plugins ? navigator.plugins.length : 0;
  if (pluginCount === 0) {
    category.score += 5;
  } else if (pluginCount < 3) {
    category.score += 3;
  } else {
    category.issues.push({
      severity: 'low',
      title: `${pluginCount} browser plugins detected`,
      description: 'Browser plugins make your fingerprint more unique',
      recommendation: 'Minimize installed browser plugins'
    });
  }
}

// Run initial check on page load
if (document.readyState === 'complete') {
  console.log('HowsMyPrivacy: Content script loaded');
} else {
  window.addEventListener('load', () => {
    console.log('HowsMyPrivacy: Content script ready');
  });
}
