import requests
import time
import cv2
import os
import threading
import sys

# ================= CONFIGURATION =================
API_URL = "http://localhost:8000/api/upload-feed"
UPLOAD_INTERVAL = 2.0 

# 1. SETUP PATHS AUTOMATICALLY
# Get the absolute path of the folder where THIS script lives (scripts/)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Go up one level to the project root, then down into test-data
VIDEO_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), 'test_data')

# 2. MAP CAMERAS TO FILES
# Just use the filename here. The code below will add the full path.
CAM_CONFIG = {
    "CAM001": "CAM001.mp4",  # Make sure these files exist inside test-data/
    "CAM002": "CAM002.mp4",
    # "CAM003": "classroom_101.mp4"   # Reusing the same video for a 3rd camera
}
# =================================================

# Global event to control stopping all threads safely
stop_event = threading.Event()

class CameraThread(threading.Thread):
    def __init__(self, camera_id, video_filename, api_url, interval):
        super().__init__()
        self.camera_id = camera_id
        
        # Combine the directory path with the filename
        self.video_path = os.path.join(VIDEO_DIR, video_filename)
        
        self.api_url = api_url
        self.interval = interval
        self.daemon = True 

    def run(self):
        # Verify file exists before starting
        if not os.path.exists(self.video_path):
            print(f"❌ {self.camera_id} Error: File not found at {self.video_path}")
            return

        print(f"🟢 {self.camera_id} started (File: {os.path.basename(self.video_path)})")
        
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            print(f"❌ {self.camera_id} Error: Could not open video.")
            return

        last_upload_time = 0

        while not stop_event.is_set():
            ret, frame = cap.read()

            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            current_time = time.time()
            if current_time - last_upload_time > self.interval:
                success, encoded_image = cv2.imencode('.jpg', frame)
                if success:
                    self.upload_frame(encoded_image.tobytes(), current_time)
                last_upload_time = current_time

            time.sleep(0.01)

        cap.release()
        print(f"🔴 {self.camera_id} stopped.")

    def upload_frame(self, image_bytes, timestamp):
        filename = f"{self.camera_id}_{int(timestamp)}.jpg"
        files = {'file': (filename, image_bytes, 'image/jpeg')}
        data = {'camera_id': self.camera_id}
        print("camera_id: ",self.camera_id )
        try:
            response = requests.post(self.api_url, files=files, data=data, timeout=2)
            if response.status_code == 200:
                print(f"✅ {self.camera_id} Uploaded")
            else:
                print(f"⚠️ {self.camera_id} Error: {response.status_code}")
        except Exception as e:
            print(f"🔥 {self.camera_id} Connection Failed: {e}")

def main():
    print(f"🚀 Starting Threaded Simulation")
    print(f"📂 Looking for videos in: {VIDEO_DIR}")
    print("------------------------------------------------")

    # Verify directory exists
    if not os.path.exists(VIDEO_DIR):
        print(f"❌ CRITICAL ERROR: The folder '{VIDEO_DIR}' does not exist.")
        return

    threads = []

    for camera_id, filename in CAM_CONFIG.items():
        thread = CameraThread(camera_id, filename, API_URL, UPLOAD_INTERVAL)
        thread.start()
        threads.append(thread)

    if not threads:
        print("⚠️ No cameras started. Check your CAM_CONFIG filenames.")
        return

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping all cameras...")
        stop_event.set()

    for t in threads:
        t.join()
    print("✅ Simulation ended.")

if __name__ == "__main__":
    main()