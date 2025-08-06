"use client"

export default function Button(props) {
  const { text, func, variant = "primary", disabled = false, className = "" } = props

  const baseClasses = "px-8 py-4 font-semibold transition-all duration-300 transform"
  const variants = {
    primary:
      "bg-blue-900 hover:bg-blue-800 text-white border-2 border-blue-900 hover:border-blue-800 shadow-lg hover:shadow-xl hover:-translate-y-1 " +
      "dark:bg-dark-accent-main dark:hover:bg-dark-accent-dark dark:border-dark-accent-main dark:hover:border-dark-accent-dark dark:text-dark-text-primary",
    secondary:
      "bg-white hover:bg-gray-50 text-blue-900 border-2 border-blue-900 hover:border-blue-800 " +
      "dark:bg-dark-bg-secondary dark:hover:bg-dark-bg-primary dark:text-dark-accent-main dark:border-dark-accent-main dark:hover:border-dark-accent-dark ",
    outline:
      "text-blue-900 border-2 border-blue-900 hover:bg-gray-100"
        +
      "dark:hover:bg-dark-accent-main dark:text-blue-200 dark:hover:text-dark-text-primary dark:border-dark-accent-main",

  }

  return (
    <button
      onClick={func}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed " : ""} ${className}`}
    >
      <p className="font-medium">{text}</p>
    </button>
  )
}
