import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const uploadVideo = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const downloadFromUrl = async (url: string) => {
  const response = await api.post('/api/download-url', { url })
  return response.data
}

export const transcribeAudio = async (jobId: string) => {
  const response = await api.post(`/api/transcribe/${jobId}`)
  return response.data
}

export const generateRecap = async (transcript: string, language: string, style: string) => {
  const response = await api.post('/api/generate-recap', {
    transcript,
    language,
    style,
  })
  return response.data
}

export const generateAudio = async (text: string, voice: string, language: string) => {
  const response = await api.post('/api/generate-audio', {
    text,
    voice,
    language,
  })
  return response.data
}

export const getVoices = async () => {
  const response = await api.get('/api/voices')
  return response.data
}

export const getLanguages = async () => {
  const response = await api.get('/api/languages')
  return response.data
}

export const getHistory = async (limit = 20, offset = 0) => {
  const response = await api.get(`/api/history?limit=${limit}&offset=${offset}`)
  return response.data
}

export const saveHistory = async (data: {
  title: string
  source_url?: string
  transcript: string
  recap: string
  language: string
  audio_url?: string
}) => {
  const response = await api.post('/api/history', data)
  return response.data
}

export const deleteHistory = async (id: string) => {
  const response = await api.delete(`/api/history/${id}`)
  return response.data
}

export const getAdminStats = async () => {
  const response = await api.get('/api/admin/stats')
  return response.data
}

export const getAudioUrl = (jobId: string) => `${API_BASE}/api/audio/${jobId}`

export default api
