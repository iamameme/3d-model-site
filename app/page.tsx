import type { Metadata } from "next"
import Hero from "@/components/hero"
import ImageUploader from "@/components/image-uploader"
import ModelViewer from "@/components/model-viewer"
import FAQ from "@/components/faq"
import Header from "@/components/header"
import Footer from "@/components/footer"
import DownloadSection from "@/components/download-section"
import HowToUse from "@/components/how-to-use"
import ExamplesSection from "@/components/examples-section"

export const metadata: Metadata = {
  title: "PNG to Flat 3D Converter | For Games and Printing",
  description: "100% free online / Blender plugin to convert a 2D image to a 3D model with NO AI. Consistent results everytime. For games and 3D printing.",
}
// 2D to 3D AI — Transform any text or images to 3D in seconds, quad faces and PBR texture supported.
// Rodin is an advanced 3D model AI generator. Biggest discount so far. Limited time deal.

export default function Home() {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <Header />
        <Hero />
        <main className="container mx-auto px-4 py-4">
          {/* <HowToUse /> */}
            <ExamplesSection />

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold mb-3">Upload Your Image</h2>
              <ImageUploader />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3">3D Model Preview</h2>
              <ModelViewer />
            </div>
          </div>

          

          <div className="mt-16">
            <DownloadSection />
          </div>

          <div className="mt-16">
            <FAQ />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
