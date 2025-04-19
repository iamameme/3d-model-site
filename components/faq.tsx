import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <section id="faq" className="py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Frequently Asked Questions
        </h2>

        <Accordion
          type="single"
          collapsible
          className="bg-black/30 backdrop-blur-md rounded-xl p-2 border border-purple-500/20"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="px-4 text-white hover:text-purple-300">
              How does 2D to 3D conversion work?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-gray-300">
              It uses the Blender plugin mentioned above. That plugin looks at the image, find the contour of it, creates a mesh out of it, extrudes it,
              then takes the base image, adds colors to the outsides of it (to fill in the newly extruded areas), and applies it as a material!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="px-4 text-white hover:text-purple-300">
              What types of images work best for conversion?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-gray-300">
              Images with clear outlines, good contrast, and distinct features work best for conversion. Logos,
              silhouettes, cartoon characters, and simple illustrations typically produce the best results. Complex
              photographs with many details or unclear boundaries may result in less accurate 3D models. For best
              results, use high-resolution images with clean backgrounds.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="px-4 text-white hover:text-purple-300">
              What do the different parameters control?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-gray-300">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Extrude Depth:</strong> Controls how far the 3D model extends from the base plane. Higher
                  values create thicker models.
                </li>
                <li>
                  <strong>Alpha Threshold:</strong> Controls the alpha of a pixel that should be included.
                </li>
                <li>
                  <strong>Simplicity:</strong> Determines how many vertices and faces are used in the model. Higher
                  values create simpler models with fewer details.
                </li>
                <li>
                  <strong>Enclosed/3D Print Ready:</strong> When enabled, ensures the model is watertight (no holes) and
                  suitable for 3D printing.
                </li>
                <li>
                  <strong>Rounded Edges:</strong> Applies a bevel or fillet to sharp edges, creating a smoother, more
                  organic look.
                </li>
                <li>
                  <strong>Minimum Length:</strong> For images with disconnected / multiple objects. Tuning this will result in 
                  more objects from the image showing up, but also possibly artifacts.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="px-4 text-white hover:text-purple-300">
              Which file formats are supported?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-gray-300">
              I support exporting to the most common 3D file formats:
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  <strong>GLTF/GLB:</strong> Ideal for web and game engines like Unity and Unreal Engine.
                </li>
                <li>
                  <strong>OBJ:</strong> Universal format supported by almost all 3D software.
                </li>
                <li>
                  <strong>FBX:</strong> Great for animation and professional 3D software like Blender, Maya, and 3ds
                  Max.
                </li>
              </ul>
              For input images, I support PNG. 
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
