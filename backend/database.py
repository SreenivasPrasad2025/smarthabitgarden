from pymongo import MongoClient
import os
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "habit_garden")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not set. Add it to backend/.env")

# MongoDB client with SSL certificate configuration
client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000
)

db = client[DB_NAME]
days_log_collection = db["days_log"]
habits_collection = db["habits"]
users_collection = db["users"]
reset_tokens_collection = db["reset_tokens"]

# Initialize indexes (only create if they don't exist)
_indexes_initialized = False

def ensure_indexes():
    """Initialize database indexes if not already done"""
    global _indexes_initialized
    if _indexes_initialized:
        return

    try:
        # Create unique index on email for users collection
        users_collection.create_index("email", unique=True)
        # Create index on token for reset_tokens collection
        reset_tokens_collection.create_index("token", unique=True)
        # Create TTL index to auto-delete expired reset tokens after 1 hour
        reset_tokens_collection.create_index("created_at", expireAfterSeconds=3600)
        _indexes_initialized = True
    except Exception as e:
        # Log but don't fail if indexes already exist
        print(f"Index creation skipped or failed (might already exist): {e}")
