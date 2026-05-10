from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import os
import uuid
import json
from dotenv import load_dotenv

load_dotenv()

from services.video_processor import extract_audio, download_video
from services.transcriber import transcribe_audio
from services.recap_generator import generate_recap
from services.tts_engine import generate_narration, get_available_voices
from services.supabase_client import supabase_client

app = FastAPI(title="AI Movie Recap API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


class URLInput(BaseModel):
    url: str


class RecapRequest(BaseModel):
    transcript: str
    language: str = "my"  # Burmese by default
    style: str = "dramatic"


class TTSRequest(BaseModel):
    text: str
    voice: str = "en-US-1"
    language: str = "en"


class HistoryItem(BaseModel):
    title: str
    source_url: Optional[str] = None
    transcript: str
    recap: str
    language: str
    audio_url: Optional[str] = None


@app.get("/")
async def root():
    return {"message": "AI Movie Recap API is running", "version": "1.0.0"}


@app.post("/api/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file and extract audio"""
    job_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}{file_ext}")

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    try:
        audio_path = extract_audio(file_path, job_id)
        return {"job_id": job_id, "audio_path": audio_path, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/download-url")
async def download_from_url(data: URLInput):
    """Download video from YouTube/TikTok URL"""
    job_id = str(uuid.uuid4())
    try:
        result = download_video(data.url, job_id)
        return {"job_id": job_id, **result, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/transcribe/{job_id}")
async def transcribe(job_id: str):
    """Transcribe audio to text"""
    audio_path = os.path.join(OUTPUT_DIR, f"{job_id}.mp3")
    if not os.path.exists(audio_path):
        audio_path = os.path.join(OUTPUT_DIR, f"{job_id}.wav")
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio file not found")

    try:
        transcript = transcribe_audio(audio_path)
        return {"job_id": job_id, "transcript": transcript, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-recap")
async def create_recap(request: RecapRequest):
    """Generate movie recap using Gemini API"""
    try:
        recap = generate_recap(
            transcript=request.transcript,
            language=request.language,
            style=request.style,
        )
        return {"recap": recap, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-audio")
async def create_audio(request: TTSRequest):
    """Generate AI voice narration"""
    job_id = str(uuid.uuid4())
    try:
        audio_path = generate_narration(
            text=request.text,
            voice=request.voice,
            language=request.language,
            job_id=job_id,
        )
        return {"job_id": job_id, "audio_url": f"/api/audio/{job_id}", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/audio/{job_id}")
async def get_audio(job_id: str):
    """Download generated audio"""
    audio_path = os.path.join(OUTPUT_DIR, f"{job_id}_narration.mp3")
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio not found")
    return FileResponse(audio_path, media_type="audio/mpeg", filename=f"recap_{job_id}.mp3")


@app.get("/api/voices")
async def list_voices():
    """Get available narrator voices"""
    voices = get_available_voices()
    return {"voices": voices}


@app.get("/api/languages")
async def list_languages():
    """Get supported languages"""
    return {
        "languages": [
            {"code": "my", "name": "Burmese (Myanmar)", "flag": "🇲🇲"},
            {"code": "en", "name": "English", "flag": "🇺🇸"},
            {"code": "th", "name": "Thai", "flag": "🇹🇭"},
            {"code": "zh", "name": "Chinese", "flag": "🇨🇳"},
            {"code": "ja", "name": "Japanese", "flag": "🇯🇵"},
            {"code": "ko", "name": "Korean", "flag": "🇰🇷"},
            {"code": "hi", "name": "Hindi", "flag": "🇮🇳"},
            {"code": "vi", "name": "Vietnamese", "flag": "🇻🇳"},
        ]
    }


# History endpoints
@app.post("/api/history")
async def save_history(item: HistoryItem):
    """Save recap to history"""
    try:
        result = supabase_client.table("recaps").insert({
            "title": item.title,
            "source_url": item.source_url,
            "transcript": item.transcript,
            "recap": item.recap,
            "language": item.language,
            "audio_url": item.audio_url,
        }).execute()
        return {"status": "success", "data": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/history")
async def get_history(limit: int = 20, offset: int = 0):
    """Get recap history"""
    try:
        result = supabase_client.table("recaps").select("*").order(
            "created_at", desc=True
        ).range(offset, offset + limit - 1).execute()
        return {"data": result.data, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/history/{recap_id}")
async def delete_history(recap_id: str):
    """Delete a recap from history"""
    try:
        supabase_client.table("recaps").delete().eq("id", recap_id).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Admin endpoints
@app.get("/api/admin/stats")
async def admin_stats():
    """Get admin dashboard stats"""
    try:
        total_recaps = supabase_client.table("recaps").select("id", count="exact").execute()
        return {
            "total_recaps": total_recaps.count or 0,
            "status": "success",
        }
    except Exception as e:
        return {"total_recaps": 0, "status": "error", "message": str(e)}
