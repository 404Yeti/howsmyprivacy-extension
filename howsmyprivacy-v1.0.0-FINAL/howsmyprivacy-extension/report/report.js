// HowsMyPrivacy Detailed Report Script

// Firefox compatibility
if (typeof browser !== 'undefined' && !chrome.runtime) {
  window.chrome = browser;
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadReport();
  setupPrintButton();
});

async function loadReport() {
  try {
    // Load results from storage
    const { lastResults } = await chrome.storage.local.get(['lastResults']);

    if (!lastResults) {
      showError('No scan results available. Please run a scan first.');
      return;
    }

    // Display the report
    displayReport(lastResults);
  } catch (error) {
    console.error('Report load error:', error);
    showError('Failed to load report data.');
  }
}

function displayReport(results) {
  // Update overall score
  updateScoreDisplay(results.score);
  updateScoreInfo(results);

  // Update categories
  updateCategoryReports(results.categories);

  // Generate recommendations
  generateRecommendations(results);
}

function updateScoreDisplay(score) {
  const scoreValue = document.getElementById('scoreValue');
  const scoreLabel = document.getElementById('scoreLabel');
  const scoreRing = document.getElementById('scoreRing');

  // Update score text
  scoreValue.textContent = score;

  // Update score label and color
  let label, ringClass;
  
  if (score >= 80) {
    label = 'Excellent';
    ringClass = 'excellent';
  } else if (score >= 60) {
    label = 'Good';
    ringClass = 'good';
  } else if (score >= 40) {
    label = 'Fair';
    ringClass = 'fair';
  } else {
    label = 'Poor';
    ringClass = 'poor';
  }

  scoreLabel.textContent = label;
  scoreRing.classList.add(ringClass);

  // Animate ring (circumference = 2 * π * 90 ≈ 565.48)
  const circumference = 565.48;
  const offset = circumference - (score / 100) * circumference;
  scoreRing.style.strokeDashoffset = offset;
}

function updateScoreInfo(results) {
  const scoreTitle = document.getElementById('scoreTitle');
  const scoreDescription = document.getElementById('scoreDescription');
  const websiteUrl = document.getElementById('websiteUrl');
  const scanTime = document.getElementById('scanTime');

  // Set title based on score
  const score = results.score;
  if (score >= 80) {
    scoreTitle.textContent = 'Excellent Privacy Protection';
    scoreDescription.textContent = 'Your browser has strong privacy and security settings. Keep up the good work!';
  } else if (score >= 60) {
    scoreTitle.textContent = 'Good Privacy Protection';
    scoreDescription.textContent = 'Your browser is well-configured with good privacy protection. A few improvements could make it even better.';
  } else if (score >= 40) {
    scoreTitle.textContent = 'Fair Privacy Protection';
    scoreDescription.textContent = 'Your browser has moderate privacy protection. Several improvements are recommended.';
  } else {
    scoreTitle.textContent = 'Poor Privacy Protection';
    scoreDescription.textContent = 'Your browser has serious privacy and security vulnerabilities. Immediate action is recommended.';
  }

  // Set metadata
  websiteUrl.textContent = results.url || 'Unknown';
  
  if (results.timestamp) {
    const date = new Date(results.timestamp);
    scanTime.textContent = date.toLocaleString();
  } else {
    scanTime.textContent = 'Unknown';
  }
}

function updateCategoryReports(categories) {
  const categoryNames = ['cookies', 'tracking', 'privacy', 'security', 'fingerprinting'];

  categoryNames.forEach(categoryName => {
    const categoryData = categories[categoryName];
    if (!categoryData) return;

    // Update score badge
    const scoreBadge = document.getElementById(`${categoryName}ScoreBadge`);
    if (scoreBadge) {
      scoreBadge.textContent = `${categoryData.score}/${categoryData.max}`;
      
      // Add color class
      const percentage = (categoryData.score / categoryData.max) * 100;
      scoreBadge.classList.remove('excellent', 'good', 'fair', 'poor');
      
      if (percentage >= 80) {
        scoreBadge.classList.add('excellent');
      } else if (percentage >= 60) {
        scoreBadge.classList.add('good');
      } else if (percentage >= 40) {
        scoreBadge.classList.add('fair');
      } else {
        scoreBadge.classList.add('poor');
      }
    }

    // Update issues list
    const issuesList = document.getElementById(`${categoryName}Issues`);
    if (issuesList) {
      issuesList.innerHTML = '';

      if (!categoryData.issues || categoryData.issues.length === 0) {
        issuesList.innerHTML = '<div class="no-issues-message">No issues found in this category</div>';
      } else {
        categoryData.issues.forEach(issue => {
          const issueCard = createIssueCard(issue);
          issuesList.appendChild(issueCard);
        });
      }
    }
  });
}

function createIssueCard(issue) {
  const card = document.createElement('div');
  card.className = `issue-card ${issue.severity}`;

  card.innerHTML = `
    <div class="issue-header">
      <span class="issue-severity ${issue.severity}">${issue.severity}</span>
      <span class="issue-title">${issue.title}</span>
    </div>
    <div class="issue-description">${issue.description}</div>
    <div class="issue-recommendation"><strong>Fix:</strong> ${issue.recommendation}</div>
  `;

  return card;
}

function generateRecommendations(results) {
  const recommendationsList = document.getElementById('recommendationsList');
  const allIssues = [];

  // Collect all high and critical issues
  Object.values(results.categories).forEach(category => {
    if (category.issues) {
      category.issues.forEach(issue => {
        if (issue.severity === 'critical' || issue.severity === 'high') {
          allIssues.push(issue);
        }
      });
    }
  });

  if (allIssues.length === 0) {
    recommendationsList.innerHTML = '<div class="no-issues-message">No critical recommendations. You\'re doing great!</div>';
    return;
  }

  // Show top 6 recommendations
  allIssues.slice(0, 6).forEach(issue => {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    
    card.innerHTML = `
      <h4>${issue.title}</h4>
      <p>${issue.recommendation}</p>
    `;

    recommendationsList.appendChild(card);
  });
}

function setupPrintButton() {
  const printBtn = document.getElementById('printBtn');
  printBtn.addEventListener('click', () => {
    window.print();
  });
}

function showError(message) {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div style="text-align: center; padding: 100px 20px;">
      <h1 style="color: var(--red); font-size: 48px; margin-bottom: 20px;">⚠️</h1>
      <h2 style="margin-bottom: 12px;">Error Loading Report</h2>
      <p style="color: var(--gray-700); margin-bottom: 24px;">${message}</p>
      <button onclick="window.close()" style="background: var(--brand-yellow); color: var(--brand-black); border: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Close</button>
    </div>
  `;
}
