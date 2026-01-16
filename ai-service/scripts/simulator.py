import requests
import time
import os
import random
import sys
# API Configuration
API_URL = "http://localhost:8000/api/upload-feed"
BASE_IMAGE_DIR = "test_data"

# The cameras we want to simulate
# Make sure these folder names exist in 'test_data/'

# Keep track of current frame index per camera
camera_frame_index = {}


def get_cameras_from_args():
    """
    Reads camera IDs from command line arguments.
    Example: python simulator.py CAM_01 CAM_02
    """
    args = sys.argv[1:] # Skip the script name itself
    if args:
        return args
    else:
        # Default fallback if no args provided
        print("ℹ️ No args provided. Using defaults.")
        return ["CAM_001", "CAM_002"]

def get_next_image_from_folder(cam_id):
    """
    Returns the next image in order from test_data/{cam_id}/
    """
    folder_path = os.path.join(BASE_IMAGE_DIR, cam_id)

    if not os.path.exists(folder_path):
        print(f"⚠️ Warning: Folder '{folder_path}' not found.")
        return None, None

    valid_extensions = ('.jpg', '.jpeg', '.png')
    files = sorted(
        f for f in os.listdir(folder_path)
        if f.lower().endswith(valid_extensions)
    )

    if not files:
        print(f"⚠️ Warning: No images found in '{folder_path}'")
        return None, None

    # Initialize index if first time seeing this camera
    if cam_id not in camera_frame_index:
        camera_frame_index[cam_id] = 0

    index = camera_frame_index[cam_id]
    filename = files[index]
    file_path = os.path.join(folder_path, filename)

    # Move to next frame (loop back if needed)
    camera_frame_index[cam_id] = (index + 1) % len(files)

    return filename, file_path


def run_simulation():
    ACTIVE_CAMERAS = get_cameras_from_args()
    print(f"Cameras: {ACTIVE_CAMERAS}")
    print("------------------------------------------------")

    while True:
        for cam_id in ACTIVE_CAMERAS:
            
            # 1. Get an image file from the folder
            filename, file_path = get_next_image_from_folder(cam_id)
            
            if not file_path:
                continue # Skip this camera if no images found
            print (file_path)
            # 2. Read the file bytes
            try:
                with open(file_path, "rb") as f:
                    image_data = f.read()

                # 3. Send to API (camera_id + file)
                files = {'file': (filename, image_data, 'image/jpeg')}
                data = {'camera_id': cam_id} 
                
                response = requests.post(API_URL, files=files, data=data)
                
                if response.status_code == 200:
                    camera = response.json().get("camera_id", "Unknown")
                    print(f"✅ {cam_id} ({filename}) -> Sent to API ")
                else:
                    print(f"❌ {cam_id} Failed: {response.text}")

            except Exception as e:
                print(f"🔥 Error sending {cam_id}: {e}")

        # Wait 3 seconds before sending the next batch of "frames"
        print("------------------------------------------------")
        time.sleep(3)

if __name__ == "__main__":
    # Ensure directory exists
    if not os.path.exists(BASE_IMAGE_DIR):
        os.makedirs(BASE_IMAGE_DIR)
        print(f"📁 Created '{BASE_IMAGE_DIR}'. Please put your camera folders inside it!")
    else:
        run_simulation()