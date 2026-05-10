'use client'

interface Voice {
  id: string
  name: string
  language: string
}

interface VoiceSelectorProps {
  voices: Voice[]
  selected: string
  onSelect: (id: string) => void
}

export default function VoiceSelector({ voices, selected, onSelect }: VoiceSelectorProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <span>Narrator Voice</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {voices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onSelect(voice.id)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
              selected === voice.id
                ? 'bg-pink-500/20 border border-pink-500/50 text-pink-300'
                : 'bg-dark-800 border border-dark-700 text-dark-300 hover:border-dark-500 hover:text-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              selected === voice.id ? 'bg-pink-500/30' : 'bg-dark-700'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{voice.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
