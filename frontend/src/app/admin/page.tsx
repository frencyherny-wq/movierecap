'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getAdminStats, getHistory, deleteHistory } from '@/lib/api'

interface RecapItem {
  id: string
  title: string
  language: string
  created_at: string
}

export default function AdminPage() {
  const [stats, setStats] = useState({ total_recaps: 0 })
  const [recentRecaps, setRecentRecaps] = useState<RecapItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsResult, historyResult] = await Promise.all([
        getAdminStats(),
        getHistory(10),
      ])
      setStats(statsResult)
      setRecentRecaps(historyResult.data || [])
    } catch {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this recap?')) return
    try {
      await deleteHistory(id)
      setRecentRecaps(prev => prev.filter(item => item.id !== id))
      setStats(prev => ({ ...prev, total_recaps: Math.max(0, prev.total_recaps - 1) }))
      toast.success('Deleted successfully')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </h1>
        <p className="text-dark-400">Monitor and manage your AI Movie Recap system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total_recaps}</p>
              <p className="text-sm text-dark-400">Total Recaps</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">Online</p>
              <p className="text-sm text-dark-400">API Status</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-dark-400">Languages</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">11</p>
              <p className="text-sm text-dark-400">Voices</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-dark-700">
              <span className="text-dark-400">Backend</span>
              <span className="text-dark-200">FastAPI + Python</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dark-700">
              <span className="text-dark-400">AI Model</span>
              <span className="text-dark-200">Gemini 1.5 Pro</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dark-700">
              <span className="text-dark-400">TTS Engine</span>
              <span className="text-dark-200">gTTS (Google)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dark-700">
              <span className="text-dark-400">Video Processing</span>
              <span className="text-dark-200">FFmpeg + yt-dlp</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-dark-400">Database</span>
              <span className="text-dark-200">Supabase (PostgreSQL)</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {recentRecaps.length === 0 ? (
            <p className="text-dark-400 text-sm">No recent activity</p>
          ) : (
            <div className="space-y-2">
              {recentRecaps.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-dark-800/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-200 truncate">{item.title}</p>
                    <p className="text-xs text-dark-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-2 p-1.5 rounded hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Supabase Setup Instructions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          <span>Database Setup (Supabase)</span>
        </h3>
        <div className="bg-dark-800 rounded-lg p-4 font-mono text-sm text-dark-300 overflow-x-auto">
          <pre>{`-- Run this SQL in your Supabase SQL Editor:

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

-- Enable Row Level Security
ALTER TABLE recaps ENABLE ROW LEVEL SECURITY;

-- Allow all operations (customize for production)
CREATE POLICY "Allow all" ON recaps FOR ALL USING (true);`}</pre>
        </div>
      </div>
    </div>
  )
}
