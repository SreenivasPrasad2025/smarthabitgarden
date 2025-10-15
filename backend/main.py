from fastapi import FastAPI
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

try:
    # Try relative imports (for Railway/Vercel deployment)
    from .routes import habits, auth
    from .database import ensure_indexes
except ImportError:
    # Fall back to absolute imports (for local development)
    from routes import habits, auth
    from database import ensure_indexes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    ensure_indexes()
    yield
    # Shutdown (if needed in future)


app = FastAPI(title="Smart Habit Garden API", version="1.0.0", lifespan=lifespan)

# Configure CORS to allow frontend access
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://smarthabitgarden.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"https://.*\.netlify\.app",
)

app.include_router(auth.router)
app.include_router(habits.router)

@app.get("/")
def root():
    return {"message": "Welcome to Smart Habit Garden API!"}

# Mangum handler for AWS Lambda
handler = Mangum(app, lifespan="off")

# For Vercel serverless functions, export the app directly
# Vercel will auto-detect the ASGI application
__all__ = ["app", "handler"]