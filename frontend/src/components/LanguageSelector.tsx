'use client'

interface Language {
  code: string
  name: string
  flag: string
}

interface LanguageSelectorProps {
  languages: Language[]
  selected: string
  onSelect: (code: string) => void
}

export default function LanguageSelector({ languages, selected, onSelect }: LanguageSelectorProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span>Output Language</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
              selected === lang.code
                ? 'bg-primary-500/20 border border-primary-500/50 text-primary-300'
                : 'bg-dark-800 border border-dark-700 text-dark-300 hover:border-dark-500 hover:text-white'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="truncate">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
