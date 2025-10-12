import sys
from pathlib import Path

# Add backend to Python path
backend_path = str(Path(__file__).parent.parent / "backend")
sys.path.insert(0, backend_path)

# Import the FastAPI app
from main import app

# Export app for Vercel (Vercel will handle ASGI)
# This is the standard pattern for deploying FastAPI on Vercel
