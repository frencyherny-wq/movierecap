# AI Movie Recap

A modern AI-powered web application that transforms videos into engaging movie recaps with voice narration in multiple languages (including Burmese).

## Features

- Upload video files or paste YouTube/TikTok links
- Auto-extract transcripts using Gemini AI
- Generate engaging Burmese-style movie recaps
- Multi-language support (8 languages)
- AI voice narration with multiple narrator voices
- Subtitle/transcript preview
- Download audio and transcript
- Beautiful dark glassmorphism UI
- Mobile responsive design
- Admin dashboard with stats
- History saved in Supabase

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python |
| AI | Google Gemini 1.5 Pro |
| Database | Supabase (PostgreSQL) |
| TTS | gTTS (Google Text-to-Speech) |
| Video | FFmpeg, yt-dlp |

## Running on Replit

This project is pre-configured for Replit. Just click **Run** and everything starts automatically.

### Quick Start (Replit)

1. Click the **Run** button — `start.sh` launches both services
2. The Replit preview opens the frontend on port 3000 (mapped to external port 80)
3. Backend API runs on port 8000

### Environment Variables (Replit Secrets)

Add these in the **Secrets** tab (lock icon in sidebar):

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Your Supabase anon key |

> The app works without Supabase (history will use in-memory mock). Gemini key is required for transcription and recap generation.

### Port Configuration

| Service | Port | Replit External |
|---------|------|-----------------|
| Frontend (Next.js) | 3000 | Port 80 (preview) |
| Backend (FastAPI) | 8000 | Port 8000 |

### Manual Start (if needed)

```bash
# Start everything at once:
bash start.sh

# Or start services individually:

# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- Python 3.10+
- FFmpeg installed
- Google Gemini API key
- Supabase project (optional for dev)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn main:app --host 0.0.0.0 --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Supabase Setup

Run the following SQL in your Supabase SQL Editor:

```sql
CREATE TABLE recaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  source_url TEXT,
  transcript TEXT NOT NULL,
  recap TEXT NOT NULL,
  language TEXT DEFAULT 'my',
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE recaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON recaps FOR ALL USING (true);
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload video file |
| POST | `/api/download-url` | Download from YouTube/TikTok |
| POST | `/api/transcribe/{job_id}` | Transcribe audio |
| POST | `/api/generate-recap` | Generate AI recap |
| POST | `/api/generate-audio` | Generate voice narration |
| GET | `/api/voices` | List available voices |
| GET | `/api/languages` | List supported languages |
| GET | `/api/history` | Get recap history |
| POST | `/api/history` | Save to history |
| DELETE | `/api/history/{id}` | Delete from history |
| GET | `/api/admin/stats` | Admin statistics |

## Project Structure

```
movierecap/
├── .replit               # Replit run configuration
├── replit.nix            # Nix packages (Node, Python, FFmpeg)
├── start.sh             # Startup script for both services
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment template
│   └── services/
│       ├── video_processor.py   # FFmpeg & yt-dlp
│       ├── transcriber.py       # Gemini transcription
│       ├── recap_generator.py   # AI recap generation
│       ├── tts_engine.py        # Voice narration
│       └── supabase_client.py   # Database client
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Main page
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── globals.css      # Tailwind + custom styles
│   │   │   ├── history/         # History page
│   │   │   └── admin/           # Admin dashboard
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── VideoUploader.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   ├── StyleSelector.tsx
│   │   │   ├── VoiceSelector.tsx
│   │   │   ├── SubtitlePreview.tsx
│   │   │   └── ProgressSteps.tsx
│   │   └── lib/
│   │       └── api.ts           # API client
│   ├── package.json
│   ├── tailwind.config.ts
│   └── .env.example
└── README.md
```

## License

MIT
