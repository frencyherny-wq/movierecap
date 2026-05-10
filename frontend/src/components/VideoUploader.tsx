'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface VideoUploaderProps {
  onFileUpload: (file: File) => void
  onUrlSubmit: (url: string) => void
  isLoading: boolean
}

export default function VideoUploader({ onFileUpload, onUrlSubmit, isLoading }: VideoUploaderProps) {
  const [url, setUrl] = useState('')
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('url')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0])
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mkv', '.mov', '.webm'],
    },
    maxFiles: 1,
    disabled: isLoading,
  })

  const handleUrlSubmit = () => {
    if (url.trim()) {
      onUrlSubmit(url.trim())
    }
  }

  return (
    <div className="glass-card p-6 md:p-8">
      {/* Tabs */}
      <div className="flex space-x-1 bg-dark-800 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'url'
              ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
              : 'text-dark-400 hover:text-white'
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Paste URL</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
              : 'text-dark-400 hover:text-white'
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload File</span>
          </span>
        </button>
      </div>

      {/* URL Input */}
      {activeTab === 'url' && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube or TikTok link here..."
              className="input-field pr-12"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">YT</span>
              <span className="text-xs px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded">TT</span>
            </div>
          </div>
          <button
            onClick={handleUrlSubmit}
            disabled={!url.trim() || isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </span>
            ) : (
              'Start Recap'
            )}
          </button>
        </div>
      )}

      {/* File Upload */}
      {activeTab === 'upload' && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-primary-400 bg-primary-500/10'
              : 'border-dark-600 hover:border-primary-500/50 hover:bg-dark-800/50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            {isDragActive ? (
              <p className="text-primary-400 font-medium">Drop the video file here...</p>
            ) : (
              <>
                <p className="text-dark-200 font-medium">
                  Drag & drop a video file, or click to browse
                </p>
                <p className="text-dark-400 text-sm">
                  Supports MP4, AVI, MKV, MOV, WebM
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
