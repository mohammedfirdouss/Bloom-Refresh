# Configuration module for the backend

import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///default.db")
    DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

config = Config()
