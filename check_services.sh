#!/bin/bash

echo "🔍 Checking if MongoDB is running..."
if lsof -Pi :27018 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ MongoDB is running on port 27018"
else
    echo "❌ MongoDB is NOT running"
    echo "Starting MongoDB..."
    mkdir -p /Users/spiruthivprasath/mongodb_data
    mongod --port 27018 --dbpath /Users/spiruthivprasath/mongodb_data &
    sleep 3
    echo "✅ MongoDB started"
fi

echo ""
echo "🔍 Checking if backend is running..."
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Backend is running on port 4000"
else
    echo "❌ Backend is NOT running"
    echo "Starting backend..."
    cd /Users/spiruthivprasath/Desktop/project/project_server
    node server.js &
    sleep 2
    echo "✅ Backend started"
fi

echo ""
echo "🔍 Checking if frontend is running..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend is NOT running"
fi

echo ""
echo "🌍 Application URLs:"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:4000"
echo "MongoDB: mongodb://localhost:27018"
