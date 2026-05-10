'use client'

interface StyleSelectorProps {
  selected: string
  onSelect: (style: string) => void
}

const styles = [
  { id: 'dramatic', name: 'Dramatic', icon: '🎭', desc: 'Suspenseful & cinematic' },
  { id: 'casual', name: 'Casual', icon: '💬', desc: 'Like telling a friend' },
  { id: 'funny', name: 'Funny', icon: '😂', desc: 'Witty & humorous' },
  { id: 'professional', name: 'Professional', icon: '📋', desc: 'Documentary style' },
]

export default function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
        </svg>
        <span>Narration Style</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`flex flex-col items-center p-4 rounded-xl text-center transition-all ${
              selected === style.id
                ? 'bg-purple-500/20 border border-purple-500/50 shadow-lg shadow-purple-500/10'
                : 'bg-dark-800 border border-dark-700 hover:border-dark-500'
            }`}
          >
            <span className="text-2xl mb-2">{style.icon}</span>
            <span className={`text-sm font-medium ${selected === style.id ? 'text-purple-300' : 'text-dark-200'}`}>
              {style.name}
            </span>
            <span className="text-xs text-dark-400 mt-1">{style.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
