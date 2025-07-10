set -e

echo "🚀 Setting up CI/CD environment..."

# Create necessary directories
mkdir -p .github/workflows
mkdir -p scripts

# Create environment file template
cat > .env.example << 'EOF'
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_ML_API_BASE_URL=http://localhost:5001/api/v1/covid

# Development settings
NODE_ENV=development

# CI/CD settings
CI=true
CODECOV_TOKEN=your_codecov_token
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
SNYK_TOKEN=your_snyk_token
EOF

# Create GitHub secrets template
cat > .github/SECRETS.md << 'EOF'
# Required GitHub Secrets

## For CI/CD
- `CODECOV_TOKEN`: Token for code coverage reporting (optional)
- `NETLIFY_AUTH_TOKEN`: Token for Netlify deployments (optional)
- `NETLIFY_SITE_ID`: Netlify site ID (optional)
- `SNYK_TOKEN`: Token for security scanning (optional)

## For Docker
- Container registry credentials are handled by GITHUB_TOKEN

## Setup Instructions
1. Go to repository Settings > Secrets and variables > Actions
2. Add each secret with the corresponding value
3. Ensure repository has necessary permissions for GitHub Pages if using
EOF

# Create Cypress configuration update
cat > cypress.config.js.new << 'EOF'
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    experimentalStudio: true,
    retries: {
      runMode: 2,
      openMode: 0
    }
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.js',
    supportFile: 'cypress/support/component.js'
  }
})
EOF

echo "✅ CI/CD setup complete!"
echo "📝 Next steps:"
echo "   1. Review and customize the workflow files"
echo "   2. Add required secrets to your GitHub repository (optional)"
echo "   3. Update API URLs in .env files"
echo "   4. Test workflows with a pull request"
echo "   5. Replace cypress.config.js with cypress.config.js.new if you want the updated config"

---