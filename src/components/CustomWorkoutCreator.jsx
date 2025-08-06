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
    alert("Workout saved successfully!")
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
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-dark-border-dark">
        <div className="bg-blue-900 dark:bg-dark-accent-main text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Custom Workout Creator</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Create Workout */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-4">Create New Workout</h3>

              {/* Workout Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                  Workout Name
                </label>
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-dark-accent-main dark:bg-dark-bg-primary dark:text-dark-text-primary"
                  placeholder="My Custom Workout"
                />
              </div>

              {/* Exercise Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                  Search Exercises
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-dark-accent-main dark:bg-dark-bg-primary dark:text-dark-text-primary"
                  placeholder="Search by exercise name or muscle..."
                />
              </div>

              {/* Exercise List */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 dark:text-dark-text-secondary mb-2">Available Exercises</h4>
                <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-dark-border-dark rounded-lg">
                  {filteredExercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="p-3 border-b border-gray-200 dark:border-dark-border-dark last:border-b-0 hover:bg-gray-50 dark:hover:bg-dark-bg-primary"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-dark-text-primary">{exercise.name}</p>
                          <p className="text-sm text-gray-600 dark:text-dark-text-secondary capitalize">
                            {exercise.muscles.join(", ")} • {exercise.type}
                          </p>
                        </div>
                        <button
                          onClick={() => addExercise(exercise)}
                          className="bg-blue-900 dark:bg-dark-accent-main hover:bg-blue-800 dark:hover:bg-dark-accent-dark text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Exercises */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                  Selected Exercises ({selectedExercises.length})
                </h4>
                <div className="space-y-3">
                  {selectedExercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-dark-bg-primary p-4 rounded-lg border border-gray-200 dark:border-dark-border-dark"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-medium text-gray-900 dark:text-dark-text-primary">{exercise.name}</h5>
                        <button
                          onClick={() => removeExercise(index)}
                          className="text-red-600 hover:text-red-800 font-bold"
                        >
                          ×
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-dark-text-secondary mb-1">
                            Sets
                          </label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, "sets", Number.parseInt(e.target.value))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-dark-border-dark rounded dark:bg-dark-bg-secondary dark:text-dark-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-dark-text-secondary mb-1">
                            Reps
                          </label>
                          <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, "reps", e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-dark-border-dark rounded dark:bg-dark-bg-secondary dark:text-dark-text-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button text="Save Workout" func={saveWorkout} />
            </div>

            {/* Right Column - Saved Workouts */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-4">Saved Workouts</h3>
              <div className="space-y-4">
                {savedWorkouts.length === 0 ? (
                  <p className="text-gray-500 dark:text-dark-text-secondary text-center py-8">
                    No saved workouts yet. Create your first custom workout!
                  </p>
                ) : (
                  savedWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="bg-gray-50 dark:bg-dark-bg-primary p-4 rounded-lg border border-gray-200 dark:border-dark-border-dark"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-dark-text-primary">{workout.name}</h4>
                        <button
                          onClick={() => deleteWorkout(workout.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-3">
                        {workout.exercises.length} exercises • Created{" "}
                        {new Date(workout.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadWorkout(workout)}
                          className="bg-blue-900 dark:bg-dark-accent-main hover:bg-blue-800 dark:hover:bg-dark-accent-dark text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Use This Workout
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
