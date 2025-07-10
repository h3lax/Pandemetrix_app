set -e

echo "🧪 Running complete test suite locally..."

# Run unit tests
echo "Running unit tests..."
npm run test:ci

# Start app in background for E2E tests
echo "Starting application for E2E tests..."
npm run dev &
APP_PID=$!

# Wait for app to start
echo "Waiting for application to start..."
timeout 60 bash -c 'until curl -f http://localhost:5173/ > /dev/null 2>&1; do sleep 2; done'

# Run E2E tests
echo "Running E2E tests..."
npm run test:e2e

# Clean up
echo "Cleaning up..."
kill $APP_PID || true

echo "✅ All tests passed locally!"

---