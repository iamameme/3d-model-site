"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, ImageIcon, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [outputFormat, setOutputFormat] = useState("gltf")
  const [extrudeDepth, setExtrudeDepth] = useState(0.2)
  const [simplicity, setSimplicity] = useState(3.0)
  const [minimumLength, setMinimumLength] = useState(2000)
  const [enclosed, setEnclosed] = useState(false)
  const [roundedEdges, setRoundedEdges] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [cooldownActive, setCooldownActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Cooldown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (cooldownActive && cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            setCooldownActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [cooldownActive, cooldown])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG file",
          variant: "destructive",
        })
        return
      }

      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        setImageName(file.name);
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleProcess = async () => {
    if (!image || cooldownActive) return

    setIsProcessing(true)
    const resp = await fetch("/api/submit", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          imageData: image,
          imageName,
          format: outputFormat,
          extrude: extrudeDepth,
          simplicity,
          minlength: minimumLength,
          enclosed,
          rounded: roundedEdges,
      })
    })
    const json = await resp.json();
    const jobId = json.jobId;

    let processing = true;
    while (processing) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const statusResp = await fetch(`/api/status?jobId=${jobId}`)
      const statusJson = await statusResp.json();
      if (statusJson.status == 'completed') {
        processing = false;
      }
    }

    // Dispatch an event that the model viewer can listen for
    window.dispatchEvent(
      new CustomEvent("modelProcessed", {
        detail: {
          imageUrl: image,
          downloadUrl: `/api/download?jobId=${jobId}`,
          imageName,
          format: outputFormat,
          extrudeDepth,
          simplicity,
          minimumLength,
          enclosed,
          roundedEdges,
          jobId,
        },
      }),
    )

    toast({
      title: "Processing complete",
      description: `Your 3D model has been generated in ${outputFormat.toUpperCase()} format.`,
    })

    // Start cooldown
    setIsProcessing(false)
    setCooldown(15)
    setCooldownActive(true)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 backdrop-blur-md border-purple-500/20">
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              image ? "border-purple-500" : "border-gray-600"
            } hover:border-purple-400 transition-colors`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <p className="mt-2 text-sm text-gray-300">Uploading image...</p>
              </div>
            ) : image ? (
              <div className="space-y-4">
                <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg">
                  <img src={image || "/placeholder.svg"} alt="Uploaded" className="w-full h-auto" />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setImage(null)}
                  className="border-purple-500 text-purple-300 hover:bg-purple-950/30"
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-4 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-purple-500 mb-2" />
                <p className="text-sm font-medium text-gray-300">Drag and drop your image here or click to browse</p>
                <p className="mt-1 text-xs text-gray-400">Supports PNG w/ Transparent Background</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-lg font-medium mb-4 text-purple-300">Output Format</h3>
          <RadioGroup
            defaultValue="gltf"
            value={outputFormat}
            onValueChange={setOutputFormat}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gltf" id="gltf" className="text-purple-500" />
              <Label htmlFor="gltf" className="text-gray-300 cursor-pointer">
                GLTF
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="obj" id="obj" className="text-purple-500" />
              <Label htmlFor="obj" className="text-gray-300 cursor-pointer">
                OBJ
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fbx" id="fbx" className="text-purple-500" />
              <Label htmlFor="fbx" className="text-gray-300 cursor-pointer">
                FBX
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-lg font-medium mb-4 text-purple-300">Model Parameters</h3>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="extrude-depth" className="text-gray-300">
                  Extrude Depth
                </Label>
                <span className="text-sm text-purple-300 font-mono">{extrudeDepth.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="extrude-depth"
                  type="number"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={extrudeDepth}
                  onChange={(e) => setExtrudeDepth(Number.parseFloat(e.target.value))}
                  className="w-20 bg-gray-900/60 border-purple-500/30 text-gray-200"
                />
                <Slider
                  value={[extrudeDepth]}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  onValueChange={(value) => setExtrudeDepth(value[0])}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="simplicity" className="text-gray-300">
                  Simplicity
                </Label>
                <span className="text-sm text-purple-300 font-mono">{simplicity.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="simplicity"
                  type="number"
                  min="1.0"
                  max="10.0"
                  step="0.5"
                  value={simplicity}
                  onChange={(e) => setSimplicity(Number.parseFloat(e.target.value))}
                  className="w-20 bg-gray-900/60 border-purple-500/30 text-gray-200"
                />
                <Slider
                  value={[simplicity]}
                  min={1.0}
                  max={10.0}
                  step={0.5}
                  onValueChange={(value) => setSimplicity(value[0])}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Label htmlFor="minimum-length" className="text-gray-300">
                  Minimum Length
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        The lower this value, the more likely small objects (or artifacts) will show up. The higher, the
                        less likely artifacts will show up.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm text-purple-300 font-mono">{minimumLength}</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="minimum-length"
                type="number"
                min="500"
                max="5000"
                step="100"
                value={minimumLength}
                onChange={(e) => setMinimumLength(Number.parseInt(e.target.value))}
                className="w-20 bg-gray-900/60 border-purple-500/30 text-gray-200"
              />
              <Slider
                value={[minimumLength]}
                min={500}
                max={5000}
                step={100}
                onValueChange={(value) => setMinimumLength(value[0])}
                className="flex-1"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-6">
            <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-gray-800/30">
              <Label htmlFor="enclosed" className="cursor-pointer text-gray-300">
                Enclosed / 3D Print Ready
              </Label>
              <Switch
                id="enclosed"
                checked={enclosed}
                onCheckedChange={setEnclosed}
                className="data-[state=checked]:bg-purple-500"
              />
            </div>

            <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-gray-800/30">
              <Label htmlFor="rounded-edges" className="cursor-pointer text-gray-300">
                Rounded Edges
              </Label>
              <Switch
                id="rounded-edges"
                checked={roundedEdges}
                onCheckedChange={setRoundedEdges}
                className="data-[state=checked]:bg-purple-500"
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          disabled={!image || isProcessing || cooldownActive}
          onClick={handleProcess}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : cooldownActive ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wait {cooldown}s before next conversion
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Convert to 3D Model
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
