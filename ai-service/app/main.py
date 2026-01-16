import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

# 1. Initialize FastAPI
app = FastAPI(title="AI Service API", version="1.0.0")

# 2. Add CORS (Optional but good for frontend interaction)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include the Routes
# This mounts the routes at /api, so the URL becomes: localhost:5001/api/upload-feed
app.include_router(api_router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "online", "service": "AI Engine"}
