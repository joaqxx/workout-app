"use client"

import Button from "./Button"

export default function WorkoutCompletionModal({ isVisible, onClose }) {
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-dark-bg-secondary text-dark-text-primary rounded-xl max-w-md w-full p-8 shadow-2xl border border-dark-border-dark text-center transform scale-95 animate-fadeIn">
        <div className="text-6xl mb-6 animate-pulse">🎉</div>
        <h2 className="text-3xl font-bold text-dark-accent-main mb-4">Congratulations!</h2>
        <p className="text-dark-text-secondary text-lg mb-6">
          You've successfully completed your entire workout! Keep up the amazing work and stay consistent on your path
          to becoming ELITE.
        </p>
        <div className="flex flex-col gap-4">
          <Button text="Awesome!" func={onClose} variant="primary" />
          <Button
            text="Generate New Workout"
            func={() => {
              onClose()
              window.location.href = "#generate"
            }}
            variant="outline"
          />
        </div>
      </div>
    </div>
  )
}
