# Contributing to HowsMyPrivacy

First off, thank you for considering contributing to HowsMyPrivacy! It's people like you that make this extension a great tool for privacy-conscious users.

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Please be kind and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (URLs, screenshots, etc.)
- **Describe the behavior you observed** and what you expected
- **Include your browser version and OS**
- **Include extension version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List some other tools where this enhancement exists** (if applicable)

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Simple issues for newcomers
- `help wanted` - Issues needing assistance

### Pull Requests

1. **Fork the repo** and create your branch from `main`
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Keep functions focused and small

3. **Test your changes**
   - Load the extension in Chrome/Firefox
   - Test on multiple websites
   - Verify all features still work
   - Check console for errors

4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
   Use clear, descriptive commit messages

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots if UI changes

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/howsmyprivacy-extension.git
   cd howsmyprivacy-extension
   ```

2. Create icon files (see `icons/README.md`)

3. Load the extension:
   - Chrome: `chrome://extensions/` → Enable Developer Mode → Load Unpacked
   - Firefox: `about:debugging#/runtime/this-firefox` → Load Temporary Add-on

4. Make your changes and test

5. Create a pull request

## Code Style Guidelines

### JavaScript
- Use 2 spaces for indentation
- Use semicolons
- Use `const` and `let`, avoid `var`
- Use async/await over promises when possible
- Use meaningful variable names
- Add JSDoc comments for functions

```javascript
/**
 * Check if third-party cookies are enabled
 * @returns {Promise<boolean>} True if enabled
 */
async function checkThirdPartyCookies() {
  // Implementation
}
```

### CSS
- Use 2 spaces for indentation
- Use CSS custom properties for colors
- Follow BEM naming for classes
- Keep selectors simple and specific
- Group related properties together

```css
.category-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
}
```

### HTML
- Use semantic HTML5 elements
- Keep markup clean and minimal
- Use meaningful class names
- Include accessibility attributes

## Project Structure

```
howsmyprivacy-extension/
├── manifest.json              # Chrome manifest
├── manifest-firefox.json      # Firefox manifest
├── popup/                     # Popup interface
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── background/                # Background service worker
│   └── background.js
├── content/                   # Content scripts
│   └── content.js
├── utils/                     # Utility functions
│   └── privacy-checker.js
└── icons/                     # Extension icons
```

## Adding New Privacy Checks

To add a new privacy check:

1. **Identify the check** - What privacy/security aspect?
2. **Determine the category** - Which category (cookies, tracking, etc.)?
3. **Implement in content.js**:

```javascript
async function checkNewFeature(category) {
  try {
    // Your check logic here
    const isSecure = /* your check */;
    
    if (isSecure) {
      category.score += 5;
    } else {
      category.issues.push({
        severity: 'medium', // critical, high, medium, low
        title: 'Issue title',
        description: 'What the problem is',
        recommendation: 'How to fix it'
      });
    }
  } catch (error) {
    console.error('Check error:', error);
  }
}
```

4. **Call from runPrivacyCheck()**:
```javascript
await checkNewFeature(results.categories.privacy);
```

5. **Test thoroughly** on various websites
6. **Update documentation** if needed

## Testing Checklist

Before submitting a PR, verify:

- [ ] Extension loads without errors
- [ ] All existing features still work
- [ ] New feature works as expected
- [ ] Tested on Chrome and Firefox (if possible)
- [ ] Tested on multiple websites
- [ ] No console errors
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] README updated if needed

## Questions?

Feel free to open an issue with the label `question` if you need help or clarification on anything.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for their contributions

Thank you for contributing! 🙏
