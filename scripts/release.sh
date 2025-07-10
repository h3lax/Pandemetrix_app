set -e

# Check if version is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 1.2.3"
  exit 1
fi

VERSION=$1

echo "🚀 Creating release $VERSION..."

# Validate version format
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "❌ Invalid version format. Use semver (e.g., 1.2.3)"
  exit 1
fi

# Check if we're on main branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
  echo "❌ Must be on main branch to create release"
  exit 1
fi

# Check if working directory is clean
if ! git diff-index --quiet HEAD --; then
  echo "❌ Working directory is not clean"
  exit 1
fi

# Run full test suite
echo "Running full test suite..."
npm run test:all

# Update package.json version
echo "Updating package.json version..."
npm version $VERSION --no-git-tag-version

# Build the application
echo "Building application..."
npm run build

# Commit version bump
git add package.json package-lock.json
git commit -m "chore: bump version to $VERSION"

# Create and push tag
git tag "v$VERSION"
git push origin main
git push origin "v$VERSION"

echo "✅ Release $VERSION created successfully!"
echo "🔗 Check GitHub Actions for deployment status"