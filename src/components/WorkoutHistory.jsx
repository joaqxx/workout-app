"use client"

import { useState, useEffect } from "react"
import Button from "./Button"

export default function WorkoutHistory() {
  const [history, setHistory] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const savedHistory = localStorage.getItem("workoutHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const clearHistory = () => {
    localStorage.removeItem("workoutHistory")
    setHistory([])
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-900 hover:bg-blue-800 dark:bg-dark-accent-main dark:hover:bg-dark-accent-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-dark-border-dark">
        <div className="bg-blue-900 dark:bg-dark-accent-main text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Workout History</h2>
          <button onClick={() => setIsVisible(false)} className="text-white hover:text-gray-200 text-2xl font-bold">
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏋️</div>
              <p className="text-gray-500 dark:text-dark-text-secondary text-lg">No workout history yet</p>
              <p className="text-gray-400 dark:text-dark-text-secondary">Complete your first workout to see it here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((workout, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-dark-bg-primary rounded-lg p-6 border border-gray-200 dark:border-dark-border-dark hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-900 dark:text-dark-accent-main capitalize">
                        {workout.workoutType?.replaceAll("_", " ")} - {workout.muscleGroup?.replaceAll("_", " ")}
                      </h3>
                      <p className="text-gray-600 dark:text-dark-text-secondary capitalize">
                        Objective: {workout.objective?.replaceAll("_", " ")}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-dark-text-secondary bg-white dark:bg-dark-bg-secondary px-3 py-1 rounded-full">
                      {formatDate(workout.date)}
                    </span>
                  </div>

                  <div className="border-t pt-4 border-gray-200 dark:border-dark-border-dark">
                    <h4 className="font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                      Exercises ({workout.exercises?.length || 0}):
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {workout.exercises?.map((exercise, exerciseIndex) => (
                        <div
                          key={exerciseIndex}
                          className="bg-white dark:bg-dark-bg-secondary p-3 rounded border border-gray-200 dark:border-dark-border-dark text-sm"
                        >
                          <span className="font-medium text-blue-900 dark:text-dark-accent-main capitalize">
                            {exercise.replaceAll("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="bg-gray-50 dark:bg-dark-bg-primary p-6 border-t border-gray-200 dark:border-dark-border-dark flex justify-between items-center">
            <p className="text-gray-600 dark:text-dark-text-secondary">Total workouts: {history.length}</p>
            <Button text="Clear History" func={clearHistory} variant="outline" />
          </div>
        )}
      </div>
    </div>
  )
}
