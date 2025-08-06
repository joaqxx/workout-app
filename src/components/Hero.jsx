import Button from "./Button"

export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col gap-12 items-center justify-center text-center max-w-5xl w-full mx-auto p-6 bg-gradient-to-br">
      <div className="flex flex-col gap-6">
        <div className="inline-block">
          <p className="bg-blue-900 dark:bg-dark-accent-main text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
            Transform Your Body
          </p>
        </div>
        <h1 className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight text-gray-900 dark:text-dark-text-primary">
          BE ONE OF THE{" "}
          <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-dark-accent-main dark:to-dark-accent-dark bg-clip-text text-transparent">
            ELITE
          </span>
        </h1>
      </div>

      {/* <div className="max-w-3xl">
        <p className="text-lg md:text-xl text-gray-600 dark:text-dark-text-secondary leading-relaxed font-light">
          I acknowledge that through intense growth and training, I may reach an{" "}
          <span className="font-semibold text-blue-900 dark:text-dark-accent-main">Exceptional Level</span> of physical
          development. I accept all potential risks, including changes in self-image and physical limitations, as part
          of the path to becoming <span className="font-semibold text-blue-900 dark:text-dark-accent-main">Elite.</span>
        </p>
      </div> */}

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button
          func={() => {
            window.location.href = "#generate"
          }}
          text={"Learn More"}
          variant="outline"
          className="rounded-xl bg-blue-900 text-white hover:bg-blue-800"

        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-blue-900 dark:text-dark-accent-main"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  )
}
