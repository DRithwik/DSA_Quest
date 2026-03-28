
# Output parser schemas for directory exploration and file analysis
import logging
from pydantic import BaseModel, Field
from typing import List, Dict, Literal
from langchain_core.output_parsers import PydanticOutputParser

logger = logging.getLogger(__name__)
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

class DirectoryExplorerOutput(BaseModel):
    decision: Literal["continue","stop"]         # "continue" or "stop"
    remove: List[str] = [] # junk directory paths

class Issue(BaseModel):
    type_of_issue: str
    errors_or_vulnerabilities: List[str]
    explanation: str
    suggestion: str

class BasicImprovement(BaseModel):
    type_of_improvement: str
    explanation: str
    suggestion: str

class FileAnalysis(BaseModel):
    file_path: str
    file_category: Literal["code file", "config file", "dependency file", "documentation", "test file", "other"]
    use_of_file: str
    technical_requirements: List[str] = Field(default_factory=list)
    documentation: str
    dependencies: Dict[str, str] = Field(default_factory=dict)
    issues: List[Issue] = Field(default_factory=list)
    basic_improvements: List[BasicImprovement] = Field(default_factory=list)
    fix: str

# Create output parsers
DEO_parser = PydanticOutputParser(pydantic_object=DirectoryExplorerOutput)
FA_parser = PydanticOutputParser(pydantic_object=FileAnalysis)
logging.info("Output parsers for directory and file analysis initialized.")