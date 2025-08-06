"use client"

import { useState, useEffect } from "react"

const exerciseExplanations = {
  deadlift:
    "The deadlift is a compound movement that strengthens the posterior chain, including your glutes, hamstrings, and lower back. It's one of the most effective exercises for building overall strength and power.",
  squat:
    "Squats target your quadriceps, glutes, and core while improving lower body strength and mobility. This fundamental movement pattern is essential for daily activities and athletic performance.",
  bench_press:
    "The bench press primarily targets the chest, shoulders, and triceps. It's a key upper body strength exercise that builds pushing power and muscle mass in the chest and arms.",
  pull_up:
    "Pull-ups are an excellent compound exercise for the back, biceps, and core. They build upper body pulling strength and help develop a strong, wide back.",
  overhead_press:
    "The overhead press targets the shoulders, triceps, and core while improving shoulder stability and strength. It's essential for building functional upper body power.",
  barbell_row:
    "Barbell rows strengthen the middle back, rear delts, and biceps while improving posture. This exercise balances pressing movements and builds a strong, thick back.",
  dip: "Dips primarily target the triceps, chest, and front delts. They're excellent for building pushing strength and adding mass to the arms and chest.",
  lunge:
    "Lunges work the quadriceps, glutes, and improve single-leg strength and stability. They're great for correcting imbalances and building functional lower body strength.",
  plank:
    "Planks are a fundamental core exercise that builds stability and endurance in the abs, back, and shoulders. They improve posture and reduce back pain risk.",
  burpee:
    "Burpees are a full-body exercise that combines strength and cardio. They improve cardiovascular fitness, build functional strength, and burn calories efficiently.",
}

export default function ExerciseCard(props) {
  const { exercise, i, onComplete, workoutId } = props
  const [setsCompleted, setSetsComplete] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showSetCompletionPopup, setShowSetCompletionPopup] = useState(false)
  const [showLoggingModal, setShowLoggingModal] = useState(false)
  const [currentSetData, setCurrentSetData] = useState({ weight: "", reps: "", rpe: "" })
  const [loggedSets, setLoggedSets] = useState([])
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restDuration, setRestDuration] = useState(90) // Default 90 seconds

  // Load logged sets from localStorage on component mount
  useEffect(() => {
    const savedSets = localStorage.getItem(`exercise_${workoutId}_${i}`)
    if (savedSets) {
      const parsedSets = JSON.parse(savedSets)
      setLoggedSets(parsedSets)
      setSetsComplete(parsedSets.length)
    }
  }, [workoutId, i])

  // Rest timer effect
  useEffect(() => {
    let interval = null
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(restTimer - 1)
      }, 1000)
    } else if (restTimer === 0 && isResting) {
      setIsResting(false)
      // Play a sound or show notification when rest is complete
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Rest Complete!", {
          body: "Time for your next set!",
          icon: "/favicon.ico",
        })
      }
    }
    return () => clearInterval(interval)
  }, [isResting, restTimer])

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  function handleSetIncrement() {
    if (setsCompleted < 5) {
      setShowLoggingModal(true)
    }
  }

  function handleLogSet() {
    const newSet = {
      set: loggedSets.length + 1,
      weight: currentSetData.weight || 0,
      reps: currentSetData.reps || 0,
      rpe: currentSetData.rpe || 0,
      timestamp: new Date().toISOString(),
    }

    const updatedSets = [...loggedSets, newSet]
    setLoggedSets(updatedSets)
    setSetsComplete(updatedSets.length)

    // Save to localStorage
    localStorage.setItem(`exercise_${workoutId}_${i}`, JSON.stringify(updatedSets))

    // Reset form
    setCurrentSetData({ weight: "", reps: "", rpe: "" })
    setShowLoggingModal(false)

    // Start rest timer
    setRestTimer(restDuration)
    setIsResting(true)

    if (updatedSets.length === 5) {
      setShowSetCompletionPopup(true)
      onComplete(i)
    }
  }

  function startRestTimer() {
    setRestTimer(restDuration)
    setIsResting(true)
  }

  function stopRestTimer() {
    setIsResting(false)
    setRestTimer(0)
  }

  // Effect to hide the set completion popup after a delay
  useEffect(() => {
    if (showSetCompletionPopup) {
      const timer = setTimeout(() => {
        setShowSetCompletionPopup(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showSetCompletionPopup])

  const getExplanation = (exerciseName) => {
    const key = exerciseName.toLowerCase().replaceAll(" ", "_")
    return (
      exerciseExplanations[key] ||
      "This exercise helps build strength and improve your overall fitness. Focus on proper form and controlled movements for best results."
    )
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-lg border border-gray-100 dark:border-dark-border-dark overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-dark-accent-main dark:to-dark-accent-dark text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold capitalize">{exercise.name.replaceAll("_", " ")}</h2>
              <p className="text-blue-100 dark:text-dark-text-secondary capitalize text-sm">{exercise.type}</p>
            </div>
          </div>
          {/* Rest Timer Display */}
          {isResting && (
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">Rest: {formatTime(restTimer)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Muscle Groups */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-dark-text-secondary uppercase tracking-wide mb-2">
            Target Muscles
          </h3>
          <div className="flex flex-wrap gap-2">
            {exercise.muscles.map((muscle, index) => (
              <span
                key={index}
                className="bg-blue-100 dark:bg-dark-border-light text-blue-900 dark:text-dark-accent-main px-3 py-1 rounded-full text-sm font-medium capitalize"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-dark-text-secondary uppercase tracking-wide mb-2">
            Instructions
          </h3>
          <div className="space-y-2">
            {exercise.description.split("___").map((instruction, index) => (
              <p key={index} className="text-gray-700 dark:text-dark-text-secondary text-sm leading-relaxed">
                {instruction.trim()}
              </p>
            ))}
          </div>
        </div>

        {/* Exercise Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["reps", "rest", "tempo"].map((info) => (
            <div
              key={info}
              className="bg-gray-50 dark:bg-dark-bg-primary p-4 rounded-lg border border-gray-200 dark:border-dark-border-dark"
            >
              <h3 className="text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wide mb-1">
                {info === "reps" ? exercise.unit : info}
              </h3>
              <p className="text-lg font-bold text-gray-900 dark:text-dark-text-primary">{exercise[info]}</p>
            </div>
          ))}

          {/* Sets Counter */}
          <button
            onClick={handleSetIncrement}
            disabled={setsCompleted === 5}
            className="relative bg-blue-50 dark:bg-dark-border-dark hover:bg-blue-100 dark:hover:bg-dark-border-light p-4 rounded-lg border-2 border-blue-200 dark:border-dark-border-light hover:border-blue-300 dark:hover:border-dark-accent-main transition-all duration-200 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <h3 className="text-xs font-semibold text-blue-600 dark:text-dark-accent-main uppercase tracking-wide mb-1">
              Sets Completed
            </h3>
            <p className="text-lg font-bold text-blue-900 dark:text-dark-accent-main group-hover:scale-110 transition-transform duration-200">
              {setsCompleted} / 5
            </p>
            {showSetCompletionPopup && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md animate-bounce">
                🎉 Done!
              </div>
            )}
          </button>
        </div>

        {/* Rest Timer Controls */}
        <div className="bg-gray-50 dark:bg-dark-bg-primary p-4 rounded-lg border border-gray-200 dark:border-dark-border-dark">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-dark-text-secondary uppercase tracking-wide">
              Rest Timer
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={restDuration}
                onChange={(e) => setRestDuration(Number.parseInt(e.target.value) || 90)}
                className="w-16 px-2 py-1 text-sm border rounded dark:bg-dark-bg-secondary dark:border-dark-border-dark dark:text-dark-text-primary"
                min="30"
                max="300"
              />
              <span className="text-xs text-gray-500 dark:text-dark-text-secondary">sec</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={startRestTimer}
              disabled={isResting}
              className="flex-1 bg-blue-900 dark:bg-dark-accent-main hover:bg-blue-800 dark:hover:bg-dark-accent-dark text-white px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              Start Rest
            </button>
            <button
              onClick={stopRestTimer}
              disabled={!isResting}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              Stop Rest
            </button>
          </div>
          {isResting && (
            <div className="mt-2 text-center">
              <p className="text-2xl font-bold text-blue-900 dark:text-dark-accent-main">{formatTime(restTimer)}</p>
            </div>
          )}
        </div>

        {/* Logged Sets Display */}
        {loggedSets.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-dark-text-secondary uppercase tracking-wide mb-2">
              Logged Sets
            </h3>
            <div className="space-y-2">
              {loggedSets.map((set, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-dark-bg-primary p-3 rounded-lg border border-gray-200 dark:border-dark-border-dark"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-dark-text-primary">Set {set.set}</span>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-dark-text-secondary">
                      <span>{set.weight}lbs</span>
                      <span>{set.reps} reps</span>
                      <span>RPE {set.rpe}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explain This Button */}
        <div className="border-t pt-4 border-gray-200 dark:border-dark-border-dark">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2 text-blue-900 dark:text-dark-accent-main hover:text-blue-700 dark:hover:text-dark-accent-dark font-medium transition-colors duration-200"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${showExplanation ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Explain This Exercise
          </button>

          {/* Explanation */}
          <div
            className={`overflow-hidden transition-all duration-300 ${showExplanation ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
          >
            <div className="bg-blue-50 dark:bg-dark-bg-primary p-4 rounded-lg border-l-4 border-blue-900 dark:border-dark-accent-main">
              <p className="text-gray-700 dark:text-dark-text-secondary text-sm leading-relaxed">
                {getExplanation(exercise.name)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logging Modal */}
      {showLoggingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-dark-border-dark">
            <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-4">
              Log Set {loggedSets.length + 1}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={currentSetData.weight}
                  onChange={(e) => setCurrentSetData({ ...currentSetData, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-dark-accent-main dark:bg-dark-bg-primary dark:text-dark-text-primary"
                  placeholder="135"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                  Reps
                </label>
                <input
                  type="number"
                  value={currentSetData.reps}
                  onChange={(e) => setCurrentSetData({ ...currentSetData, reps: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-dark-accent-main dark:bg-dark-bg-primary dark:text-dark-text-primary"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                  RPE (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={currentSetData.rpe}
                  onChange={(e) => setCurrentSetData({ ...currentSetData, rpe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-dark-accent-main dark:bg-dark-bg-primary dark:text-dark-text-primary"
                  placeholder="8"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleLogSet}
                className="flex-1 bg-blue-900 dark:bg-dark-accent-main hover:bg-blue-800 dark:hover:bg-dark-accent-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Log Set
              </button>
              <button
                onClick={() => setShowLoggingModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
