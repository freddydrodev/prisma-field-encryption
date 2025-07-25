#!/bin/bash

echo "🧪 Testing Turbo Todo App..."

# Start servers in background
echo "🚀 Starting development servers..."
pnpm dev &
SERVER_PID=$!

# Wait for servers to start
echo "⏳ Waiting for servers to start..."
sleep 15

# Test API endpoints
echo "📡 Testing API endpoints..."

# Test GET todos
echo "Testing GET /api/todos..."
RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3001/api/todos)
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ GET /api/todos - SUCCESS (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
else
    echo "❌ GET /api/todos - FAILED (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
fi

# Test POST todo
echo "Testing POST /api/todos..."
RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"This is a test todo"}')
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ POST /api/todos - SUCCESS (HTTP $HTTP_CODE)"
    echo "Response: $BODY"

    # Extract todo ID for further testing
    TODO_ID=$(echo "$BODY" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$TODO_ID" ]; then
        echo "📝 Created todo with ID: $TODO_ID"

        # Test PUT todo
        echo "Testing PUT /api/todos/$TODO_ID..."
        RESPONSE=$(curl -s -w "%{http_code}" -X PUT http://localhost:3001/api/todos/$TODO_ID \
          -H "Content-Type: application/json" \
          -d '{"title":"Updated Test Todo","description":"This is an updated test todo","completed":true}')
        HTTP_CODE="${RESPONSE: -3}"
        BODY="${RESPONSE%???}"

        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ PUT /api/todos/$TODO_ID - SUCCESS (HTTP $HTTP_CODE)"
            echo "Response: $BODY"
        else
            echo "❌ PUT /api/todos/$TODO_ID - FAILED (HTTP $HTTP_CODE)"
            echo "Response: $BODY"
        fi

        # Test DELETE todo
        echo "Testing DELETE /api/todos/$TODO_ID..."
        RESPONSE=$(curl -s -w "%{http_code}" -X DELETE http://localhost:3001/api/todos/$TODO_ID)
        HTTP_CODE="${RESPONSE: -3}"
        BODY="${RESPONSE%???}"

        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ DELETE /api/todos/$TODO_ID - SUCCESS (HTTP $HTTP_CODE)"
            echo "Response: $BODY"
        else
            echo "❌ DELETE /api/todos/$TODO_ID - FAILED (HTTP $HTTP_CODE)"
            echo "Response: $BODY"
        fi
    fi
else
    echo "❌ POST /api/todos - FAILED (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
fi

# Test web app
echo "🌐 Testing web application..."
WEB_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000)
WEB_HTTP_CODE="${WEB_RESPONSE: -3}"

if [ "$WEB_HTTP_CODE" = "200" ]; then
    echo "✅ Web app - SUCCESS (HTTP $WEB_HTTP_CODE)"
    echo "Web app is accessible at http://localhost:3000"
else
    echo "❌ Web app - FAILED (HTTP $WEB_HTTP_CODE)"
fi

echo ""
echo "🎉 Testing complete!"
echo ""
echo "📱 Web App: http://localhost:3000"
echo "🔌 API: http://localhost:3001"
echo ""
echo "To stop the servers, run: pkill -f 'next dev'"

# Keep servers running
wait $SERVER_PID