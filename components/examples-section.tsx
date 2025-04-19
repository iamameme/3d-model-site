"use client"

import {  useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Get3DModel } from "./3d-model-2";

function LogoModel() {
  return Get3DModel("/assets/3d/bacon.glb");
}

function CharacterModel() {
  return Get3DModel("/assets/3d/riotstevie.glb");
}

function IconModel() {
  return Get3DModel("/assets/3d/burger.glb");
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
    <section style={{ paddingBottom: '2rem'}} className="">
      <div className="container mx-auto px-4">
        {/* <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Check Out Some Examples
        </h2> */}

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
                3D Text
              </TabsTrigger>
              <TabsTrigger value="icon" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Burger
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="logo" className="mt-0" style={{ maxWidth: 960, margin: '0 auto'}}>
            <Card className="bg-black/30 backdrop-blur-md border-purple-500/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div style={{ maxHeight: 440, display: 'flex', flexDirection: 'column' }}>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">Before: PNG Image</h3>
                    <img style={{ width: '100%', maxWidth: 420, margin: 'auto 0' }} src="/assets/bacon.png" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">After: 3D Model</h3>
                    <ModelViewer modelType="logo" />
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400"></span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Extrude: 0.2</span>
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                          Simplicity: 3.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="character" className="mt-0" style={{ maxWidth: 960, margin: '0 auto'}}>
            <Card className="bg-black/30 backdrop-blur-md border-purple-500/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div style={{ maxHeight: 440, display: 'flex', flexDirection: 'column' }}>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">Before: PNG Image</h3>
                    <img style={{ width: '100%', maxWidth: 420, margin: 'auto 0' }} src="/assets/riotstevie.png" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">After: 3D Model</h3>
                    <ModelViewer modelType="character" />
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400"></span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Extrude: 4.0</span>
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                          Simplicity: 3.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="icon" className="mt-0" style={{ maxWidth: 960, margin: '0 auto'}}>
            <Card className="bg-black/30 backdrop-blur-md border-purple-500/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div style={{ maxHeight: 440, display: 'flex', flexDirection: 'column' }}>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">Before: PNG Image</h3>
                    <img style={{ width: '100%', maxWidth: 420, margin: 'auto 0' }} src="/assets/burger.png" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">After: 3D Model</h3>
                    <ModelViewer modelType="icon" />
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400"></span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Extrude: 0.3</span>
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                          Simplicity: 3.0
                        </span>
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Rounded</span>
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
