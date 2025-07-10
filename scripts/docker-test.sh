set -e

echo "🐳 Testing Docker builds locally..."

# Build development image
echo "Building development image..."
docker build --target development -t pandemetrix:dev .

# Build production image
echo "Building production image..."
docker build --target production -t pandemetrix:prod .

# Test development container
echo "Testing development container..."
container_id=$(docker run -d -p 5173:5173 pandemetrix:dev)
sleep 10

if curl -f http://localhost:5173 > /dev/null 2>&1; then
  echo "✅ Development container is working"
else
  echo "❌ Development container failed"
  docker logs $container_id
  exit 1
fi

docker stop $container_id

# Test production container
echo "Testing production container..."
container_id=$(docker run -d -p 8080:80 pandemetrix:prod)
sleep 5

if curl -f http://localhost:8080 > /dev/null 2>&1; then
  echo "✅ Production container is working"
else
  echo "❌ Production container failed"
  docker logs $container_id
  exit 1
fi

docker stop $container_id

echo "✅ All Docker tests passed!"