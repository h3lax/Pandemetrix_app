set -e

echo "🔍 Running pre-commit checks..."

# Check for large files
echo "Checking for large files..."
find . -type f -size +5M -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
  echo "⚠️ Large file detected: $file"
done

# Run linting if available
if npm run lint:check > /dev/null 2>&1; then
  echo "Running linter..."
  npm run lint:check
fi

# Check formatting if available
if npm run format:check > /dev/null 2>&1; then
  echo "Checking code formatting..."
  npm run format:check
fi

# Run quick tests
echo "Running quick tests..."
npm run test:unit

echo "✅ Pre-commit checks passed!"

---