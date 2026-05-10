'use client'

import { useState } from 'react'

interface SubtitlePreviewProps {
  text: string
  title?: string
}

export default function SubtitlePreview({ text, title = "Recap Preview" }: SubtitlePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const paragraphs = text.split('\n').filter(p => p.trim())
  const displayParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 5)

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{title}</span>
        </h3>
        <span className="text-xs text-dark-400 bg-dark-800 px-3 py-1 rounded-full">
          {paragraphs.length} segments
        </span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {displayParagraphs.map((para, idx) => (
          <div key={idx} className="flex space-x-3">
            <span className="text-xs text-dark-500 font-mono w-8 shrink-0 pt-1">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <p className="text-dark-200 text-sm leading-relaxed bg-dark-800/50 px-4 py-2.5 rounded-lg border-l-2 border-primary-500/30">
              {para}
            </p>
          </div>
        ))}
      </div>

      {paragraphs.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          {isExpanded ? 'Show less' : `Show all ${paragraphs.length} segments`}
        </button>
      )}
    </div>
  )
}
