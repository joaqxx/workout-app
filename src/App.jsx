"use client"

import { useState, useEffect } from "react"
import Hero from "./components/Hero"
import Generator from "./components/Generator"
import Workout from "./components/Workout"
import WorkoutHistory from "./components/WorkoutHistory"
import CustomWorkoutCreator from "./components/CustomWorkoutCreator"
import WorkoutAnalytics from "./components/WorkoutAnalytics"
import { generateWorkout } from "./utils/Functions"
import { Moon, Sun, Plus, BarChart3 } from "lucide-react"

function App() {
  const [workout, setWorkout] = useState(null)
  const [poison, setPoison] = useState("individual")
  const [muscles, setMuscles] = useState([])
  const [goal, setGoal] = useState("strength_power")
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode
  const [showCustomWorkoutCreator, setShowCustomWorkoutCreator] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  function updateWorkout() {
    if (muscles.length < 1) {
      return
    }
    const newWorkout = generateWorkout({ poison, muscles, goal })

    // Save workout details to history with exercise names
    const workoutData = {
      workoutType: poison,
      muscleGroup: muscles.join(", "),
      objective: goal,
      exercises: newWorkout.map((exercise) => exercise.name), // Populate with actual exercise names
      date: new Date().toISOString(),
    }

    const existingHistory = JSON.parse(localStorage.getItem("workoutHistory") || "[]")
    const updatedHistory = [workoutData, ...existingHistory].slice(0, 20) // Keep last 20 workouts
    localStorage.setItem("workoutHistory", JSON.stringify(updatedHistory))

    setWorkout(newWorkout)
    window.location.href = "#workout"
  }

  function handleCustomWorkout(customExercises) {
    setWorkout(customExercises)
    window.location.href = "#workout"
  }

  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-dark-bg-primary dark:text-dark-text-primary">
      {/* Top Navigation */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <button
          onClick={() => setShowAnalytics(true)}
          className="p-3 rounded-full bg-gray-200 dark:bg-black text-gray-800 dark:text-dark-text-primary shadow-lg hover:scale-110 transition-transform duration-200"
          aria-label="View Analytics"
        >
          <BarChart3 size={20} />
        </button>
        <button
          onClick={() => setShowCustomWorkoutCreator(true)}
          className="p-3 rounded-full bg-gray-200 dark:bg-black text-gray-800 dark:text-dark-text-primary shadow-lg hover:scale-110 transition-transform duration-200"
          aria-label="Create Custom Workout"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 rounded-full bg-gray-200 dark:bg-black text-gray-800 dark:text-dark-text-primary shadow-lg hover:scale-110 transition-transform duration-200"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <Hero />
      <Generator
        poison={poison}
        setPoison={setPoison}
        muscles={muscles}
        setMuscles={setMuscles}
        goal={goal}
        setGoal={setGoal}
        updateWorkout={updateWorkout}
      />
      {workout && <Workout workout={workout} />}
      <WorkoutHistory />

      {/* Modals */}
      <CustomWorkoutCreator
        isVisible={showCustomWorkoutCreator}
        onClose={() => setShowCustomWorkoutCreator(false)}
        onSaveWorkout={handleCustomWorkout}
      />
      <WorkoutAnalytics isVisible={showAnalytics} onClose={() => setShowAnalytics(false)} />
    </main>
  )
}

export default App
