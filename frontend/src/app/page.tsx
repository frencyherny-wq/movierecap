'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import VideoUploader from '@/components/VideoUploader'
import LanguageSelector from '@/components/LanguageSelector'
import StyleSelector from '@/components/StyleSelector'
import VoiceSelector from '@/components/VoiceSelector'
import ProgressSteps from '@/components/ProgressSteps'
import SubtitlePreview from '@/components/SubtitlePreview'
import {
  uploadVideo,
  downloadFromUrl,
  transcribeAudio,
  generateRecap,
  generateAudio,
  getAudioUrl,
  getVoices,
  getLanguages,
  saveHistory,
} from '@/lib/api'

type StepStatus = 'pending' | 'active' | 'completed' | 'error'

interface Step {
  id: string
  label: string
  status: StepStatus
}

const DEFAULT_LANGUAGES = [
  { code: 'my', name: 'Burmese (Myanmar)', flag: '\u{1F1F2}\u{1F1F2}' },
  { code: 'en', name: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'th', name: 'Thai', flag: '\u{1F1F9}\u{1F1ED}' },
  { code: 'zh', name: 'Chinese', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'ja', name: 'Japanese', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'ko', name: 'Korean', flag: '\u{1F1F0}\u{1F1F7}' },
  { code: 'hi', name: 'Hindi', flag: '\u{1F1EE}\u{1F1F3}' },
  { code: 'vi', name: 'Vietnamese', flag: '\u{1F1FB}\u{1F1F3}' },
]

const DEFAULT_VOICES = [
  { id: 'en-US-1', name: 'English (US) - Male', language: 'en' },
  { id: 'en-UK-1', name: 'English (UK) - Female', language: 'en' },
  { id: 'en-AU-1', name: 'English (AU) - Female', language: 'en' },
  { id: 'my-1', name: 'Myanmar (Burmese)', language: 'my' },
  { id: 'th-1', name: 'Thai', language: 'th' },
  { id: 'zh-1', name: 'Chinese (Mandarin)', language: 'zh' },
  { id: 'ja-1', name: 'Japanese', language: 'ja' },
  { id: 'ko-1', name: 'Korean', language: 'ko' },
  { id: 'hi-1', name: 'Hindi', language: 'hi' },
  { id: 'vi-1', name: 'Vietnamese', language: 'vi' },
]

export default function Home() {
  const [languages, setLanguages] = useState(DEFAULT_LANGUAGES)
  const [voices, setVoices] = useState(DEFAULT_VOICES)
  const [selectedLanguage, setSelectedLanguage] = useState('my')
  const [selectedVoice, setSelectedVoice] = useState('my-1')
  const [selectedStyle, setSelectedStyle] = useState('dramatic')
  const [isProcessing, setIsProcessing] = useState(false)
  const [jobId, setJobId] = useState('')
  const [transcript, setTranscript] = useState('')
  const [recap, setRecap] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')

  const [steps, setSteps] = useState<Step[]>([
    { id: 'download', label: 'Download', status: 'pending' },
    { id: 'transcribe', label: 'Transcribe', status: 'pending' },
    { id: 'recap', label: 'Generate Recap', status: 'pending' },
    { id: 'audio', label: 'Create Audio', status: 'pending' },
  ])

  useEffect(() => {
    // Try to fetch from API, fallback to defaults
    getLanguages().then(res => setLanguages(res.languages)).catch(() => {})
    getVoices().then(res => setVoices(res.voices)).catch(() => {})
  }, [])

  const updateStep = (id: string, status: StepStatus) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const resetSteps = () => {
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending' as StepStatus })))
    setTranscript('')
    setRecap('')
    setAudioUrl('')
  }

  const handleUrlSubmit = async (url: string) => {
    setIsProcessing(true)
    resetSteps()

    try {
      // Step 1: Download
      updateStep('download', 'active')
      const downloadResult = await downloadFromUrl(url)
      setJobId(downloadResult.job_id)
      setVideoTitle(downloadResult.title || 'Untitled')
      updateStep('download', 'completed')
      toast.success('Video downloaded successfully!')

      // Step 2: Transcribe
      updateStep('transcribe', 'active')
      const transcriptResult = await transcribeAudio(downloadResult.job_id)
      setTranscript(transcriptResult.transcript)
      updateStep('transcribe', 'completed')
      toast.success('Transcription complete!')

      // Step 3: Generate Recap
      updateStep('recap', 'active')
      const recapResult = await generateRecap(
        transcriptResult.transcript,
        selectedLanguage,
        selectedStyle
      )
      setRecap(recapResult.recap)
      updateStep('recap', 'completed')
      toast.success('Recap generated!')

      // Step 4: Generate Audio
      updateStep('audio', 'active')
      const audioResult = await generateAudio(recapResult.recap, selectedVoice, selectedLanguage)
      setAudioUrl(getAudioUrl(audioResult.job_id))
      updateStep('audio', 'completed')
      toast.success('Audio narration ready!')

      // Save to history
      try {
        await saveHistory({
          title: downloadResult.title || 'Untitled Recap',
          source_url: url,
          transcript: transcriptResult.transcript,
          recap: recapResult.recap,
          language: selectedLanguage,
          audio_url: getAudioUrl(audioResult.job_id),
        })
      } catch (e) {
        // History save is optional
      }
    } catch (error: any) {
      const failedStep = steps.find(s => s.status === 'active')
      if (failedStep) updateStep(failedStep.id, 'error')
      toast.error(error?.response?.data?.detail || 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    resetSteps()

    try {
      // Step 1: Upload
      updateStep('download', 'active')
      const uploadResult = await uploadVideo(file)
      setJobId(uploadResult.job_id)
      setVideoTitle(file.name)
      updateStep('download', 'completed')
      toast.success('File uploaded successfully!')

      // Step 2: Transcribe
      updateStep('transcribe', 'active')
      const transcriptResult = await transcribeAudio(uploadResult.job_id)
      setTranscript(transcriptResult.transcript)
      updateStep('transcribe', 'completed')
      toast.success('Transcription complete!')

      // Step 3: Generate Recap
      updateStep('recap', 'active')
      const recapResult = await generateRecap(
        transcriptResult.transcript,
        selectedLanguage,
        selectedStyle
      )
      setRecap(recapResult.recap)
      updateStep('recap', 'completed')
      toast.success('Recap generated!')

      // Step 4: Generate Audio
      updateStep('audio', 'active')
      const audioResult = await generateAudio(recapResult.recap, selectedVoice, selectedLanguage)
      setAudioUrl(getAudioUrl(audioResult.job_id))
      updateStep('audio', 'completed')
      toast.success('Audio narration ready!')
    } catch (error: any) {
      const failedStep = steps.find(s => s.status === 'active')
      if (failedStep) updateStep(failedStep.id, 'error')
      toast.error(error?.response?.data?.detail || 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadTranscript = () => {
    const blob = new Blob([recap || transcript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recap_${videoTitle || 'transcript'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8 md:py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Movie Recap
          </span>
        </h1>
        <p className="text-dark-300 text-lg md:text-xl max-w-2xl mx-auto">
          Transform any video into an engaging movie recap with AI-powered narration 
          in multiple languages. Burmese recap style included!
        </p>
      </div>

      {/* Video Input */}
      <VideoUploader
        onFileUpload={handleFileUpload}
        onUrlSubmit={handleUrlSubmit}
        isLoading={isProcessing}
      />

      {/* Settings */}
      <div className="grid gap-6">
        <LanguageSelector
          languages={languages}
          selected={selectedLanguage}
          onSelect={setSelectedLanguage}
        />
        <StyleSelector
          selected={selectedStyle}
          onSelect={setSelectedStyle}
        />
        <VoiceSelector
          voices={voices}
          selected={selectedVoice}
          onSelect={setSelectedVoice}
        />
      </div>

      {/* Progress */}
      {steps.some(s => s.status !== 'pending') && (
        <ProgressSteps steps={steps} />
      )}

      {/* Results */}
      {transcript && (
        <SubtitlePreview text={transcript} title="Original Transcript" />
      )}

      {recap && (
        <>
          <SubtitlePreview text={recap} title="AI Movie Recap" />
          
          {/* Audio Player & Downloads */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span>Audio & Downloads</span>
            </h3>
            
            {audioUrl && (
              <audio controls className="w-full rounded-lg">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

            <div className="flex flex-wrap gap-3">
              {audioUrl && (
                <a
                  href={audioUrl}
                  download
                  className="btn-primary text-sm inline-flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Audio</span>
                </a>
              )}
              <button
                onClick={handleDownloadTranscript}
                className="btn-secondary text-sm inline-flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Transcript</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Features Grid */}
      {!isProcessing && !recap && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-dark-400">AI-powered processing generates recaps in minutes</p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Multi-Language</h3>
            <p className="text-sm text-dark-400">Support for Burmese, English, Thai, Chinese & more</p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">AI Narration</h3>
            <p className="text-sm text-dark-400">Choose from multiple AI voices for narration</p>
          </div>
        </div>
      )}
    </div>
  )
}
