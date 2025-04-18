"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Get3DModel } from "./3d-model-2"
import { downloadFile, getObjectUrlFromUrl } from "@/lib/utils"

function Model(url, format) {
  return Get3DModel(url, format, true);
}

export default function ModelViewer() {
  const [isModelReady, setIsModelReady] = useState(false)
  const [processingImage, setProcessingImage] = useState<string | null>(null)
  const [format, setFormat] = useState<string>("gltf")
  const [objectUrl, setObjectUrl] = useState<string>('');
  const [modelParams, setModelParams] = useState({
    extrudeDepth: 0.2,
    alphaThreshold: 0.15,
    simplicity: 3.0,
    enclosed: false,
    roundedEdges: false,
    minimumLength: 2000,
    imageUrl: undefined,
    imageName: '',
    jobId: '',
    format: '',
    downloadUrl: undefined,
  })
  const { toast } = useToast()

  useEffect(() => {
    const handleModelProcessed = async (e: CustomEvent) => {
      setProcessingImage(e.detail.imageUrl)
      setFormat(e.detail.format)
      setModelParams({
        extrudeDepth: e.detail.extrudeDepth,
        alphaThreshold: e.detail.alphaThreshold,
        simplicity: e.detail.simplicity,
        enclosed: e.detail.enclosed,
        roundedEdges: e.detail.roundedEdges,
        minimumLength: e.detail.minimumLength,
        imageUrl: e.detail.imageUrl,
        imageName: e.detail.imageName,
        jobId: e.detail.jobId,
        format: e.detail.format,
        downloadUrl: e.detail.downloadUrl,
      })
      const objectUrl = await getObjectUrlFromUrl(e.detail.downloadUrl);
      setObjectUrl(objectUrl);
      setIsModelReady(true)
    }

    window.addEventListener("modelProcessed", handleModelProcessed as EventListener)

    return () => {
      window.removeEventListener("modelProcessed", handleModelProcessed as EventListener)
    }
  }, [])

  const handleDownload = async () => {
    toast({
      title: "Download started",
      description: `Your ${format.toUpperCase()} file is being downloaded.`,
    })

    const formatFinal = modelParams.format == 'gltf' ? 'glb' : modelParams.format;
    await downloadFile(objectUrl, modelParams.imageName.replace('.png', '.' + formatFinal));
    // In a real app, this would download the actual model file
    // For demo purposes, we're just showing a toast
    toast({
      title: "Download complete",
      description: `Your 3D model has been downloaded.`,
    })
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden bg-black/30 backdrop-blur-md border-purple-500/20">
        <CardContent className="p-0">
          <div className="h-[400px] w-full bg-gray-900 relative">
            {isModelReady && objectUrl != '' ? (
              Model(objectUrl, modelParams.format)
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center p-6">
                  <p className="text-gray-400 mb-2">Upload an image and convert it to see the 3D preview here</p>
                  <div className="w-16 h-16 mx-auto border-4 border-purple-500/30 border-dashed rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isModelReady && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-black/30 backdrop-blur-md rounded-xl p-4 border border-purple-500/20">
            <div>
              <h3 className="font-medium text-purple-300">Model Information</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-purple-950/50 text-purple-300 border-purple-500/30">
                  {format.toUpperCase()}
                </Badge>
                {modelParams.enclosed && (
                  <Badge variant="outline" className="bg-blue-950/50 text-blue-300 border-blue-500/30">
                    3D Print Ready
                  </Badge>
                )}
                {modelParams.roundedEdges && (
                  <Badge variant="outline" className="bg-pink-950/50 text-pink-300 border-pink-500/30">
                    Rounded Edges
                  </Badge>
                )}
              </div>
            </div>
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-purple-300">Original Image</p>
              <div style={{ minHeight: 150}} className="h-24 w-full overflow-hidden rounded-md bg-black/30 backdrop-blur-md border border-purple-500/20">
                {processingImage && (
                  <img
                    src={processingImage || "/placeholder.svg"}
                    alt="Original"
                    style={{ maxWidth: 200, margin: '0 auto', objectFit: 'contain' }}
                    className="h-full w-full"
                  />
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-purple-300">Model Parameters</p>
              <div style={{ minHeight: 150 }} className="h-24 w-full overflow-hidden rounded-md bg-black/30 backdrop-blur-md border border-purple-500/20 p-2">
                <ul className="text-xs space-y-1 text-gray-300">
                  <li>
                    Extrude Depth: <span className="text-purple-300 font-mono">{modelParams.extrudeDepth}</span>
                  </li>
                  <li>
                    Simplicity: <span className="text-purple-300 font-mono">{modelParams.simplicity}</span>
                  </li>
                  <li>
                    Alpha Threshold: <span className="text-purple-300 font-mono">{modelParams.alphaThreshold}</span>
                  </li>
                  <li>
                    Minimum Length: <span className="text-purple-300 font-mono">{modelParams.minimumLength}</span>
                  </li>
                  <li>
                    Enclosed/3D Print:{" "}
                    <span className="text-purple-300 font-mono">{modelParams.enclosed ? "Yes" : "No"}</span>
                  </li>
                  <li>
                    Rounded Edges:{" "}
                    <span className="text-purple-300 font-mono">{modelParams.roundedEdges ? "Yes" : "No"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
