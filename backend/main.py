
import logging
import os

# Centralized logging configuration: configure handlers before importing project modules
logger = logging.getLogger()
logger.setLevel(logging.INFO)
if not any(isinstance(h, logging.FileHandler) for h in logger.handlers):
    file_handler = logging.FileHandler('logger.txt', mode='a', encoding='utf-8')
    file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    logger.addHandler(file_handler)
if not any(isinstance(h, logging.StreamHandler) for h in logger.handlers):
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    logger.addHandler(console_handler)

# Import project modules after logging is configured so they inherit the handlers
from backend.graph import app
from backend.state import ExplorerState
from backend.mongo_store import store_state

# Prompt user for root directory path
path = input("Enter the root directory path to explore: ")

# Initialize the exploration state
initial_state: ExplorerState = {
    "root": [{"name": os.path.basename(path), "path": path, "type": "directory", "parent": None}],
    "current_path": {"parent": None, "children": [path]},
    "to_visit": [],
    "decision": "continue",
    "remove": []
}

# Run the exploration agent
final_state = app.invoke(initial_state)

# Log the result in formatted (pretty-printed) JSON
import json
logger.info("Final state root (formatted):\n%s", json.dumps(final_state['root'], indent=4, ensure_ascii=False))

with open("result.json", "w", encoding="utf-8") as f:
    json.dump(final_state['root'], f, indent=4, ensure_ascii=False)

# Try to store the full analysis state in MongoDB (non-fatal on failure)
try:
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    mongo_db = os.getenv("MONGO_DB", "analysis_agent")
    stored = store_state(final_state, mongo_uri=mongo_uri, db_name=mongo_db)
    logger.info("Stored analysis state in MongoDB for project: %s", stored.get("_id"))
except Exception as e:
    logger.error("Failed to store state in MongoDB: %s", e)