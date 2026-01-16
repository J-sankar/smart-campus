from ultralytics import YOLO
from ..core.config import MODEL_PATH

class OccupancyDetector:
    def __init__(self, model_path=MODEL_PATH):
        print("⏳ Loading YOLO Model...")
        self.model = YOLO(model_path)
        print("✅ Model Loaded Successfully!")

    def detect_people(self, image_path, confidence=0.3):
        """
        Scans an image and returns the count of people.
        """
        results = self.model(image_path, conf=confidence, save=False)
        
        # Since this is a single-class (person-only) model:
        return len(results[0].boxes)

# Singleton instance (loaded once at app startup)
detector = OccupancyDetector()
