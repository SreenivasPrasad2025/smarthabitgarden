"""
MongoDB Data API HTTP Client
Works on Vercel serverless without SSL driver issues
"""
import os
import requests
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

# MongoDB Data API configuration
DATA_API_URL = os.getenv("MONGODB_DATA_API_URL")
DATA_API_KEY = os.getenv("MONGODB_DATA_API_KEY")
DB_NAME = os.getenv("DB_NAME", "habit_garden")
CLUSTER_NAME = os.getenv("CLUSTER_NAME", "ClusterSpaceShare")

if not DATA_API_URL or not DATA_API_KEY:
    raise RuntimeError("MONGODB_DATA_API_URL and MONGODB_DATA_API_KEY must be set")


class HTTPCollection:
    """HTTP-based MongoDB collection wrapper using Data API"""

    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        self.headers = {
            "Content-Type": "application/json",
            "api-key": DATA_API_KEY
        }
        self.base_payload = {
            "dataSource": CLUSTER_NAME,
            "database": DB_NAME,
            "collection": collection_name
        }

    def _request(self, action: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Make HTTP request to Data API"""
        url = f"{DATA_API_URL}/action/{action}"
        full_payload = {**self.base_payload, **payload}

        response = requests.post(url, json=full_payload, headers=self.headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def find_one(self, filter: Dict[str, Any], projection: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """Find one document"""
        payload = {"filter": filter}
        if projection:
            payload["projection"] = projection

        result = self._request("findOne", payload)
        return result.get("document")

    def find(self, filter: Dict[str, Any] = None, projection: Optional[Dict[str, Any]] = None,
             limit: Optional[int] = None, sort: Optional[Dict[str, int]] = None) -> List[Dict[str, Any]]:
        """Find multiple documents"""
        payload = {"filter": filter or {}}
        if projection:
            payload["projection"] = projection
        if limit:
            payload["limit"] = limit
        if sort:
            payload["sort"] = sort

        result = self._request("find", payload)
        return result.get("documents", [])

    def insert_one(self, document: Dict[str, Any]) -> Dict[str, Any]:
        """Insert one document"""
        payload = {"document": document}
        result = self._request("insertOne", payload)
        # Return the inserted ID
        return {"inserted_id": result.get("insertedId")}

    def update_one(self, filter: Dict[str, Any], update: Dict[str, Any], upsert: bool = False) -> Dict[str, Any]:
        """Update one document"""
        payload = {
            "filter": filter,
            "update": update,
            "upsert": upsert
        }
        result = self._request("updateOne", payload)
        return {
            "matched_count": result.get("matchedCount", 0),
            "modified_count": result.get("modifiedCount", 0)
        }

    def delete_one(self, filter: Dict[str, Any]) -> Dict[str, Any]:
        """Delete one document"""
        payload = {"filter": filter}
        result = self._request("deleteOne", payload)
        return {"deleted_count": result.get("deletedCount", 0)}

    def delete_many(self, filter: Dict[str, Any]) -> Dict[str, Any]:
        """Delete multiple documents"""
        payload = {"filter": filter}
        result = self._request("deleteMany", payload)
        return {"deleted_count": result.get("deletedCount", 0)}

    def count_documents(self, filter: Dict[str, Any] = None) -> int:
        """Count documents"""
        payload = {"filter": filter or {}}
        result = self._request("aggregate", {
            "pipeline": [
                {"$match": filter or {}},
                {"$count": "total"}
            ]
        })
        docs = result.get("documents", [])
        return docs[0].get("total", 0) if docs else 0

    def create_index(self, keys: Any, unique: bool = False, **kwargs) -> str:
        """
        Index creation via Data API is not directly supported.
        Indexes should be created via Atlas UI or mongosh.
        This method is a no-op for compatibility.
        """
        print(f"Note: Index creation for {self.collection_name} should be done via Atlas UI")
        return f"index_placeholder_{self.collection_name}"


# Create collection instances
users_collection = HTTPCollection("users")
habits_collection = HTTPCollection("habits")
days_log_collection = HTTPCollection("days_log")
reset_tokens_collection = HTTPCollection("reset_tokens")


def ensure_indexes():
    """
    Indexes must be created manually in MongoDB Atlas UI since Data API doesn't support it.

    Required indexes:
    1. users: email (unique)
    2. reset_tokens: token (unique)
    3. reset_tokens: created_at (TTL index, expireAfterSeconds=3600)
    """
    print("Note: Ensure indexes are created in MongoDB Atlas UI:")
    print("  - users.email (unique)")
    print("  - reset_tokens.token (unique)")
    print("  - reset_tokens.created_at (TTL, 3600s)")
