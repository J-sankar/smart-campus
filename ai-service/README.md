# 👁️ Smart Campus - AI Vision Service

The "Eyes" of the Smart Campus system. This service uses **Computer Vision (YOLOv11)** to analyze camera feeds (or simulated footage) in real-time, count the number of people in a room, and push that data to the Node.js backend.

## 🚀 Key Features

* **YOLOv11 Integration:** Uses the latest Ultralytics YOLO models for high-accuracy person detection.
* **Simulator Mode:** Capable of running without real CCTV cameras by cycling through a folder of test images (perfect for Hackathons).
* **Auto-Recovery:** If the backend goes down, the worker keeps retrying without crashing.
* **Privacy First:** Only sends *counts* (numbers) to the server, not the actual video feed.

## 🛠️ Tech Stack

* **Language:** Python 3.9+
* **AI Model:** [Ultralytics YOLOv11](https://github.com/ultralytics/ultralytics)
* **HTTP Client:** `requests` (to talk to Node.js)
* **Image Processing:** OpenCV, Pillow

---

## ⚙️ Prerequisites

Ensure you have [Python 3.9 or higher](https://www.python.org/downloads/) installed.

---

## 📥 Installation & Setup

1.  **Navigate to the AI Service directory:**
    ```bash
    cd smart-campus/ai-service
    ```

2.  **Create a Virtual Environment (Recommended):**
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Mac/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: This will automatically download `torch`, `opencv`, and `ultralytics`)*

4.  **Prepare Test Data:**
    Since we are simulating cameras, you need to provide images.
    
    * Create a folder named `test_data`.
    * Create subfolders for each camera ID you defined in the backend.
    
    ```text
    ai-service/
    └── test_data/
        ├── CAM_001/   <-- Put 5-10 images of a Lab here
        └── CAM_002/   <-- Put 5-10 images of a Classroom here
    ```

5.  **Configure Environment Variables:**
    Create a `.env` file in the `ai-service/` root:
    ```ini
    # Where is the Node.js Backend?
    NODE_API_URL=http://localhost:5000/api/rooms/update-status
    
    # Which YOLO model to use? (n = nano/fastest, m = medium/accurate)
    YOLO_MODEL=yolo11n.pt
    ```

---

## 🏃‍♂️ How to Run

### 1. Start the AI Worker
This script acts as the main engine. It loops through your cameras, runs detection, and updates the backend.

```bash
python -m app.worker
python -m simulator.py FOLDER_NAME_1 FOLDER_NAME_2

```
--- 

### 2. Start the Application 
Run the FastAPI application using unicorn

```bash
python run.py
```
