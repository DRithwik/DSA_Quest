
import logging
from backend.state import ExplorerState
from langgraph.graph import StateGraph, END
from backend.nodes import (
    list_files_node,
    DirectoryExplorerDecider,
    JunkCleaner,
    DirectoryTree,
    FileReader,
    Analyzer,
    dependencyAndTechicalRequirementsExtractor,
)

file_handler = logging.FileHandler('logger.txt', mode='a', encoding='utf-8')
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

# Build the workflow graph for the exploration agent
graph = StateGraph(ExplorerState)

# Add nodes to the graph
graph.add_node("list_files", list_files_node)
graph.add_node("decider", DirectoryExplorerDecider)
graph.add_node("cleaner", JunkCleaner)
graph.add_node("tree_builder", DirectoryTree)
graph.add_node("file_reader", FileReader)
graph.add_node("analyzer", Analyzer)
graph.add_node("dependencyAndTechicalRequirementsExtractor", dependencyAndTechicalRequirementsExtractor)


# Set entry point
graph.set_entry_point("list_files")

# Add edges between nodes
graph.add_edge("list_files", "decider")
graph.add_edge("decider", "cleaner")
graph.add_conditional_edges(
    "cleaner",
    lambda state: state["decision"],
    {
        "continue": "list_files",
        "stop": "tree_builder",
    }
)
graph.add_edge("tree_builder", "file_reader")
graph.add_edge("file_reader", "analyzer")
graph.add_edge("analyzer", "dependencyAndTechicalRequirementsExtractor")
graph.add_edge("dependencyAndTechicalRequirementsExtractor", END)


# Compile the graph into an executable agent
app = graph.compile()