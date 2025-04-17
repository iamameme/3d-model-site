export default function Hero() {

  return (
    <div className="py-6">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
          2D Image to 3D Model
        </h1>

        <div className="mt-4 inline-block rounded-full bg-black/30 backdrop-blur-md px-4 py-2 border border-purple-500/30">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-sm font-medium">
              <span className="text-purple-300">Total Conversions:</span>{" "}
              <span className="font-bold text-white">0</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
