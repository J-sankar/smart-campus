import os
import requests
import time
import random

# 🔧 CONFIGURATION
BASE_DIR = "test_data"

# 📦 DATA PACK 2 (New, distinct images)
NEW_IMAGES = {
    "CAM_001": [  # BUSY AREAS (Crowds, Queues, Cafeterias)
        "https://images.unsplash.com/photo-1560439514-e960a3ef5019?w=800&q=80", # Crowded meeting
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80", # Busy co-working space
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80", # Tech workshop
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80", # Group of students
        "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80", # Library Crowd
    ],
    "CAM_002": [  # EMPTY AREAS (Ghost Booking Tests)
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80", # Empty Boardroom
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80", # Empty Office Hall
        "https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&q=80", # Empty Industrial Space
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", # Empty Desk (Close up)
    ],
    "CAM_LAB": [  # MIXED / LABS
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80", # Engineer in Lab
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", # Tech Lab Equipment
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", # Single person laptop
    ]
}

def download_file(url, folder, prefix="v2"):
    # Generate a random ID to prevent overwriting old files
    rand_id = random.randint(1000, 9999)
    filename = f"{prefix}_{rand_id}.jpg"
    file_path = os.path.join(folder, filename)

    try:
        print(f"   ⬇️  Fetching: {filename}...", end=" ")
        headers = {'User-Agent': 'Mozilla/5.0'}
        r = requests.get(url, headers=headers, timeout=10)
        
        if r.status_code == 200:
            with open(file_path, 'wb') as f:
                f.write(r.content)
            print("✅ Done.")
        else:
            print(f"❌ Failed (Status {r.status_code})")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("🚀 Adding 'Volume 2' Data to Directories...")
    
    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)

    for cam_id, urls in NEW_IMAGES.items():
        print(f"\n📂 Updating {cam_id}...")
        cam_folder = os.path.join(BASE_DIR, cam_id)
        
        if not os.path.exists(cam_folder):
            os.makedirs(cam_folder)

        for url in urls:
            download_file(url, cam_folder)
            time.sleep(0.5) 

    print("\n✨ Database Updated! Run simulator now.")

if __name__ == "__main__":
    main()