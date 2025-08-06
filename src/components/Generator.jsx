"use client"

import { useState } from "react"
import SectionWrapper from "./SectionWrapper"
import ProgressFlow from "./ProgressFlow"
import { SCHEMES, WORKOUTS } from "../utils/WorkoutData"
import Button from "./Button"

function Header(props) {
  const { index, title, description } = props
  return (
    <div className="flex flex-col gap-4 text-center">
      <div className="flex items-center gap-3 justify-center">
        <div className="w-12 h-12 bg-blue-900 dark:bg-dark-accent-main text-white rounded-full flex items-center justify-center">
          <span className="text-xl font-bold">{index}</span>
        </div>
        <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-text-primary">{title}</h4>
      </div>
      <p className="text-gray-600 dark:text-dark-text-secondary max-w-2xl mx-auto leading-relaxed">{description}</p>
    </div>
  )
}

export default function Generator(props) {
  const { poison, setPoison, muscles, setMuscles, goal, setGoal, updateWorkout } = props
  const [showModal, setShowModal] = useState(false)

  // Calculate current step for progress flow
  const getCurrentStep = () => {
    if (!poison) return 1
    if (muscles.length === 0) return 2
    if (!goal) return 3
    return 4
  }

  function toggleModal() {
    setShowModal(!showModal)
  }

  function updateMuscles(muscleGroup) {
    const alreadySelected = muscles.includes(muscleGroup)
    if (poison !== "individual") {
      setMuscles([muscleGroup])
      setShowModal(false)
      return
    }
    if (muscles.length > 2) {
      return
    }
    if (alreadySelected) {
      setMuscles(muscles.filter((val) => val !== muscleGroup))
      return
    }
    if (muscles.length >= 4) {
      return
    }
    setMuscles([...muscles, muscleGroup])
    if (muscles.length === 2) {
      setShowModal(false)
    }
  }

  const handleGenerateWorkout = () => {
    updateWorkout()
  }

  return (
    <SectionWrapper id={"generate"} header={"generate your workout"} title={["It's", "Huge", "O'Clock"]}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Flow */}
        <ProgressFlow currentStep={getCurrentStep()} />

        {/* Step 1: Workout Type */}
        <div className="mb-16">
          <Header
            index={"01"}
            title={"Choose Workout Type"}
            description={"Select the type of workout that matches your training style and goals."}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            {Object.keys(WORKOUTS).map((type, typeIndex) => (
              <button
                key={typeIndex}
                onClick={() => {
                  setMuscles([])
                  setPoison(type)
                }}
                className={`
                                p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
                                ${
                                  type === poison
                                    ? "bg-blue-900 dark:bg-dark-accent-main text-white border-blue-900 dark:border-dark-accent-main shadow-lg"
                                    : "bg-white dark:bg-dark-bg-secondary text-gray-700 dark:text-dark-text-secondary border-gray-200 dark:border-dark-border-dark hover:border-blue-300 dark:hover:border-dark-accent-main hover:shadow-md"
                                }
                            `}
              >
                <p className="font-semibold capitalize text-center">{type.replaceAll("_", " ")}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Muscle Groups */}
        <div className="mb-16">
          <Header
            index={"02"}
            title={"Select Target Muscles"}
            description={"Choose the muscle groups you want to focus on in your workout."}
          />
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white dark:bg-dark-bg-secondary border-2 border-gray-200 dark:border-dark-border-dark rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={toggleModal}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-bg-primary transition-colors duration-200"
              >
                <p className="text-gray-700 dark:text-dark-text-secondary font-medium capitalize">
                  {muscles.length === 0 ? "Select muscle groups" : muscles.join(", ")}
                </p>
                <svg
                  className={`w-5 h-5 text-gray-400 dark:text-dark-text-secondary transition-transform duration-200 ${showModal ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showModal && (
                <div className="border-t border-gray-200 dark:border-dark-border-dark p-4 bg-gray-50 dark:bg-dark-bg-primary">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(poison === "individual" ? WORKOUTS[poison] : Object.keys(WORKOUTS[poison])).map(
                      (muscleGroup, muscleGroupIndex) => (
                        <button
                          key={muscleGroupIndex}
                          onClick={() => updateMuscles(muscleGroup)}
                          className={`
                                                p-3 text-left transition-all duration-200 font-medium
                                                ${
                                                  muscles.includes(muscleGroup)
                                                    ? "bg-blue-900 dark:bg-dark-accent-main rounded-md text-white"
                                                    : "bg-white dark:bg-dark-bg-secondary text-gray-700 dark:text-dark-text-secondary rounded-md hover:bg-blue-50 dark:hover:bg-dark-border-dark hover:text-blue-900 dark:hover:text-white"
                                                }
                                            `}
                        >
                          <p className="capitalize">{muscleGroup.replaceAll("_", " ")}</p>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Training Objective */}
        <div className="mb-16">
          <Header
            index={"03"}
            title={"Set Your Objective"}
            description={"Define your training goal to customize the workout intensity and structure."}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
            {Object.keys(SCHEMES).map((scheme, schemeIndex) => (
              <button
                key={schemeIndex}
                onClick={() => setGoal(scheme)}
                className={`
                                p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
                                ${
                                  scheme === goal
                                    ? "bg-blue-900 dark:bg-dark-accent-main text-white border-blue-900 dark:border-dark-accent-main shadow-lg"
                                    : "bg-white dark:bg-dark-bg-secondary text-gray-700 dark:text-dark-text-secondary border-gray-200 dark:border-dark-border-dark hover:border-blue-300 dark:hover:border-dark-accent-main hover:shadow-md"
                                }
                            `}
              >
                <p className="font-semibold capitalize text-center">{scheme.replaceAll("_", " ")}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            func={handleGenerateWorkout}
            text={"Generate My Workout"}
            disabled={!poison || muscles.length === 0 || !goal}
            className="rounded-xl"
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
