import { Card, CardContent } from "@/components/ui/card"
import { FileImage, FileUp, CuboidIcon as Cube } from "lucide-react"

// Update the HowToUse component to be more compact
export default function HowToUse() {
  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          How to Use
        </h2>

        <Card className="bg-black/30 backdrop-blur-md border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-shrink-0 w-full md:w-auto">
                <div className="bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <FileImage className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white mb-1">Upload a PNG with Transparent Background</h3>
                <p className="text-gray-300 text-sm">
                  For best results, upload a PNG image with a transparent background. This allows our algorithm to
                  properly detect the shape boundaries and create an accurate 3D model.
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="bg-black/20 rounded-lg p-2 border border-purple-500/10">
                    <div className="flex items-center gap-1 mb-1">
                      <FileUp className="w-3 h-3 text-purple-400" />
                      <span className="font-medium text-purple-300 text-xs">Step 1</span>
                    </div>
                    <p className="text-xs text-gray-400">Prepare PNG with transparent background</p>
                  </div>

                  <div className="bg-black/20 rounded-lg p-2 border border-purple-500/10">
                    <div className="flex items-center gap-1 mb-1">
                      <FileUp className="w-3 h-3 text-purple-400" />
                      <span className="font-medium text-purple-300 text-xs">Step 2</span>
                    </div>
                    <p className="text-xs text-gray-400">Upload and adjust parameters</p>
                  </div>

                  <div className="bg-black/20 rounded-lg p-2 border border-purple-500/10">
                    <div className="flex items-center gap-1 mb-1">
                      <Cube className="w-3 h-3 text-purple-400" />
                      <span className="font-medium text-purple-300 text-xs">Step 3</span>
                    </div>
                    <p className="text-xs text-gray-400">Convert and download 3D model</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
