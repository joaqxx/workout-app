"use client"

import { useState, useEffect } from "react"
import Button from "./Button"

export default function WorkoutHistory() {
  const [history, setHistory] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredWorkout, setHoveredWorkout] = useState(null)

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

  const formatDateShort = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="group bg-black dark:bg-white text-white dark:text-black p-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 border-2 border-black dark:border-white"
        >
          <div className="relative">
            <svg className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {/* Pulse Effect */}
            <div className="absolute inset-0 rounded-full bg-black dark:bg-white animate-ping opacity-20"></div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-black dark:bg-white text-white dark:text-black p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-transparent dark:from-gray-600"></div>
          </div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white dark:bg-black text-black dark:text-white rounded-full flex items-center justify-center border-2 border-white dark:border-black">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-4xl font-black tracking-tight">WORKOUT HISTORY</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-white dark:bg-black rounded-full"></div>
                  <p className="text-white dark:text-black text-sm font-bold tracking-widest uppercase">
                    {history.length} SESSIONS COMPLETED
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)} 
              className="w-12 h-12 bg-white dark:bg-black text-black dark:text-white rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-16 overflow-y-auto max-h-[calc(90vh-200px)]">
          {history.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-black dark:text-white mb-4 tracking-tight">NO HISTORY YET</h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium tracking-wide">
                Complete your first workout to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((workout, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredWorkout(index)}
                  onMouseLeave={() => setHoveredWorkout(null)}
                  className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]"
                >
                  {/* Workout Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-black text-lg">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-black dark:text-white capitalize tracking-tight">
                          {workout.workoutType?.replaceAll("_", " ")} - {workout.muscleGroup?.replaceAll("_", " ")}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-1 h-4 bg-black dark:bg-white rounded-full"></div>
                          <p className="text-gray-600 dark:text-gray-400 capitalize font-bold tracking-wide">
                            OBJECTIVE: {workout.objective?.replaceAll("_", " ")}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-bold tracking-widest uppercase">
                          {formatDateShort(workout.date)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                        {formatDate(workout.date).split(' at ')[1]}
                      </p>
                    </div>
                  </div>

                  {/* Exercises Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-6 bg-black dark:bg-white rounded-full"></div>
                      <h4 className="text-lg font-black text-black dark:text-white uppercase tracking-widest">
                        EXERCISES ({workout.exercises?.length || 0})
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {workout.exercises?.map((exercise, exerciseIndex) => (
                        <div
                          key={exerciseIndex}
                          className="bg-white dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group/exercise"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-black dark:bg-white rounded-full group-hover/exercise:scale-150 transition-transform duration-300"></div>
                            <span className="font-bold text-black dark:text-white capitalize tracking-wide text-sm">
                              {exercise.replaceAll("_", " ")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className={`
                    absolute inset-0 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none
                    ${hoveredWorkout === index ? 'bg-black/5 dark:bg-white/5' : ''}
                  `}></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              {/* Workout Summary */}
              <div className="flex items-center gap-3">
                <div className="w-1 h-3 sm:h-6 bg-black dark:bg-white rounded-full flex-shrink-0"></div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-black dark:text-white tracking-tight">
                    TOTAL WORKOUTS: {history.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                    Keep pushing your limits
                  </p>
                </div>
              </div>

              {/* Clear History Button */}
              <button
                onClick={clearHistory}
                className="group bg-black dark:bg-white text-white dark:text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold tracking-widest uppercase transition-all duration-300 hover:shadow-md hover:scale-105 text-xs sm:text-sm w-full sm:w-auto"
              >
                <span className="relative z-10">CLEAR HISTORY</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
