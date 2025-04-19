import { Button } from "@/components/ui/button"
import { Github, Code2 } from "lucide-react"

export default function DownloadSection() {
  return (
    <section id="download" className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Download the Code!
          </h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Want to run this conversion locally? I've created a Blender plugin that provides the same functionality as
            this website.
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-8 max-w-4xl mx-auto border border-purple-500/20 backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <div className="aspect-video rounded-lg bg-black/40 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  {/* <div className="absolute inset-0 flex items-center justify-center">
                    <Code2 className="w-16 h-16 text-purple-400 opacity-50" />
                  </div> */}
                  <img src="blender.png" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-300">2D-to-3D-Blender-Plugin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-bold text-white mb-3">Blender Plugin</h3>
              <p className="text-gray-300 mb-6">
                My open-source Blender plugin gives you the same conversion capabilities offline. Perfect for artists,
                game developers, and 3D printing enthusiasts who want to integrate this functionality directly into
                their workflow.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="inline-block w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center text-xs">
                    ✓
                  </span>
                  Works with Blender 2.8+
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="inline-block w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center text-xs">
                    ✓
                  </span>
                  All the same parameters as the web version
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="inline-block w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center text-xs">
                    ✓
                  </span>
                  No internet connection required
                </div>
              </div>

              <div className="mt-8">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Github className="mr-2 h-4 w-4" />
                  <a
                    href="https://github.com/iamameme/blender-2d-to-3d-plugin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download from GitHub
                  </a>
                </Button>
                <p className="text-xs text-gray-400 mt-2">MIT License • Free for personal and commercial use</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
