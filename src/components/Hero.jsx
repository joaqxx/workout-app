import Button from "./Button"

export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center max-w-6xl w-full mx-auto p-6 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-300 to-transparent dark:via-gray-600 animate-pulse"></div>
        <div className="grid grid-cols-12 gap-4 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-300 dark:border-gray-600 animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '3s'
              }}
            ></div>
          ))}
        </div>
      </div>

      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-gray-400 dark:bg-gray-500 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-gray-300 dark:bg-gray-600 rotate-45 animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 border border-gray-400 dark:border-gray-500 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-gray-300 dark:bg-gray-600 rotate-45 animate-bounce"></div>
      </div>

    
      <div className="relative z-10 flex flex-col gap-8 items-center">
        {/* Badge */}
        <div className="inline-block animate-fade-in-up">
          <div className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-none text-xs font-bold uppercase tracking-[0.3em] border border-gray-300 dark:border-gray-600 hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-300">
            ELITE TRAINING
          </div>
        </div>

        
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.8] text-black dark:text-white tracking-tight">
            DISCIPLINE
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-light tracking-widest">01</span>
            <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
          </div>
          <h2 className="font-thin text-2xl sm:text-3xl md:text-4xl text-gray-600 dark:text-gray-300 tracking-widest">
            STRENGTH • POWER • CONTROL
          </h2>
        </div>

      
        <div className="max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-light tracking-wide">
            FORGE YOUR BODY INTO A MACHINE OF PURE STRENGTH. 
            NO COMPROMISES. NO EXCUSES. ONLY RESULTS.
          </p>
        </div>

      
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button
            func={() => {
              window.location.href = "#generate"
            }}
            text={"BEGIN TRAINING"}
            variant="outline"
            className="group relative bg-transparent rounded-lg border-2 border-black dark:border-white text-black dark:text-white px-12 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">BEGIN TRAINING</span>
            <div className="absolute inset-0 bg-black dark:bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Button>
        </div>

       
        <div className="grid grid-cols-3 gap-12 mt-7 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="text-center">
            <div className="text-2xl font-bold text-black dark:text-white">01</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase">PROGRESS</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black dark:text-white">02</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase">DISCIPLINE</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black dark:text-white">03</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase">RESULTS</div>
          </div>
        </div>
      </div>


      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
