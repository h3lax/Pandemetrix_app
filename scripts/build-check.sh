set -e

echo "🔍 Running pre-deployment checks..."

# Check if required files exist
required_files=(
  "package.json"
  "vite.config.js"
  "index.html"
  "src/main.js"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "❌ Missing required file: $file"
    exit 1
  fi
done

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level=moderate || echo "⚠️ Some vulnerabilities found, consider running 'npm audit fix'"

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Build application
echo "🏗️ Building application..."
npm run build

# Check build output
if [[ ! -d "dist" ]]; then
  echo "❌ Build failed: dist directory not found"
  exit 1
fi

if [[ ! -f "dist/index.html" ]]; then
  echo "❌ Build failed: index.html not found in dist"
  exit 1
fi

# Check bundle size (optional)
echo "📊 Checking bundle size..."
du -sh dist/

echo "✅ All pre-deployment checks passed!"

---