export default function SectionWrapper(props) {
  const { children, header, title, id } = props
  return (
    <section id={id} className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-b from-black via-gray-950 to-gray-800 text-white py-16 flex flex-col gap-6 justify-center items-center">
        <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
          <p className="uppercase font-semibold text-sm tracking-wider">{header}</p>
        </div>
        <h2 className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center leading-tight">
          {title[0]} <span className="text-blue-200 dark:text-dark-text-primary">{title[1]}</span> {title[2]}
        </h2>
      </div>
      <div className="flex-1 bg-gray-50 dark:bg-dark-bg-primary py-16">{children}</div>
    </section>
  )
}
