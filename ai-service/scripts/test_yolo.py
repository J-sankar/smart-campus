from ultralytics import YOLO
import os




# 1. Load the Model
print("⏳ Loading Model...")
model = YOLO('yolov8n.pt', save=False) 

# 2. Define path to your image
image_path = "test_images/empty_class.jpg"  # <--- CHANGE THIS to your actual file name

# Check if file exists
if not os.path.exists(image_path):
    print(f"❌ Error: Could not find image at {image_path}")
    exit()

# 3. Run Inference
print(f"👀 Scanning {image_path}...")
results = model(image_path)

# 4. Count People
person_count = 0
for result in results:
    for box in result.boxes:
        # Class ID 0 is 'person' in COCO dataset
        if int(box.cls) == 0:
            person_count += 1

print(f"✅ Success! Detected {person_count} people.")

# 5. Show/Save the result (Optional)
# This will open the image with boxes drawn on it
results[0].show() 
# Or save it to disk
# results[0].save(filename="result.jpg")
print("📸 Saved annotated image to result.jpg")


