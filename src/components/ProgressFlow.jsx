export default function ProgressFlow({ currentStep }) {
  const steps = [
    { id: 1, title: "Workout Type", icon: "🏋️" },
    { id: 2, title: "Muscle Group", icon: "💪" },
    { id: 3, title: "Objective", icon: "🎯" },
    { id: 4, title: "Generated", icon: "✨" },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-dark-border-dark -translate-y-1/2 z-0">
          <div
            className="h-full bg-blue-900 dark:bg-dark-accent-main transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            {/* Step Circle */}
            <div
              className={`
                            w-16 h-16 rounded-full flex items-center justify-center text-2xl
                            transition-all duration-300 transform
                            ${
                              currentStep >= step.id
                                ? "bg-blue-900 dark:bg-dark-accent-main text-white scale-110 shadow-lg"
                                : "bg-white dark:bg-dark-bg-secondary text-gray-400 dark:text-dark-text-secondary border-2 border-gray-200 dark:border-dark-border-dark"
                            }
                            ${currentStep === step.id
                              ? "ring-4 ring-blue-200 dark:ring-dark-accent-main/10 animate-pulse [animation-duration:3s]"
                              : ""}

                        `}
            >
              {currentStep > step.id ? <i class="fa-regular fa-circle-check"></i> : step.icon}
            </div>

            {/* Step Title */}
            <div className="mt-3 text-center">
              <p
                className={`
                                text-sm font-medium transition-colors duration-300
                                ${currentStep >= step.id ? "text-blue-900 dark:text-white" : "text-gray-400 dark:text-dark-text-secondary"}
                            `}
              >
                {step.title}
              </p>
              <div
                className={`
                                h-0.5 w-8 mx-auto mt-1 transition-all duration-300
                                ${currentStep >= step.id ? "bg-blue-900 dark:bg-white" : "bg-transparent"}
                            `}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
