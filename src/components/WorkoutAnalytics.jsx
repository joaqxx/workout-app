"use client"

import { useState, useEffect } from "react"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function WorkoutAnalytics({ isVisible, onClose }) {
  const [analyticsData, setAnalyticsData] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    averageWorkoutTime: 0,
    exerciseProgress: {},
    workoutHistory: [],
    volumeOverTime: [],
    exerciseFrequency: {},
  })

  useEffect(() => {
    if (isVisible) {
      calculateAnalytics()
    }
  }, [isVisible])

  const calculateAnalytics = () => {
    // Get workout history
    const workoutHistory = JSON.parse(localStorage.getItem("workoutHistory") || "[]")

    // Get all exercise logs
    const allExerciseLogs = {}
    const exerciseFrequency = {}
    let totalVolume = 0

    // Scan localStorage for exercise logs
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("exercise_")) {
        const exerciseData = JSON.parse(localStorage.getItem(key))
        const exerciseName = key.split("_")[2] // Assuming format: exercise_workoutId_exerciseIndex

        if (!allExerciseLogs[exerciseName]) {
          allExerciseLogs[exerciseName] = []
        }

        exerciseData.forEach((set) => {
          allExerciseLogs[exerciseName].push(set)
          totalVolume += (Number.parseFloat(set.weight) || 0) * (Number.parseFloat(set.reps) || 0)

          // Count exercise frequency
          const exerciseKey = exerciseName || "Unknown Exercise"
          exerciseFrequency[exerciseKey] = (exerciseFrequency[exerciseKey] || 0) + 1
        })
      }
    }

    // Calculate progress for each exercise (max weight over time)
    const exerciseProgress = {}
    Object.keys(allExerciseLogs).forEach((exerciseName) => {
      const logs = allExerciseLogs[exerciseName]
      const progressData = logs
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((log) => ({
          date: new Date(log.timestamp).toLocaleDateString(),
          weight: Number.parseFloat(log.weight) || 0,
          volume: (Number.parseFloat(log.weight) || 0) * (Number.parseFloat(log.reps) || 0),
        }))

      exerciseProgress[exerciseName] = progressData
    })

    // Calculate volume over time
    const volumeByDate = {}
    Object.values(allExerciseLogs)
      .flat()
      .forEach((set) => {
        const date = new Date(set.timestamp).toLocaleDateString()
        const volume = (Number.parseFloat(set.weight) || 0) * (Number.parseFloat(set.reps) || 0)
        volumeByDate[date] = (volumeByDate[date] || 0) + volume
      })

    const volumeOverTime = Object.entries(volumeByDate)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, volume]) => ({ date, volume }))

    setAnalyticsData({
      totalWorkouts: workoutHistory.length,
      totalVolume,
      averageWorkoutTime: 45, // Placeholder - would need to track actual workout times
      exerciseProgress,
      workoutHistory,
      volumeOverTime,
      exerciseFrequency,
    })
  }

  if (!isVisible) return null

  const volumeChartData = {
    labels: analyticsData.volumeOverTime.map((d) => d.date),
    datasets: [
      {
        label: "Total Volume (lbs)",
        data: analyticsData.volumeOverTime.map((d) => d.volume),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  }

  const frequencyChartData = {
    labels: Object.keys(analyticsData.exerciseFrequency),
    datasets: [
      {
        label: "Sets Completed",
        data: Object.values(analyticsData.exerciseFrequency),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-dark-border-dark">
        <div className="bg-blue-900 dark:bg-dark-accent-main text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Workout Analytics</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-dark-bg-primary p-6 rounded-lg border border-gray-200 dark:border-dark-border-dark text-center">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-dark-accent-main">
                {analyticsData.totalWorkouts}
              </h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">Total Workouts</p>
            </div>
            <div className="bg-gray-50 dark:bg-dark-bg-primary p-6 rounded-lg border border-gray-200 dark:border-dark-border-dark text-center">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-dark-accent-main">
                {analyticsData.totalVolume.toLocaleString()}
              </h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">Total Volume (lbs)</p>
            </div>
            <div className="bg-gray-50 dark:bg-dark-bg-primary p-6 rounded-lg border border-gray-200 dark:border-dark-border-dark text-center">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-dark-accent-main">
                {Object.keys(analyticsData.exerciseProgress).length}
              </h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">Exercises Tracked</p>
            </div>
            <div className="bg-gray-50 dark:bg-dark-bg-primary p-6 rounded-lg border border-gray-200 dark:border-dark-border-dark text-center">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-dark-accent-main">
                {analyticsData.averageWorkoutTime}min
              </h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">Avg Workout Time</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Volume Over Time */}
            <div className="bg-gray-50 dark:bg-dark-bg-primary p-6 rounded-lg border border-gray-200 dark:border-dark-border-dark">
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary mb-4">Volume Over Time</h3>
              {analyticsData.volumeOverTime.length > 0 ? (
                <Line data={volumeChartData} options={chartOptions} />
              ) : (
                <p className="text-gray-500 dark:text-dark-text-secondary text-center py-8">
                  No volume data available yet. Start logging your workouts!
                </p>
              )}
            </div>

            {/* Exercise Frequency */}
            <div className="bg-gray-50 dark:bg-dark-bg-primary p-6 rounded-lg border border-gray-200 dark:border-dark-border-dark">
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary mb-4">Exercise Frequency</h3>
              {Object.keys(analyticsData.exerciseFrequency).length > 0 ? (
                <Bar data={frequencyChartData} options={chartOptions} />
              ) : (
                <p className="text-gray-500 dark:text-dark-text-secondary text-center py-8">
                  No exercise data available yet. Complete some workouts to see your progress!
                </p>
              )}
            </div>
          </div>

          {/* Exercise Progress Table */}
          <div className="mt-8 bg-gray-50 dark:bg-dark-bg-primary p-6 rounded-lg border border-gray-200 dark:border-dark-border-dark">
            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary mb-4">Recent Progress</h3>
            {Object.keys(analyticsData.exerciseProgress).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-border-dark">
                      <th className="text-left py-2 text-gray-700 dark:text-dark-text-secondary">Exercise</th>
                      <th className="text-left py-2 text-gray-700 dark:text-dark-text-secondary">Max Weight</th>
                      <th className="text-left py-2 text-gray-700 dark:text-dark-text-secondary">Total Sets</th>
                      <th className="text-left py-2 text-gray-700 dark:text-dark-text-secondary">Last Workout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(analyticsData.exerciseProgress).map(([exercise, data]) => {
                      const maxWeight = Math.max(...data.map((d) => d.weight))
                      const lastWorkout = data[data.length - 1]?.date || "N/A"
                      return (
                        <tr key={exercise} className="border-b border-gray-200 dark:border-dark-border-dark">
                          <td className="py-2 text-gray-900 dark:text-dark-text-primary capitalize">
                            {exercise.replace(/_/g, " ")}
                          </td>
                          <td className="py-2 text-gray-900 dark:text-dark-text-primary">{maxWeight} lbs</td>
                          <td className="py-2 text-gray-900 dark:text-dark-text-primary">{data.length}</td>
                          <td className="py-2 text-gray-900 dark:text-dark-text-primary">{lastWorkout}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-dark-text-secondary text-center py-8">
                No progress data available yet. Start logging your sets!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
