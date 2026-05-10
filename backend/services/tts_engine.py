import os
from gtts import gTTS

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

VOICES = [
    {"id": "en-US-1", "name": "English (US) - Male", "language": "en", "tld": "com"},
    {"id": "en-UK-1", "name": "English (UK) - Female", "language": "en", "tld": "co.uk"},
    {"id": "en-AU-1", "name": "English (AU) - Female", "language": "en", "tld": "com.au"},
    {"id": "en-IN-1", "name": "English (India)", "language": "en", "tld": "co.in"},
    {"id": "my-1", "name": "Myanmar (Burmese)", "language": "my", "tld": "com"},
    {"id": "th-1", "name": "Thai", "language": "th", "tld": "com"},
    {"id": "zh-1", "name": "Chinese (Mandarin)", "language": "zh-CN", "tld": "com"},
    {"id": "ja-1", "name": "Japanese", "language": "ja", "tld": "com"},
    {"id": "ko-1", "name": "Korean", "language": "ko", "tld": "com"},
    {"id": "hi-1", "name": "Hindi", "language": "hi", "tld": "co.in"},
    {"id": "vi-1", "name": "Vietnamese", "language": "vi", "tld": "com"},
]


def get_available_voices() -> list:
    """Return list of available narrator voices"""
    return VOICES


def generate_narration(text: str, voice: str, language: str, job_id: str) -> str:
    """Generate TTS narration audio"""
    output_path = os.path.join(OUTPUT_DIR, f"{job_id}_narration.mp3")

    # Find voice config
    voice_config = next((v for v in VOICES if v["id"] == voice), VOICES[0])

    try:
        tts = gTTS(
            text=text,
            lang=voice_config["language"],
            tld=voice_config["tld"],
            slow=False,
        )
        tts.save(output_path)
        return output_path
    except Exception as e:
        raise Exception(f"TTS generation failed: {str(e)}")
