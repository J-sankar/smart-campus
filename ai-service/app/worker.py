import json
import asyncio
import numpy as np
import cv2
import sys

# 👇 IMPORT THE SINGLE INSTANCE
from .core.redis_client import redis_client
from .core.config import QUEUE_NAME
from .services.detector import detector
from .services.notifier import push_to_node_backend

print(f"👷 Worker Listening on Queue: '{QUEUE_NAME}'...")

def start_worker():
    while True:
        try:
            # 👇 USE THE SINGLE INSTANCE
            # BLPOP blocks here until data arrives
            task = redis_client.blpop(QUEUE_NAME, timeout=0)
            
            if task:
                raw_data = task[1]
                data = json.loads(raw_data)
                
                camera_id = data.get('camera_id')
                image_hex = data.get('image_hex')
                
                print(f"⚡ Processing Job for Camera: {camera_id}")

                # Decode Image
                image_bytes = bytes.fromhex(image_hex)
                nparr = np.frombuffer(image_bytes, np.uint8)
                image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                # Run YOLO
                person_count = detector.detect_people(image)

                # Send to Node
                asyncio.run(push_to_node_backend(camera_id, person_count))
                
                print(f"✅ Camera {camera_id} Checked. Found: {person_count}")

        except KeyboardInterrupt:
            print("\n🛑 Worker stopping...")
            break
        except Exception as e:
            print(f"❌ Worker Error: {e}")

if __name__ == "__main__":
    start_worker()