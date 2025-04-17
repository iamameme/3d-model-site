import { Environment, OrbitControls, PresentationControls, Stage, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

function GetModel(url) {
  const { scene } = useGLTF(url || "/assets/3d/bacon.glb")
  return <primitive object={scene} rotation={[Math.PI / 2, 0, 0]} />
}

export function Get3DModel(url) {
    const model = GetModel(url);
    return (
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
            <color attach="background" args={["#AAAAAA"]} />
            <Suspense fallback={null}>
                <PresentationControls
                global
                zoom={0.8}
                rotation={[0, -Math.PI / 4, 0]}
                polar={[0, Math.PI / 4]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                <Stage environment="sunset" intensity={0.5} contactShadow shadows>
                    {model}
                </Stage>
                </PresentationControls>
                <OrbitControls autoRotate />
                <Environment preset="city" />
            </Suspense>
            </Canvas>
    )
}