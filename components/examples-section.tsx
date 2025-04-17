"use client"

import {  useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PresentationControls, Stage } from "@react-three/drei"
import { Suspense } from "react"
import { Get3DModel } from "./3d-model"

function LogoModel() {
  return Get3DModel();
}

function CharacterModel() {
  return Get3DModel();
}

function IconModel() {
  return Get3DModel();
}

function ModelViewer({ modelType }: { modelType: "logo" | "character" | "icon" }) {
  return (
    <div className="h-[400px] w-full bg-gray-900 rounded-lg overflow-hidden">
      {modelType === "logo" && <LogoModel />}
      {modelType === "character" && <CharacterModel />}
      {modelType === "icon" && <IconModel />}
    </div>
  )
}

export default function ExamplesSection() {
  const [activeTab, setActiveTab] = useState("logo")

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Check Out Some Examples
        </h2>

        <Tabs defaultValue="logo" className="w-full" onValueChange={(value) => setActiveTab(value)}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-black/30 backdrop-blur-md border border-purple-500/20">
              <TabsTrigger value="logo" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Bacon
              </TabsTrigger>
              <TabsTrigger
                value="character"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Game Character
              </TabsTrigger>
              <TabsTrigger value="icon" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                App Icon
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="logo" className="mt-0" style={{ maxWidth: 960, margin: '0 auto'}}>
            <Card className="bg-black/30 backdrop-blur-md border-purple-500/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div style={{ maxHeight: 440 }}>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">Before: PNG Image</h3>
                    <img src="/assets/bacon.png" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">After: 3D Model</h3>
                    <ModelViewer modelType="logo" />
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400">logo.obj</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Extrude: 0.3</span>
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                          Rounded Edges
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="character" className="mt-0">
            <Card className="bg-black/30 backdrop-blur-md border-purple-500/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">Before: PNG Image</h3>
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 h-[400px] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
                      </div>
                      <div className="relative z-10 bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                        <div className="w-32 h-48 mx-auto bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-white rounded-full mb-2"></div>
                          <div className="w-8 h-8 bg-black rounded-full"></div>
                          <div className="w-20 h-6 bg-red-500 rounded-lg mt-4"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/40 text-xs text-gray-400 px-2 py-1 rounded">
                        character.png
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">After: 3D Model</h3>
                    <ModelViewer modelType="character" />
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400">character.obj</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Extrude: 0.5</span>
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                          3D Print Ready
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="icon" className="mt-0">
            <Card className="bg-black/30 backdrop-blur-md border-purple-500/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">Before: PNG Image</h3>
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 h-[400px] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
                      </div>
                      <div className="relative z-10 bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/40 text-xs text-gray-400 px-2 py-1 rounded">
                        icon.png
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">After: 3D Model</h3>
                    <ModelViewer modelType="icon" />
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400">icon.obj</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Extrude: 0.2</span>
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                          Simplicity: 2.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
