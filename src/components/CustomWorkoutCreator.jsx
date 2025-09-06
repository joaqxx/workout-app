"use client"

import { useState, useEffect } from "react"
import Button from "./Button"

const EXERCISE_DATABASE = [
  { name: "Bench Press", muscles: ["chest", "triceps", "shoulders"], type: "compound" },
  { name: "Squat", muscles: ["quadriceps", "glutes", "hamstrings"], type: "compound" },
  { name: "Deadlift", muscles: ["hamstrings", "glutes", "lower_back"], type: "compound" },
  { name: "Pull Up", muscles: ["lats", "biceps", "rear_delts"], type: "compound" },
  { name: "Overhead Press", muscles: ["shoulders", "triceps", "core"], type: "compound" },
  { name: "Barbell Row", muscles: ["lats", "rhomboids", "biceps"], type: "compound" },
  { name: "Dips", muscles: ["triceps", "chest", "shoulders"], type: "compound" },
  { name: "Lunges", muscles: ["quadriceps", "glutes", "hamstrings"], type: "compound" },
  { name: "Push Ups", muscles: ["chest", "triceps", "shoulders"], type: "bodyweight" },
  { name: "Plank", muscles: ["core", "shoulders"], type: "isometric" },
  { name: "Bicep Curls", muscles: ["biceps"], type: "isolation" },
  { name: "Tricep Extensions", muscles: ["triceps"], type: "isolation" },
  { name: "Lateral Raises", muscles: ["shoulders"], type: "isolation" },
  { name: "Leg Curls", muscles: ["hamstrings"], type: "isolation" },
  { name: "Calf Raises", muscles: ["calves"], type: "isolation" },
]

export default function CustomWorkoutCreator({ isVisible, onClose, onSaveWorkout }) {
  const [workoutName, setWorkoutName] = useState("")
  const [selectedExercises, setSelectedExercises] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [savedWorkouts, setSavedWorkouts] = useState([])
  const [hoveredExercise, setHoveredExercise] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("customWorkouts")
    if (saved) {
      setSavedWorkouts(JSON.parse(saved))
    }
  }, [])

  const filteredExercises = EXERCISE_DATABASE.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscles.some((muscle) => muscle.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const addExercise = (exercise) => {
    const exerciseWithDefaults = {
      ...exercise,
      sets: 3,
      reps: "8-12",
      rest: "60-90s",
      tempo: "2-1-2",
      description: `Perform ${exercise.name} with proper form focusing on the ${exercise.muscles.join(", ")}.`,
    }
    setSelectedExercises([...selectedExercises, exerciseWithDefaults])
  }

  const removeExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index, field, value) => {
    const updated = selectedExercises.map((exercise, i) => (i === index ? { ...exercise, [field]: value } : exercise))
    setSelectedExercises(updated)
  }

  const saveWorkout = () => {
    if (!workoutName.trim() || selectedExercises.length === 0) {
      alert("Please enter a workout name and add at least one exercise.")
      return
    }

    const newWorkout = {
      id: Date.now(),
      name: workoutName,
      exercises: selectedExercises,
      createdAt: new Date().toISOString(),
    }

    const updatedWorkouts = [...savedWorkouts, newWorkout]
    setSavedWorkouts(updatedWorkouts)
    localStorage.setItem("customWorkouts", JSON.stringify(updatedWorkouts))

    // Reset form
    setWorkoutName("")
    setSelectedExercises([])
    
    // Show success message
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const loadWorkout = (workout) => {
    onSaveWorkout(workout.exercises)
    onClose()
  }

  const deleteWorkout = (workoutId) => {
    const updatedWorkouts = savedWorkouts.filter((w) => w.id !== workoutId)
    setSavedWorkouts(updatedWorkouts)
    localStorage.setItem("customWorkouts", JSON.stringify(updatedWorkouts))
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-black rounded-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-500">
        {/* Header */}
        <div className="bg-black dark:bg-gray-500 text-white dark:text-black p-4 relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-4 ml-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight dark:text-white">CUSTOM WORKOUT CREATOR</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1 h-1 bg-white dark:bg-black rounded-full"></div>
                  <p className="text-white dark:text-white text-xs font-bold tracking-widest uppercase">
                    BUILD YOUR PERFECT ROUTINE
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="w-8 h-8 bg-white dark:bg-black text-black dark:text-white rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-500 transition-all duration-300 transform hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-120px)]">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column - Create Workout */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-black dark:bg-gray-500 rounded-full"></div>
                <h3 className="text-lg font-black text-black dark:text-white tracking-tight">CREATE NEW WORKOUT</h3>
              </div>

              {/* Workout Name */}
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">
                  WORKOUT NAME
                </label>
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-gray-500 dark:bg-black dark:text-white font-bold text-sm transition-all duration-300"
                  placeholder="MY CUSTOM WORKOUT"
                />
              </div>

              {/* Exercise Search */}
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">
                  SEARCH EXERCISES
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-gray-500 dark:bg-black dark:text-white font-bold text-sm transition-all duration-300"
                  placeholder="SEARCH BY EXERCISE NAME OR MUSCLE..."
                />
              </div>

              {/* Exercise List */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-black dark:bg-gray-500 rounded-full"></div>
                  <h4 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">
                    AVAILABLE EXERCISES ({filteredExercises.length})
                  </h4>
                </div>
                <div className="max-h-48 overflow-y-auto border-2 border-gray-200 dark:border-gray-500 rounded-xl">
                  {filteredExercises.map((exercise, index) => (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredExercise(index)}
                      onMouseLeave={() => setHoveredExercise(null)}
                      className="group p-3 border-b border-gray-200 dark:border-gray-500 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-500 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h5 className="font-black text-black dark:text-white text-sm capitalize tracking-wide mb-1">
                            {exercise.name}
                          </h5>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-black dark:bg-gray-500 rounded-full"></div>
                              <p className="text-xs text-gray-600 dark:text-gray-500 capitalize font-bold tracking-wide">
                                {exercise.muscles.join(", ")}
                              </p>
                            </div>
                            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 capitalize font-bold tracking-wide">
                              {exercise.type}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => addExercise(exercise)}
                          className="group/btn bg-black dark:bg-gray-500 text-white dark:text-white px-4 py-2 rounded-xl font-bold tracking-widest uppercase text-xs transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                        >
                          <span className="relative z-10">ADD</span>
                          <div className="absolute inset-0 bg-white dark:bg-black transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Exercises */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-black dark:bg-gray-500 rounded-full"></div>
                  <h4 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">
                    SELECTED EXERCISES ({selectedExercises.length})
                  </h4>
                </div>
                <div className="space-y-3">
                  {selectedExercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-500 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-500 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-black text-xs">
                            {index + 1}
                          </div>
                          <h5 className="font-black text-black dark:text-white text-sm capitalize tracking-wide">
                            {exercise.name}
                          </h5>
                        </div>
                        <button
                          onClick={() => removeExercise(index)}
                          className="w-6 h-6 bg-gray-600 dark:bg-gray-500 text-white dark:text-black rounded-full flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-500 transition-all duration-300 transform hover:scale-110"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1">
                            SETS
                          </label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, "sets", Number.parseInt(e.target.value))}
                            className="w-full px-3 py-2 text-xs border-2 border-gray-300 dark:border-gray-500 rounded-lg dark:bg-black dark:text-white font-bold text-center transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1">
                            REPS
                          </label>
                          <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, "reps", e.target.value)}
                            className="w-full px-3 py-2 text-xs border-2 border-gray-300 dark:border-gray-500 rounded-lg dark:bg-black dark:text-white font-bold text-center transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  onClick={saveWorkout}
                  className="group w-full bg-black dark:bg-gray-500 text-white dark:text-white px-6 py-3 rounded-xl font-black tracking-widest uppercase text-sm transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                >
                  <span className="relative z-10">SAVE WORKOUT</span>
                  <div className="absolute inset-0 bg-white dark:bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                </button>
                
                {/* Success Message */}
                {showSuccessMessage && (
                  <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-500 border-2 border-gray-300 dark:border-gray-500 rounded-xl text-center">
                    <p className="text-black dark:text-white font-bold tracking-widest uppercase text-xs">
                      ✓ WORKOUT SAVED SUCCESSFULLY
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Saved Workouts */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-black dark:bg-gray-500 rounded-full"></div>
                <h3 className="text-lg font-black text-black dark:text-white tracking-tight">SAVED WORKOUTS</h3>
              </div>
              
              <div className="space-y-4">
                {savedWorkouts.length === 0 ? (
                  <div className="text-center py-12">
                    <h4 className="text-lg font-black text-black dark:text-white mb-2 tracking-tight">NO SAVED WORKOUTS</h4>
                    <p className="text-gray-500 dark:text-gray-500 font-medium tracking-wide text-sm">
                      Create your first custom workout to see it here
                    </p>
                  </div>
                ) : (
                  savedWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="bg-gray-50 dark:bg-gray-500 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-500 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-black text-sm">
                            {savedWorkouts.indexOf(workout) + 1}
                          </div>
                          <div>
                            <h4 className="font-black text-black dark:text-white text-base capitalize tracking-tight">
                              {workout.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-1 h-1 bg-black dark:bg-gray-500 rounded-full"></div>
                              <p className="text-xs text-gray-600 dark:text-gray-500 font-bold tracking-wide">
                                {workout.exercises.length} EXERCISES
                              </p>
                              <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                              <p className="text-xs text-gray-500 dark:text-gray-500 font-bold tracking-wide">
                                {new Date(workout.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteWorkout(workout.id)}
                          className="w-6 h-6 bg-gray-600 dark:bg-gray-500 text-white dark:text-black rounded-full flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-500 transition-all duration-300 transform hover:scale-110"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadWorkout(workout)}
                          className="group flex-1 bg-black dark:bg-gray-500 text-white dark:text-black px-4 py-2 rounded-lg font-bold tracking-widest uppercase text-xs transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                        >
                          <span className="relative z-10">USE THIS WORKOUT</span>
                          <div className="absolute inset-0 bg-white dark:bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></div>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
