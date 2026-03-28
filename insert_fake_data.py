import hashlib
import json
import datetime
import os
from pymongo import MongoClient
from dotenv import load_dotenv

def generate_id(path):
    norm = str(path).strip().lower()
    return hashlib.sha256(norm.encode("utf-8")).hexdigest()

# Load credentials
load_dotenv(r"c:\Users\Rithwik\Downloads\major project\backend\.env")
mongo_uri = os.getenv("MONGO_URI")
db_name = os.getenv("MONGO_DB", "analysis_agent")

client = MongoClient(mongo_uri)
db = client[db_name]
coll = db["projects"]

def insert_mock_project(project_path, project_name):
    pid = generate_id(project_path)
    
    # Create a mock ExplorerState
    state = {
        "root": [
            {"name": project_name, "path": project_path, "type": "directory", "parent": None},
            {"name": "src", "path": os.path.join(project_path, "src"), "type": "directory", "parent": project_path},
            {"name": "main.py", "path": os.path.join(project_path, "src", "main.py"), "type": "file", "parent": os.path.join(project_path, "src"), 
             "analysis": "This is a core application file that handles the main entry point and event loop.", 
             "summary": "Main entry point",
             "complexity": "Medium",
             "issues": ["Missing docstrings", "Hardcoded port"]},
            {"name": "utils.py", "path": os.path.join(project_path, "src", "utils.py"), "type": "file", "parent": os.path.join(project_path, "src"), 
             "analysis": "Helper functions for string manipulation and logging.", 
             "summary": "Utility functions",
             "complexity": "Low",
             "issues": []},
            {"name": "requirements.txt", "path": os.path.join(project_path, "requirements.txt"), "type": "file", "parent": project_path, 
             "analysis": "List of python dependencies.", 
             "summary": "Dependencies list",
             "complexity": "Low",
             "issues": []}
        ],
        "current_path": {"parent": None, "children": [project_path]},
        "to_visit": [],
        "directory_graph": {
            project_path: ["src", "requirements.txt"],
            os.path.join(project_path, "src"): ["main.py", "utils.py"]
        },
        "decision": "stop",
        "remove": [],
        "dependencies": {"python": ["flask", "pymongo", "langchain"], "system": ["MongoDB"]},
        "Technical_requirements": ["Python 3.10+", "Access to Google AI Studio", "Running MongoDB instance"]
    }
    
    doc = {
        "_id": pid,
        "project_id": pid,
        "latest": state,
        "updated_at": datetime.datetime.utcnow(),
        "version": 1,
        "history": []
    }
    
    coll.replace_one({"_id": pid}, doc, upsert=True)
    print(f"Inserted mock data for {project_name} (ID: {pid})")

# Insert the two requested projects
insert_mock_project("C:\\daily", "daily")
insert_mock_project("https://github.com/DRithwik/Microsoft-Loop-Clone", "Microsoft-Loop-Clone")
