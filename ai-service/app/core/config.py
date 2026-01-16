import os
from dotenv import load_dotenv

# Load environment variables from a .env file if it exists
load_dotenv()

# ==========================================
# 🔴 REDIS CONFIGURATION (The Queue)
# ==========================================
# The host where Redis is running (use 'redis' if running in Docker)
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

# The name of the list key used for the queue
QUEUE_NAME = os.getenv("QUEUE_NAME", "camera_queue")

# ==========================================
# 🟢 NODE.JS BACKEND CONFIGURATION
# ==========================================
# Where to send the final person count?
NODE_BACKEND_URL = os.getenv("NODE_API_URL", "http://localhost:5000/api/rooms/update")

# ==========================================
# 🧠 AI MODEL CONFIGURATION
# ==========================================
# Path to the YOLO weights file
MODEL_PATH = os.getenv("MODEL_PATH", "yolov8n.pt")

# Minimum confidence to count an object as a person (0.0 to 1.0)
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", 0.3))

# ==========================================
# ⚙️ SYSTEM SETTINGS
# ==========================================
# Set to True to print detailed logs during inference
DEBUG_MODE = os.getenv("DEBUG_MODE", "True").lower() == "true"