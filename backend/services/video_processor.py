import os
import subprocess
import yt_dlp

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def extract_audio(video_path: str, job_id: str) -> str:
    """Extract audio from uploaded video file using FFmpeg"""
    output_path = os.path.join(OUTPUT_DIR, f"{job_id}.mp3")

    cmd = [
        "ffmpeg", "-i", video_path,
        "-vn", "-acodec", "libmp3lame",
        "-ab", "192k", "-ar", "44100",
        "-y", output_path
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"FFmpeg error: {result.stderr}")

    # Clean up original video
    if os.path.exists(video_path):
        os.remove(video_path)

    return output_path


def download_video(url: str, job_id: str) -> dict:
    """Download video from YouTube/TikTok and extract audio"""
    output_path = os.path.join(OUTPUT_DIR, f"{job_id}.mp3")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": os.path.join(OUTPUT_DIR, f"{job_id}.%(ext)s"),
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
        "quiet": True,
        "no_warnings": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        title = info.get("title", "Unknown")
        duration = info.get("duration", 0)

    return {
        "audio_path": output_path,
        "title": title,
        "duration": duration,
    }
