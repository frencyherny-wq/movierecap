'use client'

interface Step {
  id: string
  label: string
  status: 'pending' | 'active' | 'completed' | 'error'
}

interface ProgressStepsProps {
  steps: Step[]
}

export default function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center space-x-2 md:space-x-4 shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  step.status === 'completed'
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : step.status === 'active'
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 animate-pulse'
                    : step.status === 'error'
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-dark-700 text-dark-400'
                }`}
              >
                {step.status === 'completed' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.status === 'error' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{idx + 1}</span>
                )}
              </div>
              <span className={`text-xs mt-2 whitespace-nowrap ${
                step.status === 'active' ? 'text-primary-400 font-medium' :
                step.status === 'completed' ? 'text-green-400' :
                'text-dark-400'
              }`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-8 md:w-16 h-0.5 ${
                step.status === 'completed' ? 'bg-green-500' : 'bg-dark-700'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
