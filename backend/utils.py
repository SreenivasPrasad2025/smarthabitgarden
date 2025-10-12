from bson import ObjectId
from datetime import datetime, timezone

def to_str_id(doc):
    if not doc:
        return doc
    doc = dict(doc)
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])

    # Convert timezone-naive datetimes to timezone-aware (UTC)
    # MongoDB returns datetimes as naive even though they're stored as UTC
    for key, value in doc.items():
        if isinstance(value, datetime) and value.tzinfo is None:
            doc[key] = value.replace(tzinfo=timezone.utc)

    return doc
