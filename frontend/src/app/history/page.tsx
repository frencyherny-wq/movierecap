'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getHistory, deleteHistory } from '@/lib/api'

interface RecapItem {
  id: string
  title: string
  source_url?: string
  transcript: string
  recap: string
  language: string
  audio_url?: string
  created_at: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<RecapItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const result = await getHistory()
      setHistory(result.data || [])
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this recap?')) return
    try {
      await deleteHistory(id)
      setHistory(prev => prev.filter(item => item.id !== id))
      toast.success('Recap deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const langFlags: Record<string, string> = {
    my: '\u{1F1F2}\u{1F1F2}',
    en: '\u{1F1FA}\u{1F1F8}',
    th: '\u{1F1F9}\u{1F1ED}',
    zh: '\u{1F1E8}\u{1F1F3}',
    ja: '\u{1F1EF}\u{1F1F5}',
    ko: '\u{1F1F0}\u{1F1F7}',
    hi: '\u{1F1EE}\u{1F1F3}',
    vi: '\u{1F1FB}\u{1F1F3}',
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
            Recap History
          </span>
        </h1>
        <p className="text-dark-400">Your previously generated movie recaps</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark-300 mb-2">No recaps yet</h3>
          <p className="text-dark-400">Generate your first recap from the home page!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="glass-card p-5 hover:border-dark-600 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{langFlags[item.language] || '\u{1F30D}'}</span>
                    <h3 className="font-semibold text-dark-100 truncate">{item.title}</h3>
                  </div>
                  <p className="text-sm text-dark-400">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="p-2 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                  >
                    <svg className={`w-4 h-4 text-dark-300 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-dark-700 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {expandedId === item.id && (
                <div className="mt-4 pt-4 border-t border-dark-700 space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-dark-300 mb-1">Recap:</h4>
                    <p className="text-sm text-dark-400 line-clamp-6 whitespace-pre-line">{item.recap}</p>
                  </div>
                  {item.audio_url && (
                    <audio controls className="w-full mt-2">
                      <source src={item.audio_url} type="audio/mpeg" />
                    </audio>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
