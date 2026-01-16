import redis
import sys
from .config import REDIS_HOST, REDIS_PORT, REDIS_DB

# Create a single Redis client instance
try:
    # decode_responses=False is crucial for images (binary data)
    redis_client = redis.Redis(
        host=REDIS_HOST, 
        port=REDIS_PORT, 
        db=REDIS_DB,
        decode_responses=False 
    )
    
    # Quick check to see if Redis is actually running
    redis_client.ping()
    print(f"✅ Connected to Redis at {REDIS_HOST}:{REDIS_PORT}")

except redis.ConnectionError:
    print(f"❌ CRITICAL: Could not connect to Redis at {REDIS_HOST}:{REDIS_PORT}")
    # In a real app, you might want to exit if Redis is missing
    # sys.exit(1) 
except Exception as e:
    print(f"❌ Redis Error: {e}")