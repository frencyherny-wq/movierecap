import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

STYLE_PROMPTS = {
    "dramatic": "Write in a dramatic, suspenseful narration style like a movie trailer voiceover.",
    "casual": "Write in a casual, friendly conversational tone like explaining the movie to a friend.",
    "funny": "Write in a humorous, witty style with clever observations and jokes.",
    "professional": "Write in a professional, documentary-style narration.",
}

LANGUAGE_INSTRUCTIONS = {
    "my": "Write the recap in Burmese (Myanmar) language. Use natural Myanmar script and conversational tone popular in Burmese movie recap channels.",
    "en": "Write the recap in English.",
    "th": "Write the recap in Thai language.",
    "zh": "Write the recap in Simplified Chinese.",
    "ja": "Write the recap in Japanese.",
    "ko": "Write the recap in Korean.",
    "hi": "Write the recap in Hindi.",
    "vi": "Write the recap in Vietnamese.",
}


def generate_recap(transcript: str, language: str = "my", style: str = "dramatic") -> str:
    """Generate an engaging movie recap using Gemini API"""
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")

        style_instruction = STYLE_PROMPTS.get(style, STYLE_PROMPTS["dramatic"])
        lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["my"])

        prompt = f"""You are an expert movie recap narrator. Your job is to take a movie transcript 
and create an engaging, captivating movie recap that keeps viewers hooked.

{style_instruction}

{lang_instruction}

Guidelines:
- Start with a hook that grabs attention
- Summarize the plot in chronological order
- Highlight key dramatic moments
- Build suspense and tension
- End with a satisfying conclusion or cliffhanger
- Keep it concise but engaging (aim for 3-5 minutes of narration when read aloud)
- Use vivid language and emotional descriptions
- Break into natural paragraphs for subtitle timing

Here is the transcript to recap:

{transcript}

Generate the movie recap now:"""

        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise Exception(f"Recap generation failed: {str(e)}")
