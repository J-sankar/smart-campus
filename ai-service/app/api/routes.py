import redis
import json
import time
from fastapi import  UploadFile, File, Form, HTTPException, APIRouter
from ..core.config import  QUEUE_NAME
from  ..core.redis_client import redis_client


router = APIRouter()

@router.post("/upload-feed")
async def upload_feed(
    camera_id: str = Form(...),  # 👈 Now accepts camera_id
    file: UploadFile = File(...)
):

    if not camera_id:
        # If we don't recognize the camera, reject the image
        raise HTTPException(status_code=400, detail=f"No camera id found")

    # 2. Process Image
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty file")

    # 3. Create Payload (We use the mapped room_id here)
    payload = {
        "camera_id": camera_id, # Optional: Pass original ID for logging
        "timestamp": time.time(),
        "image_hex": image_bytes.hex()
    }

    try:
        redis_client.rpush(QUEUE_NAME, json.dumps(payload))
        print(f"📥 Queued: {camera_id} ")
        return {"status": "queued", "cam_id": camera_id}
    except Exception as e:
        return {"status": "error", "message": str(e)}
