"""
mongo_store.py

Small utility to store analysis `state` documents into MongoDB.

Behavior:
- Computes a stable project id when not provided (SHA256 of the project's root path or the state JSON).
- If a document for the project id already exists, moves the previous `latest` into a `history` array and
  updates `latest` with the new state. Also increments `version` and updates `updated_at`.
- If not exists, creates a new document with `version = 1`.

Usage (example):
  python mongo_store.py --state-file result.json --mongo-uri mongodb://localhost:27017 --db analysis_agent

Note: requires `pymongo` in your environment: pip install pymongo
"""

from __future__ import annotations

import hashlib
import json
import datetime
import argparse
from typing import Any, Dict, Optional

try:
    from pymongo import MongoClient
except Exception as e:
    MongoClient = None  # type: ignore


def generate_project_id(state: Dict[str, Any]) -> str:
    """Generate a stable project id from the analysis state.

    Preference order:
    1. If state contains a top-level root and root[0].path, use that path.
    2. Otherwise fall back to sha256 of the JSON-serialized `state`.
    """
    root = state.get("root")
    if isinstance(root, list) and len(root) > 0:
        first = root[0]
        path = first.get("path") if isinstance(first, dict) else None
        if path:
            norm = str(path).strip().lower()
            return hashlib.sha256(norm.encode("utf-8")).hexdigest()

    # Fallback: hash the JSON representation (stable sort keys)
    s = json.dumps(state, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def store_state(
    state: Dict[str, Any],
    project_id: Optional[str] = None,
    mongo_uri: str = "mongodb://localhost:27017",
    db_name: str = "analysis_agent",
    collection_name: str = "projects",
) -> Dict[str, Any]:
    """Store the analysis `state` into MongoDB.

    Returns the stored document.
    """
    if MongoClient is None:
        raise RuntimeError("pymongo is not installed. Install with: pip install pymongo")

    if project_id is None:
        project_id = generate_project_id(state)

    client = MongoClient(mongo_uri)
    db = client[db_name]
    coll = db[collection_name]

    now = datetime.datetime.utcnow()

    existing = coll.find_one({"_id": project_id})
    if existing:
        # Move previous latest to history (keep timestamp/version)
        history = existing.get("history", [])
        prev_latest = existing.get("latest")
        prev_updated = existing.get("updated_at")
        prev_version = existing.get("version", 1)
        if prev_latest is not None:
            history.append({"version": prev_version, "state": prev_latest, "timestamp": prev_updated})
        version = prev_version + 1
    else:
        history = []
        version = 1

    # Sanitize state to ensure it is encodable by pymongo (convert sets -> lists, tuples->lists)
    def _sanitize(obj: Any) -> Any:
        if isinstance(obj, dict):
            return {str(k): _sanitize(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [_sanitize(v) for v in obj]
        if isinstance(obj, tuple):
            return [_sanitize(v) for v in obj]
        if isinstance(obj, set):
            return [_sanitize(v) for v in sorted(obj)]
        # datetime and basic types are left as-is
        return obj

    sanitized_state = _sanitize(state)

    doc = {
        "_id": project_id,
        "project_id": project_id,
        "latest": sanitized_state,
        "updated_at": now,
        "version": version,
        "history": history,
    }

    # Upsert the document (safe replace)
    try:
        coll.replace_one({"_id": project_id}, doc, upsert=True)
    except Exception as e:
        # Re-raise with clearer message for caller
        raise RuntimeError(f"Failed to upsert document for project {project_id}: {e}")

    # Optionally, you can create indices (only first time). Keep id as unique key via _id.
    try:
        coll.create_index("project_id", unique=True)
    except Exception:
        # Ignore index creation errors (e.g., index exists)
        pass

    # Return a JSON-serializable version of the doc (convert datetime)
    doc_out = dict(doc)
    doc_out["updated_at"] = doc_out["updated_at"].isoformat()
    return doc_out


def _cli() -> None:
    parser = argparse.ArgumentParser(description="Store analysis state JSON into MongoDB")
    parser.add_argument("--state-file", required=True, help="Path to the JSON file with the analysis state (e.g. result.json)")
    parser.add_argument("--project-id", required=False, help="Optional project id. If omitted a stable id is generated.")
    parser.add_argument("--mongo-uri", default="mongodb://localhost:27017", help="MongoDB connection URI")
    parser.add_argument("--db", default="analysis_agent", help="MongoDB database name")
    parser.add_argument("--collection", default="projects", help="MongoDB collection name")

    args = parser.parse_args()

    with open(args.state_file, "r", encoding="utf-8") as f:
        state = json.load(f)

    # If the file contains the `root` list directly (as main writes), wrap if needed
    # Accept both the top-level list and a dict with expected keys
    if not isinstance(state, dict):
        # assume the file contains the root list
        state = {"root": state}

    stored = store_state(
        state=state,
        project_id=args.project_id,
        mongo_uri=args.mongo_uri,
        db_name=args.db,
        collection_name=args.collection,
    )

    print("Stored document:")
    print(json.dumps(stored, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    _cli()
