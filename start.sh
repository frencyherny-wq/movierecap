#!/bin/bash

echo "=========================================="
echo "  AI Movie Recap - Starting Services"
echo "=========================================="

# Install backend dependencies if needed
if [ ! -d "backend/venv" ]; then
  echo "[Backend] Creating virtual environment..."
  python -m venv backend/venv
fi

echo "[Backend] Installing dependencies..."
backend/venv/bin/pip install -q -r backend/requirements.txt

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
  echo "[Frontend] Installing npm packages..."
  cd frontend && npm install && cd ..
fi

# Start backend on port 8000
echo "[Backend] Starting FastAPI on port 8000..."
backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --app-dir backend &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend on port 3000 (bound to 0.0.0.0 for Replit preview)
echo "[Frontend] Starting Next.js on port 3000..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "=========================================="
echo "  Frontend: http://0.0.0.0:3000"
echo "  Backend:  http://0.0.0.0:8000"
echo "  API Docs: http://0.0.0.0:8000/docs"
echo "=========================================="

# Wait for either process to exit
wait $BACKEND_PID $FRONTEND_PID
