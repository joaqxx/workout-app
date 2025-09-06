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
  const [restDuration, setRestDuration] = useState(90)
  const [isExpanded, setIsExpanded] = useState(false)

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

    localStorage.setItem(`exercise_${workoutId}_${i}`, JSON.stringify(updatedSets))

    setCurrentSetData({ weight: "", reps: "", rpe: "" })
    setShowLoggingModal(false)

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
    <div className="group bg-white dark:bg-gray-600 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
      {/* Header */}
      <div className="bg-black dark:bg-white text-white dark:text-black p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-transparent dark:from-gray-600"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Exercise Number */}
            <div className="w-16 h-16 bg-white dark:bg-black text-black dark:text-white rounded-full flex items-center justify-center border-2 border-white dark:border-black">
              <span className="text-2xl font-black">{String(i + 1).padStart(2, "0")}</span>
            </div>
            
            <div>
              <h2 className="text-3xl font-black capitalize tracking-tight">
                {exercise.name.replaceAll("_", " ")}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-white dark:bg-black rounded-full"></div>
                <p className="text-white dark:text-black capitalize text-sm font-medium tracking-wide">
                  {exercise.type}
                </p>
              </div>
            </div>
          </div>

          {/* Rest Timer Display */}
          {isResting && (
            <div className="bg-white dark:bg-black text-black dark:text-white px-6 py-3 rounded-full border border-white dark:border-black">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse"></div>
                <p className="text-lg font-bold tracking-widest">REST: {formatTime(restTimer)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Muscle Groups */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-black dark:bg-white rounded-full"></div>
            <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">
              TARGET MUSCLES
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {exercise.muscles.map((muscle, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-black text-black dark:text-white px-4 py-2 rounded-full text-sm font-bold capitalize tracking-wide border border-gray-200 dark:border-gray-700"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Exercise Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["reps", "rest", "tempo"].map((info) => (
            <div
              key={info}
              className="bg-gray-50 dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                {info === "reps" ? exercise.unit : info}
              </h3>
              <p className="text-2xl font-black text-black dark:text-white">{exercise[info]}</p>
            </div>
          ))}

          {/* Sets Counter */}
          <button
            onClick={handleSetIncrement}
            disabled={setsCompleted === 5}
            className="relative bg-black dark:bg-white text-white dark:text-black p-6 rounded-2xl border-2 border-black dark:border-white hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
          >
            <h3 className="text-xs font-black uppercase tracking-widest mb-2">
              SETS COMPLETED
            </h3>
            <p className="text-2xl font-black group-hover:scale-110 transition-transform duration-300">
              {setsCompleted} / 5
            </p>
            {showSetCompletionPopup && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-xs px-4 py-2 rounded-full shadow-2xl animate-bounce font-bold tracking-widest">
                COMPLETE
              </div>
            )}
          </button>
        </div>

        {/* Rest Timer Controls */}
        <div className="bg-gray-50 dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-black dark:bg-white rounded-full"></div>
              <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">
                REST TIMER
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={restDuration}
                onChange={(e) => setRestDuration(Number.parseInt(e.target.value) || 90)}
                className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-black text-black dark:text-white font-bold text-center"
                min="30"
                max="300"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase">SEC</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={startRestTimer}
              disabled={isResting}
              className="flex-1 bg-black dark:bg-white text-white dark:text-black px-4 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 hover:shadow-lg"
            >
              START REST
            </button>
            <button
              onClick={stopRestTimer}
              disabled={!isResting}
              className="flex-1 bg-gray-600 dark:bg-gray-400 text-white dark:text-black px-4 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 hover:shadow-lg"
            >
              STOP REST
            </button>
          </div>
          
          {isResting && (
            <div className="mt-6 text-center">
              <p className="text-4xl font-black text-black dark:text-white tracking-widest">{formatTime(restTimer)}</p>
            </div>
          )}
        </div>

        {/* Expandable Instructions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 font-bold transition-colors duration-300 group"
          >
            <div className="w-1 h-6 bg-black dark:bg-white rounded-full group-hover:bg-gray-600 dark:group-hover:bg-gray-400 transition-colors duration-300"></div>
            <span className="text-sm uppercase tracking-widest">INSTRUCTIONS</span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              isExpanded ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-3">
              {exercise.description.split("___").map((instruction, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium">
                    {instruction.trim()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logged Sets Display */}
        {loggedSets.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-black dark:bg-white rounded-full"></div>
              <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">
                LOGGED SETS
              </h3>
            </div>
            <div className="space-y-3">
              {loggedSets.map((set, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black text-black dark:text-white tracking-wide">SET {set.set}</span>
                    <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 font-bold">
                      <span>{set.weight}LBS</span>
                      <span>{set.reps} REPS</span>
                      <span>RPE {set.rpe}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Explanation */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-3 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 font-bold transition-colors duration-300 group"
          >
            <div className="w-1 h-6 bg-black dark:bg-white rounded-full group-hover:bg-gray-600 dark:group-hover:bg-gray-400 transition-colors duration-300"></div>
            <span className="text-sm uppercase tracking-widest">EXPLANATION</span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${showExplanation ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              showExplanation ? "max-h-40 opacity-100 mt-6" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-gray-50 dark:bg-black p-6 rounded-xl border-l-4 border-black dark:border-white">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium">
                {getExplanation(exercise.name)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logging Modal */}
      {showLoggingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-black rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-black dark:bg-white rounded-full"></div>
              <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">
                LOG SET {loggedSets.length + 1}
              </h3>
            </div>
            
            <div className="space-y-6">
              {[
                { key: "weight", label: "WEIGHT (LBS)", placeholder: "135" },
                { key: "reps", label: "REPS", placeholder: "10" },
                { key: "rpe", label: "RPE (1-10)", placeholder: "8" }
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-black text-black dark:text-white uppercase tracking-widest mb-2">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    min={field.key === "rpe" ? "1" : undefined}
                    max={field.key === "rpe" ? "10" : undefined}
                    value={currentSetData[field.key]}
                    onChange={(e) => setCurrentSetData({ ...currentSetData, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-600 dark:text-white font-bold text-center transition-all duration-300"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleLogSet}
                className="flex-1 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-lg"
              >
                LOG SET
              </button>
              <button
                onClick={() => setShowLoggingModal(false)}
                className="flex-1 bg-gray-600 dark:bg-gray-400 text-white dark:text-black px-6 py-3 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-lg"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
