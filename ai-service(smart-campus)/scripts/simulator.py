import requests
import time
import cv2
import os
import threading
import sys

# ================= CONFIGURATION =================
# 1. API Endpoint (Matches your Backend Port 8000)
API_URL = "http://localhost:8000/api/upload-feed"

# 2. Upload Interval (Seconds)
# How often to send a frame to the backend. 
# 2.0 = Every 2 seconds per camera.
UPLOAD_INTERVAL = 2.0 

# 3. Path Setup (Automatic)
# Finds the directory where THIS script is running
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Goes up one level to project root, then down to 'test_data'
VIDEO_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), 'test_data')

# 4. Camera Configuration
# Map Camera IDs to video filenames inside 'test_data'
CAM_CONFIG = {
    "CAM001": "CAM001.mp4", 
    "CAM002": "CAM002.mp4",
    # You can reuse videos for testing more rooms
    # "CAM003": "CAM001.mp4", 
    # "CAM004": "CAM002.mp4",
}
# =================================================

# Global event to stop threads safely on Ctrl+C
stop_event = threading.Event()

class CameraThread(threading.Thread):
    def __init__(self, cameraId, video_filename, api_url, interval):
        super().__init__()
        self.cameraId = cameraId
        self.video_path = os.path.join(VIDEO_DIR, video_filename)
        self.api_url = api_url
        self.interval = interval
        self.daemon = True # Thread dies if main program dies

    def run(self):
        # 1. Verify File Exists
        if not os.path.exists(self.video_path):
            print(f"❌ {self.cameraId} Error: File not found at {self.video_path}")
            return

        print(f"🟢 {self.cameraId} started (Source: {os.path.basename(self.video_path)})")
        
        # 2. Open Video
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            print(f"❌ {self.cameraId} Error: Could not open video.")
            return

        last_upload_time = 0

        while not stop_event.is_set():
            ret, frame = cap.read()

            # 3. Handle Looping (Rewind if video ends)
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            # 4. Check Upload Timer
            current_time = time.time()
            if current_time - last_upload_time > self.interval:
                
                # Encode frame to JPG
                success, encoded_image = cv2.imencode('.jpg', frame)
                
                if success:
                    self.upload_frame(encoded_image.tobytes(), current_time)
                
                last_upload_time = current_time

            # Small sleep to save CPU (since we aren't showing a GUI window)
            time.sleep(0.01)

        cap.release()
        print(f"🔴 {self.cameraId} stopped.")

    def upload_frame(self, image_bytes, timestamp):
        filename = f"{self.cameraId}_{int(timestamp)}.jpg"
        
        # Prepare the payload
        files = {'file': (filename, image_bytes, 'image/jpeg')}
        data = {'cameraId': self.cameraId} 

        try:
            # Send to Node.js Backend
            response = requests.post(self.api_url, files=files, data=data, timeout=2)
            
            if response.status_code == 200:
                print(f"✅ {self.cameraId} Uploaded Snapshot")
            else:
                print(f"⚠️ {self.cameraId} Upload Failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"🔥 {self.cameraId} Connection Error: {e}")

def main():
    print(f"🚀 Starting Smart Campus Simulator")
    print(f"📂 Video Folder: {VIDEO_DIR}")
    print("------------------------------------------------")

    # Double check directory
    if not os.path.exists(VIDEO_DIR):
        print(f"❌ CRITICAL: The folder '{VIDEO_DIR}' does not exist!")
        print(f"   Please create it and put .mp4 files inside.")
        return

    threads = []

    # Start a thread for each camera
    for cameraId, filename in CAM_CONFIG.items():
        thread = CameraThread(cameraId, filename, API_URL, UPLOAD_INTERVAL)
        thread.start()
        threads.append(thread)

    if not threads:
        print("⚠️ No cameras configured. Check CAM_CONFIG.")
        return

    # Keep main program running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping simulation...")
        stop_event.set()

    # Wait for threads to close
    for t in threads:
        t.join()
    print("✅ Simulation ended cleanly.")

if __name__ == "__main__":
    main()