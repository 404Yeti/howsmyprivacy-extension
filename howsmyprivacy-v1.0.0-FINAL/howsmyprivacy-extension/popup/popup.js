// HowsMyPrivacy Popup Script

// Firefox compatibility - use browser API if chrome API is not available
if (typeof browser !== 'undefined' && !chrome.runtime) {
  window.chrome = browser;
}

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize popup
  await loadResults();
  
  // Set up event listeners
  setupEventListeners();
});

function setupEventListeners() {
  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', async () => {
    await runScan();
  });

  // Category toggles
  document.querySelectorAll('.category').forEach(category => {
    category.querySelector('.category-header').addEventListener('click', () => {
      category.classList.toggle('expanded');
    });
  });

  // Detailed report button
  document.getElementById('detailedReportBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('report/report.html') });
  });

  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

async function runScan() {
  try {
    // Show loading state
    document.querySelector('.container').classList.add('loading');
    document.getElementById('scoreValue').textContent = '--';
    document.getElementById('scoreLabel').textContent = 'Scanning...';

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    console.log('Active tab:', tab.id, tab.url);

    // Check if tab is accessible
    if (!tab || !tab.id) {
      throw new Error('No active tab found');
    }

    // Check if on a restricted page
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:') || tab.url.startsWith('moz-extension://')) {
      showError('Cannot scan browser internal pages. Please visit a regular website.');
      document.querySelector('.container').classList.remove('loading');
      return;
    }

    // Send message to content script to run checks
    let results;
    try {
      results = await chrome.tabs.sendMessage(tab.id, { action: 'runPrivacyCheck' });
    } catch (msgError) {
      console.error('❌ Message error:', msgError);
      // Content script might not be injected yet, try injecting it
      try {
        console.log('💉 Attempting to inject content script...');
        // Firefox Manifest V2 uses tabs.executeScript
        await chrome.tabs.executeScript(tab.id, { file: 'content/content.js' });
        console.log('✅ Content script injected, waiting...');
        // Wait for script to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Try again
        console.log('📨 Retrying message send...');
        results = await chrome.tabs.sendMessage(tab.id, { action: 'runPrivacyCheck' });
        console.log('✅ Received results after injection');
      } catch (injectError) {
        console.error('❌ Injection error:', injectError);
        throw new Error('Could not communicate with page. Error: ' + injectError.message);
      }
    }

    if (!results || results.error) {
      throw new Error(results?.error || 'Invalid results from scan');
    }

    // Store results
    await chrome.storage.local.set({
      lastResults: results,
      lastScan: new Date().toISOString()
    });

    // Display results
    displayResults(results);

    // Remove loading state
    document.querySelector('.container').classList.remove('loading');
  } catch (error) {
    console.error('Scan error:', error);
    showError(error.message || 'Failed to scan. Please refresh the page and try again.');
    document.querySelector('.container').classList.remove('loading');
  }
}

async function loadResults() {
  try {
    console.log('📂 Loading cached results...');
    const { lastResults, lastScan } = await chrome.storage.local.get(['lastResults', 'lastScan']);

    console.log('📂 Cached results:', lastResults);

    // Validate lastResults structure
    if (lastResults && lastResults.categories && typeof lastResults.score === 'number') {
      console.log('✅ Valid cached results found, displaying...');
      displayResults(lastResults);
      updateLastScanTime(lastScan);
    } else {
      console.log('⚠️ No valid cached results, running fresh scan...');
      // Clear potentially corrupted data
      await chrome.storage.local.remove(['lastResults']);
      // Run initial scan
      await runScan();
    }
  } catch (error) {
    console.error('❌ Load error:', error);
    // Clear storage and try fresh scan
    await chrome.storage.local.clear();
    await runScan();
  }
}

function displayResults(results) {
  console.log('🖥️ displayResults called with:', results);
  
  // Validate results
  if (!results) {
    console.error('❌ No results to display');
    showError('Invalid scan results');
    return;
  }

  console.log('✅ Results validation passed');
  console.log('📊 Score:', results.score);
  console.log('📁 Categories:', results.categories);

  // Update score display
  try {
    updateScoreDisplay(results.score || 0);
    console.log('✅ Score display updated');
  } catch (err) {
    console.error('❌ Error updating score display:', err);
  }

  // Update category scores and issues
  if (results.categories) {
    try {
      console.log('📂 Updating categories...');
      updateCategories(results.categories);
      console.log('✅ Categories updated');
    } catch (err) {
      console.error('❌ Error updating categories:', err);
      console.error('❌ Stack trace:', err.stack);
    }
  } else {
    console.error('❌ No categories in results:', results);
  }

  // Update score description
  try {
    updateScoreDescription(results.score || 0);
    console.log('✅ Score description updated');
  } catch (err) {
    console.error('❌ Error updating score description:', err);
  }
}

function updateScoreDisplay(score) {
  const scoreValue = document.getElementById('scoreValue');
  const scoreLabel = document.getElementById('scoreLabel');
  const scoreRing = document.getElementById('scoreRing');

  // Animate score count-up
  const duration = 1500; // 1.5 seconds
  const start = 0;
  const end = score;
  const startTime = performance.now();

  function animateScore(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentScore = Math.floor(start + (end - start) * easeOutQuart);
    
    scoreValue.textContent = currentScore;

    if (progress < 1) {
      requestAnimationFrame(animateScore);
    } else {
      scoreValue.textContent = end; // Ensure final value is exact
    }
  }

  requestAnimationFrame(animateScore);

  // Update score label and color
  let label = 'Critical';
  let ringClass = 'poor';
  
  if (score >= 80) {
    label = 'Excellent';
    ringClass = 'excellent';
  } else if (score >= 60) {
    label = 'Good';
    ringClass = 'good';
  } else if (score >= 40) {
    label = 'Fair';
    ringClass = 'fair';
  } else if (score >= 20) {
    label = 'Poor';
    ringClass = 'poor';
  }

  scoreLabel.textContent = label;

  // Update ring progress
  scoreRing.classList.remove('excellent', 'good', 'fair', 'poor');
  scoreRing.classList.add(ringClass);

  // Animate ring (circumference = 2 * π * r = 2 * π * 70 ≈ 439.82)
  const circumference = 439.82;
  const offset = circumference - (score / 100) * circumference;
  
  // Smooth ring animation
  setTimeout(() => {
    scoreRing.style.strokeDashoffset = offset;
  }, 100);
}

function updateScoreDescription(score) {
  const descriptions = {
    excellent: "Your browser has excellent privacy and security settings. Keep up the good work!",
    good: "Your browser is well-configured with good privacy protection. A few improvements could make it even better.",
    fair: "Your browser has moderate privacy protection. Several improvements are recommended.",
    poor: "Your browser has weak privacy protection. Multiple critical issues need attention.",
    critical: "Your browser has serious privacy and security vulnerabilities. Immediate action required!"
  };

  let key = 'critical';
  if (score >= 80) key = 'excellent';
  else if (score >= 60) key = 'good';
  else if (score >= 40) key = 'fair';
  else if (score >= 20) key = 'poor';

  document.getElementById('scoreDescription').textContent = descriptions[key];
}

function updateCategories(categories) {
  if (!categories || typeof categories !== 'object') {
    console.error('Invalid categories:', categories);
    return;
  }

  Object.entries(categories).forEach(([categoryName, categoryData]) => {
    if (categoryData) {
      updateCategoryScore(categoryName, categoryData);
      updateCategoryIssues(categoryName, categoryData.issues || []);
    }
  });
}

function updateCategoryScore(categoryName, categoryData) {
  const scoreElement = document.getElementById(`${categoryName}Score`);
  const indicatorElement = document.getElementById(`${categoryName}Indicator`);
  if (!scoreElement) return;

  scoreElement.textContent = `${categoryData.score}/${categoryData.max}`;

  // Add color class based on score percentage
  const percentage = (categoryData.score / categoryData.max) * 100;
  scoreElement.classList.remove('excellent', 'good', 'fair', 'poor');
  if (indicatorElement) {
    indicatorElement.classList.remove('excellent', 'good', 'fair', 'poor');
  }

  let colorClass;
  if (percentage >= 80) {
    colorClass = 'excellent';
  } else if (percentage >= 60) {
    colorClass = 'good';
  } else if (percentage >= 40) {
    colorClass = 'fair';
  } else {
    colorClass = 'poor';
  }

  scoreElement.classList.add(colorClass);
  if (indicatorElement) {
    indicatorElement.classList.add(colorClass);
  }
}

function updateCategoryIssues(categoryName, issues) {
  const issuesContainer = document.getElementById(`${categoryName}Issues`);
  if (!issuesContainer) return;

  issuesContainer.innerHTML = '';

  if (!issues || issues.length === 0) {
    issuesContainer.innerHTML = '<div class="no-issues">No issues found in this category</div>';
    return;
  }

  issues.forEach(issue => {
    const issueElement = createIssueElement(issue);
    issuesContainer.appendChild(issueElement);
  });
}

function createIssueElement(issue) {
  const issueDiv = document.createElement('div');
  issueDiv.className = 'issue';

  issueDiv.innerHTML = `
    <div class="issue-header">
      <span class="issue-severity ${issue.severity}">${issue.severity}</span>
      <span class="issue-title">${issue.title}</span>
    </div>
    <div class="issue-description">${issue.description}</div>
    <div class="issue-recommendation"><strong>Fix:</strong> ${issue.recommendation}</div>
  `;

  return issueDiv;
}

function updateLastScanTime(timestamp) {
  if (!timestamp) {
    document.getElementById('lastScan').textContent = 'Never';
    return;
  }

  const scanTime = new Date(timestamp);
  const now = new Date();
  const diffMs = now - scanTime;
  const diffMins = Math.floor(diffMs / 60000);

  let timeText;
  if (diffMins < 1) {
    timeText = 'Just now';
  } else if (diffMins < 60) {
    timeText = `${diffMins}m ago`;
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    timeText = `${hours}h ago`;
  } else {
    const days = Math.floor(diffMins / 1440);
    timeText = `${days}d ago`;
  }

  document.getElementById('lastScan').textContent = timeText;
}

function showError(message) {
  const scoreDescription = document.getElementById('scoreDescription');
  scoreDescription.textContent = message;
  scoreDescription.style.color = 'var(--red)';
  
  setTimeout(() => {
    scoreDescription.style.color = '';
  }, 5000);
}

// Update last scan time every minute
setInterval(() => {
  chrome.storage.local.get(['lastScan'], ({ lastScan }) => {
    if (lastScan) {
      updateLastScanTime(lastScan);
    }
  });
}, 60000);
