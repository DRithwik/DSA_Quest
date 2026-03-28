
# LLM configuration and initialization
import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os

logger = logging.getLogger(__name__)

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Initialize the LLM
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", max_tokens=100000)
logger.info("LLM initialized with model gemini-2.5-flash.")
logging.info("LLM initialized with model gemini-2.5-flash.")

