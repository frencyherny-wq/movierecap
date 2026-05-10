import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Movie Recap - Transform Videos into Engaging Recaps',
  description: 'Upload videos or paste links to generate AI-powered movie recaps in multiple languages with voice narration.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-dark-950 relative overflow-hidden">
          {/* Background effects */}
          <div className="fixed inset-0 z-0">
            <div className="absolute top-0 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-60 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
            },
          }}
        />
      </body>
    </html>
  )
}
