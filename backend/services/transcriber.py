import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio using Gemini API with audio understanding"""
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")

        # Upload the audio file
        audio_file = genai.upload_file(audio_path)

        response = model.generate_content(
            [
                "Please transcribe this audio accurately. "
                "Include all spoken words. If there are multiple speakers, "
                "indicate speaker changes. Return only the transcription text.",
                audio_file,
            ]
        )

        return response.text
    except Exception as e:
        raise Exception(f"Transcription failed: {str(e)}")
