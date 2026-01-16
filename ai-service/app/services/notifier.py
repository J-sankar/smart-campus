import httpx
import asyncio
from ..core.config import NODE_BACKEND_URL

async def push_to_node_backend(camera_id: str, count: int):
    """
    Sends the detected occupancy data to the Node.js backend.
    """
    
    # Aligning JSON keys with typical Node.js/Mongoose conventions (camelCase)
    payload = {
        "cameraId": camera_id,
        "personCount": count
    }

    try:
        # Use AsyncClient for non-blocking HTTP requests
        async with httpx.AsyncClient() as client:
            response = await client.post(NODE_BACKEND_URL, json=payload)
            
            if response.status_code == 200 or response.status_code == 201:
                # Success - Node.js received it
                print(f"Successfully send data for camera : {camera_id} \n payload: {payload}")
                pass 
            else:
                print(f"⚠️  Node Backend returned error: {response.status_code} - {response.text}")

    except httpx.ConnectError:
        print(f"❌ Failed to connect to Node.js at {NODE_BACKEND_URL}. Is it running?")
    except Exception as e:
        print(f"❌ Error sending data to Node: {e}")