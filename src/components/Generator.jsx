"use client"

import { useState } from "react"
import SectionWrapper from "./SectionWrapper"
import ProgressFlow from "./ProgressFlow"
import { SCHEMES, WORKOUTS } from "../utils/WorkoutData"
import Button from "./Button"

function StepHeader({ index, title, description, isActive }) {
  return (
    <div className={`text-center transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          isActive 
            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
            : 'bg-transparent text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600'
        }`}>
          <span className="text-xl font-bold">{index}</span>
        </div>
        <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1 max-w-32"></div>
      </div>
      <h3 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-4 tracking-tight">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
        {description}
      </p>
    </div>
  )
}

export default function Generator(props) {
  const { poison, setPoison, muscles, setMuscles, goal, setGoal, updateWorkout } = props
  const [showModal, setShowModal] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)

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

  const currentStep = getCurrentStep()

  return (
    <SectionWrapper id={"generate"} header={"generate your workout"} title={["ELITE", "Traninng"]}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Progress Flow */}
        <div className="mb-20">
          <ProgressFlow currentStep={currentStep} />
        </div>

        {/* Step 1: Workout Type */}
        <div className="mb-24">
          <StepHeader
            index={"01"}
            title={"WORKOUT TYPE"}
            description={"Choose your training approach and intensity level"}
            isActive={currentStep >= 1}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">
            {Object.keys(WORKOUTS).map((type, typeIndex) => (
              <button
                key={typeIndex}
                onClick={() => {
                  setMuscles([])
                  setPoison(type)
                }}
                onMouseEnter={() => setHoveredItem(type)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  group relative p-8 rounded-2xl border-2 transition-all duration-500 transform hover:scale-102 overflow-hidden
                  ${type === poison
                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-2xl"
                    : "bg-white dark:bg-black text-gray-700 dark:text-white border-black dark:border-white hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-xl"
                  }
                `}
              >
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-400 dark:to-gray-500 transition-opacity duration-500 ${
                  hoveredItem === type && type !== poison ? 'opacity-100' : 'opacity-0'
                }`}></div>
                
                <div className="relative z-10">
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                      type === poison 
                        ? 'bg-white dark:bg-black text-black dark:text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      <span className="text-lg font-bold">{typeIndex + 1}</span>
                    </div>
                    <h4 className="font-bold text-lg capitalize tracking-wide">
                      {type.replaceAll("_", " ")}
                    </h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Muscle Groups */}
        <div className="mb-24">
          <StepHeader
            index={"02"}
            title={"TARGET MUSCLES"}
            description={"Select the muscle groups you want to focus on"}
            isActive={currentStep >= 2}
          />
          
          <div className="max-w-3xl mx-auto mt-16">
            <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <button
                onClick={toggleModal}
                className="w-full p-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-white dark:bg-black"></div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-lg capitalize tracking-wide">
                    {muscles.length === 0 ? "Select muscle groups" : muscles.join(", ")}
                  </p>
                </div>
                <svg
                  className={`w-6 h-6 text-gray-400 dark:text-gray-500 transition-all duration-300 group-hover:scale-110 ${
                    showModal ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showModal && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-black dark:bg-gray-200 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(poison === "individual" ? WORKOUTS[poison] : Object.keys(WORKOUTS[poison])).map(
                      (muscleGroup, muscleGroupIndex) => (
                        <button
                          key={muscleGroupIndex}
                          onClick={() => updateMuscles(muscleGroup)}
                          className={`
                            group p-4 text-left transition-all duration-300 font-medium rounded-xl hover:scale-105
                            ${muscles.includes(muscleGroup)
                              ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                              : "bg-gray-100 dark:bg-black text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black hover:shadow-md"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              muscles.includes(muscleGroup)
                                ? 'bg-white dark:bg-black'
                                : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-500 dark:group-hover:bg-gray-400'
                            }`}></div>
                            <span className="capitalize tracking-wide">{muscleGroup.replaceAll("_", " ")}</span>
                          </div>
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
        <div className="mb-24">
          <StepHeader
            index={"03"}
            title={"TRAINING OBJECTIVE"}
            description={"Define your training goal and intensity preference"}
            isActive={currentStep >= 3}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
            {Object.keys(SCHEMES).map((scheme, schemeIndex) => (
              <button
                key={schemeIndex}
                onClick={() => setGoal(scheme)}
                onMouseEnter={() => setHoveredItem(scheme)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  group relative p-8 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 overflow-hidden
                  ${scheme === goal
                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-2xl"
                    : "bg-white dark:bg-black text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white hover:shadow-xl"
                  }
                `}
              >
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 transition-opacity duration-500 ${
                  hoveredItem === scheme && scheme !== goal ? 'opacity-100' : 'opacity-0'
                }`}></div>
                
                <div className="relative z-10 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    scheme === goal 
                      ? 'bg-white dark:bg-black text-black dark:text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    <span className="text-2xl font-bold">{schemeIndex + 1}</span>
                  </div>
                  <h4 className="font-bold text-xl capitalize tracking-wide">
                    {scheme.replaceAll("_", " ")}
                  </h4>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <div className="relative inline-block">
            <Button
              func={handleGenerateWorkout}
              text={"GENERATE WORKOUT"}
              disabled={!poison || muscles.length === 0 || !goal}
              className={`
                group relative bg-transparent border-2 border-black dark:border-white text-black dark:text-white 
                px-16 py-6 rounded-2xl font-bold tracking-widest uppercase text-lg
                hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black 
                transition-all duration-500 transform hover:scale-105 overflow-hidden
                ${(!poison || muscles.length === 0 || !goal) 
                  ? 'cursor-not-allowed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500' 
                  : 'hover:shadow-2xl'
                }
              `}
            >
              <span className="relative z-10">GENERATE WORKOUT</span>
              <div className="absolute inset-0 bg-black dark:bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Button>
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    </SectionWrapper>
  )
}
