
# State definition for directory exploration agent
import logging
from typing import TypedDict, List, Dict, Any, Set

# Set up logging for the module
logger = logging.getLogger(__name__)

class ExplorerState(TypedDict):
    root: List[Dict[str, Any]]          # All discovered files/dirs
    current_path: Dict[str, Any]        # Current node being processed
    to_visit: List[Dict[str, Any]]      # Queue of dirs left to explore
    directory_graph: Dict[str, List[str]] # Adjacency list of directory structure
    decision: str                       # "continue" or "stop"
    remove: List[str]                   # junk directories to remove
    dependencies: Dict[str, Any]        # dependencies information
    Technical_requirements: List[str]    # Technical requirements information

logging.info("ExplorerState structure loaded.")