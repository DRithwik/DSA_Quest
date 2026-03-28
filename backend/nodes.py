
from langchain_core.prompts import PromptTemplate

from backend.state import ExplorerState
from backend.parsers import DEO_parser, DirectoryExplorerOutput, FA_parser, FileAnalysis
from backend.llmconfig import llm
from pydantic import ValidationError
from backend.codeFormatter import codeFormatter

# Standard library imports
import os
import json
import re
import logging

# Module logger (will inherit handlers from the root logger configured in main.py)
logger = logging.getLogger(__name__)




def list_files_node(state: ExplorerState) -> ExplorerState:
    """
    List files and directories in the current_path and update the state graph.
    This function traverses the directory tree and populates the state with discovered files and directories.
    """
    parent = state["current_path"]["parent"]
    paths = state["current_path"]["children"]

    for path in paths:
        try:
            entries = os.listdir(path)
        except PermissionError:
            logging.warning(f"Permission Denied: {path}")
            continue

        children = []
        for entry in entries:
            full_path = os.path.join(path, entry)

            if os.path.isfile(full_path):
                state["root"].append({
                    "name": entry,
                    "path": full_path,
                    "type": "file",
                    "parent": path
                })
            elif os.path.isdir(full_path):
                state["root"].append({
                    "name": entry,
                    "path": full_path,
                    "type": "directory",
                    "parent": path
                })
                children.append(full_path)

        if children:
            state["to_visit"].append({
                "parent": path,
                "children": children
            })

    # Move to next directory if available
    if state["to_visit"]:
        state["current_path"] = state["to_visit"].pop(0)
    else:
        state["current_path"] = {"parent": None, "children": []}

    logging.info(f"Listed files for paths: {paths}")
    return state




def DirectoryExplorerDecider(state: ExplorerState) -> ExplorerState:
    """
    Decide whether to continue exploring or stop, using schema parsing safely.
    Uses LLM to decide if further exploration is needed and which directories to remove.
    """
    # Convert the state to a JSON string for safe insertion
    state_json = json.dumps(state, indent=2)

    # Escape curly braces in the Pydantic schema instructions
    instructions = DEO_parser.get_format_instructions().replace("{", "{{").replace("}", "}}")

    

    # Build the prompt safely
    prompt_text = (
    "You are an expert controller agent for directory exploration.\n\n"
    "Rules:\n"
    "1. Look at the current state ( current_path, to_visit).\n"
    "2. Ignore typical junk/virtual environment/cache folders and ALL Git/GitHub related files or folders:\n"
    "   - venv, .venv, env, .env, __pycache__, .mypy_cache, .pytest_cache\n"
    "   - node_modules, dist, build, .idea, .vscode, target, bin, obj\n"
    "   - .git (entirely, including commit history, objects, refs, hooks, logs, config, index, HEAD, etc.)\n"
    "   - .github (workflows, actions, issue templates, funding, discussions, etc.)\n"
    "   - .gitignore, .gitattributes, .gitmodules, or any file starting with '.git'\n"
    "   - .hg, .svn\n"
    "3. If a directory looks like a duplicate virtualenv (has Lib/Scripts/Include), mark it for removal.\n"
    "4. If there are no unexplored, non-junk directories left in `to_visit` or `current_path.children`, return stop.\n"
    "5. Return only JSON following this schema:\n"
    f"{instructions}\n\n"
    f"Current state:\n{state_json}"
)


    # Call the LLM
    response = llm.invoke(prompt_text)

    try:
        parsed: DirectoryExplorerOutput = DEO_parser.parse(response.content)
        state["decision"] = parsed.decision
        state["remove"] = parsed.remove
        logging.info(f"LLM Decision: {state['decision']}, Remove: {state['remove']}")
    except Exception as e:
        logging.error(f"Parsing error: {e}. Defaulting to continue without removals.")
        state["decision"] = "continue"
        state["remove"] = []

    return state








def JunkCleaner(state: ExplorerState) -> ExplorerState:
    """
    Remove junk folders detected by LLM from the exploration state.
    Cleans up the state by removing paths marked as junk.
    """
    junk_paths = set(state.get("remove", []))
    if not junk_paths:
        logging.info("No junk paths to remove.")
        return state

    # Filter out junk from root
    state["root"] = [item for item in state["root"] if item["path"] not in junk_paths]

    # Filter junk from to_visit
    new_to_visit = []
    for node in state["to_visit"]:
        children = [c for c in node["children"] if c not in junk_paths]
        if children:
            new_to_visit.append({"parent": node["parent"], "children": children})
    state["to_visit"] = new_to_visit

    # Also clean current_path children
    state["current_path"]["children"] = [
        c for c in state["current_path"]["children"] if c not in junk_paths
    ]

    logging.info(f"Junk paths removed: {junk_paths}")
    # Clear remove after applying
    state["remove"] = []

    return state



def DirectoryTree(state: "ExplorerState") -> "ExplorerState":
    """
    Convert ExplorerState.root (flat list of files/directories with an explicit root)
    into a hierarchical directory tree JSON, rewrite it back to state["root"],
    and return the updated state.
    """
    flat_nodes = state["root"]

    # Step 1: Create lookup for all nodes
    nodes = {}
    for item in flat_nodes:
        node = {
            "name": item["name"],
            "type": item["type"],
            "path": item["path"]
        }
        if item["type"] == "directory":
            node["children"] = []
        nodes[item["path"]] = node

    # Step 2: Attach children to parents
    root = None
    for item in flat_nodes:
        parent_path = item["parent"]
        if parent_path and parent_path in nodes:
            nodes[parent_path]["children"].append(nodes[item["path"]])
        else:
            # parent == None → this is the project root
            root = nodes[item["path"]]

    # Replace state["root"] with hierarchical tree
    state["directory_graph"] = root
    logging.info("Directory tree built and stored in state['directory_graph'].")
    return state



def read_file(file_path: str) -> str:
    """
    Read and return the content of a file. Logs errors if file cannot be read.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        logging.error(f"Error reading {file_path}: {e}")
        return ""




def clean_code(code: str, indentation_oriented: bool = True) -> str:
    """
    Clean code for LLM usage.
    - If indentation_oriented=True (Python, YAML): keep indentation, remove blank lines & trailing spaces.
    - If indentation_oriented=False (Java, JS, C, etc.): remove blank lines & strip all indentation.
    """
    cleaned_lines = []
    for line in code.splitlines():
        # Skip completely blank lines
        if not line.strip():
            continue
        if indentation_oriented:
            # Keep indentation but strip trailing spaces
            cleaned_lines.append(line.rstrip())
        else:
            # Remove all indentation (leading whitespace)
            cleaned_lines.append(re.sub(r'^[ \t]+', '', line).rstrip())
    return "\n".join(cleaned_lines)





def is_indentation_oriented(filename: str) -> bool:
    """
    Decide if a file's language requires indentation.
    Returns True for Python, YAML, Makefile, etc.
    """
    indentation_oriented_exts = {".py", ".yaml", ".yml", ".mk"}  # extend if needed
    name = filename.lower()
    # Special cases like Makefile
    if name == "makefile":
        return True
    for ext in indentation_oriented_exts:
        if name.endswith(ext):
            return True
    return False





def FileReader(state: ExplorerState) -> ExplorerState:
    """
    Read contents of all files in state["root"] and add 'content' field.
    This function populates each file node with its content for further analysis.
    """
    for item in state["root"]:
        if item["type"] == "file":
            content = read_file(item["path"])
            if is_indentation_oriented(item["path"]):
                item["content"] = clean_code(content, indentation_oriented=True)
            else:
                item["content"] = clean_code(content, indentation_oriented=False)
    logging.info("File contents read and added to state['root'].")
    return state








def Analyzer(state: ExplorerState) -> ExplorerState:
        """
        Analyze files in the state using LLM and update each file node with analysis results.
        Handles parsing errors and stores raw output for later cleanup.
        """
        root = state["root"]
        instructions = FA_parser.get_format_instructions().replace("{", "{{").replace("}", "}}")
        code_audit_prompt = PromptTemplate(
                input_variables=["file_input"],
                template="""
You are an expert software reviewer and code auditor.

## Input
You will receive a dictionary representing a file with the following keys:
- `name` → the name of the file
- `path` → the absolute or relative path of the file
- `type` → either "file" or "directory"
- `content` → the file content (if type = "file")
- `parent` → the parent directory of the file

The input is:
{file_input}

## Task
Analyze the file and produce **structured insights** in JSON format.

## Instructions

### 1. File Classification
- Classify the file into one of:
  {{ "code file", "config file", "dependency file", "documentation", "test file", "other" }}.
- Describe the purpose of the file in `use_of_file`.
- If it is a **dependency file** (e.g., requirements.txt, package.json):
  - Extract dependencies with their versions.
  - Return them as a JSON object under the key `dependencies`.
- Detect technical requirements (e.g., Python, MySQL, Java, Docker) which are not packages but System requirements.
  - Return them as a list under the key `technical_requirements`.
- Generate a short technical documentation for the file under the key `documentation`.
  - Summarize all functions, classes, or key components and describe their roles.

### 2. Code & Security Analysis
For file content, detect and report:
- Bugs or logical issues.
- Security vulnerabilities (check against **OWASP Top 10** + any others).
- Redundancy or duplication.
- Errors (syntax, runtime, logical).
- Naming or style issues.
- Suggestions for best practices.

### 3. Structure Issues
- Collect all problems into a single `issues` list.
- Each issue must include:
  - `type_of_issue`: one of {{ "bug", "security", "error", "redundancy", "naming", "style","other" }}
  - `errors_or_vulnerabilities`: list of problems (e.g., ["index out of bound", "possible SQL injection"])
  - `explanation`: short explanation of why it is an issue
  - `suggestion`: how to fix it

### 4. Basic Improvements
- Provide a `basic_improvements` list.
- Each improvement must include:
  - `type_of_improvement`: e.g., "naming", "comments", "readability", "consistency","other"
  - `explanation`: short explanation
  - `suggestion`: improvement recommendation

### 5. Fixed Version of the File
- Provide a full corrected version of the code under the key `fix`.
- Ensure:
  - All `issues` and `basic_improvements` are addressed.
  - Logic and functionality are preserved.
  - The code remains runnable and not broken.
  - The formatting must be  clean and consistent(with out any escape sequence ex. for new line use line break instead of \n).

---





## Output Schema
Return a single JSON object per file with this structure:
{instructions}
"""
        )

        processed_count = 0
        for item in root:
                if item["type"] == "file":
                        # Skip huge generated lockfiles and assets to prevent LLM timeouts
                        fname = item.get("name", "").lower()
                        if fname in ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"] or fname.endswith(('.svg', '.png', '.min.js')):
                             logging.info(f"Skipping heavy/binary file: {fname}")
                             continue
                             
                        content = item.get("content", "")
                        # Hard cap to prevent hitting token limits on massive files
                        if len(content) > 15000:
                             logging.info(f"Skipping massive file (too many tokens): {fname}")
                             continue

                        # Cap the amount of files analyzed per run so it doesn't freeze the SSE stream
                        if processed_count >= 15:
                             logging.info("Reached maximum file analysis cap for this run. Skipping remaining.")
                             break

                        response = llm.invoke(code_audit_prompt.format(file_input=json.dumps(item, indent=2), instructions=instructions))
                        raw_text = response.content if hasattr(response, "content") else str(response)
                        try:
                                parsed: FileAnalysis = FA_parser.parse(raw_text)
                                parsed.fix= codeFormatter(parsed.fix)
                                item.update(parsed.model_dump())  # use model_dump instead of dict
                                logging.info(f"Analysis completed for file: {item['path']}")
                        except Exception as e:
                                logging.error(f"Parsing failed for {item['path']}, storing raw output for later cleanup. Error: {e}")
                                item["raw_analysis"] = raw_text
                                item["analysis_error"] = str(e)
                        
                        processed_count += 1
                        
        state["root"] = root
        return state
       
    

def dependencyAndTechicalRequirementsExtractor(state: ExplorerState) -> ExplorerState:
    """
    Extract dependencies and technical requirements from files in the state using LLM.
    Updates each file node with extracted information.
    """
    root = state["root"]
    techinal_requirements = set()
    dependecies = {}

    for item in root: 

        techinal_requirements.update(item.get("technical_requirements", []))
        if item["type"] == "file" and item.get("file_category","" )== "dependency file":
            dependecies.update(item["dependencies"])

    
    state["Technical_requirements"] = list(techinal_requirements)
    state["dependencies"] = dependecies
    logging.info("Dependencies and technical requirements extracted and added to state.")
    return state
