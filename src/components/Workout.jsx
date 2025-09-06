"use client"
import { useState, useEffect, useCallback } from "react"
import SectionWrapper from "./SectionWrapper"
import ExerciseCard from "./ExerciseCard"
import WorkoutCompletionModal from "./WorkoutCompletionModal"

export default function Workout(props) {
  const { workout } = props
  const [exerciseCompletionStatus, setExerciseCompletionStatus] = useState({})
  const [showWorkoutCompletionModal, setShowWorkoutCompletionModal] = useState(false)
  const [workoutId] = useState(() => Date.now()) // Generate unique workout ID

  // Initialize completion status when workout changes
  useEffect(() => {
    if (workout) {
      const initialStatus = workout.reduce((acc, _, index) => {
        acc[index] = false
        return acc
      }, {})
      setExerciseCompletionStatus(initialStatus)
      setShowWorkoutCompletionModal(false) // Reset modal visibility
    }
  }, [workout])

  // Callback for when an individual exercise is completed
  const handleExerciseComplete = useCallback((index) => {
    setExerciseCompletionStatus((prev) => ({
      ...prev,
      [index]: true,
    }))
  }, [])

  // Check if all exercises are completed
  useEffect(() => {
    if (workout && workout.length > 0) {
      const allCompleted = workout.every((_, index) => exerciseCompletionStatus[index])
      // Ensure all exercises are in the status object and all are true
      if (allCompleted && Object.keys(exerciseCompletionStatus).length === workout.length) {
        setShowWorkoutCompletionModal(true)
      }
    }
  }, [exerciseCompletionStatus, workout])

  return (
    <SectionWrapper id={"workout"} header={"your personalized workout"} title={["Your", "Workout", "Starts Now"]}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-black dark:bg-black text-white dark:text-white px-4 py-2 rounded-full font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {workout?.length || 0} Exercises Generated
          </div>
          <p className="text-black dark:text-white mt-4 max-w-2xl mx-auto">
            Your personalized workout is ready! Follow the instructions carefully and track your progress.
          </p>
        </div>

        <div className="grid gap-8">
          {workout?.map((exercise, i) => (
            <ExerciseCard i={i} exercise={exercise} key={i} onComplete={handleExerciseComplete} workoutId={workoutId} />
          ))}
        </div>

        {/* Completion Message */}
        <div className="mt-16 text-center bg-white dark:bg-black rounded-xl p-8 shadow-lg border border-gray-200 dark:border-dark-border-dark">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Ready to Dominate?</h3>
          <p className="text-gray-600 dark:text-white mb-6">
            Remember to warm up properly, maintain good form, and listen to your body throughout the workout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "#generate")}
              className="bg-black text-white hover:bg-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-500 dark:hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Generate New Workout
            </button>
            <button
              onClick={() => (window.location.href = "#")}
              className="bg-black text-white hover:bg-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-500 dark:hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
      <WorkoutCompletionModal
        isVisible={showWorkoutCompletionModal}
        onClose={() => setShowWorkoutCompletionModal(false)}
      />
    </SectionWrapper>
  )
}
