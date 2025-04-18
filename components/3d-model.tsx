"use client";

import { Environment, OrbitControls, PresentationControls, Stage, Stats, useGLTF } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { FBXLoader } from 'three-stdlib'
import { OBJLoader } from 'three-stdlib'
import { GLTFLoader } from 'three-stdlib'
import * as THREE from 'three'

  
  export function GlbModel({ url, setMesh }: Props) {
    const { scene } = useGLTF(url)
    useEffect(() => {
      const mesh = scene.getObjectByProperty('type', 'Mesh')
      if (mesh) setMesh(mesh)
    }, [scene, setMesh])
    return <primitive object={scene} rotation={[Math.PI / 2, 0, 0]} />
  }
  
  export function ObjModel({ url, setMesh }: Props) {
    const model = useLoader(OBJLoader, url)
    useEffect(() => {
      const mesh = model.getObjectByProperty('type', 'Mesh')
      if (mesh) setMesh(mesh)
    }, [model, setMesh])
    return <primitive object={model} rotation={[Math.PI / 2, 0, 0]} />
  }
  
  export function FbxModel({ url, setMesh }: Props) {
    const model = useLoader(FBXLoader, url)
  
    useEffect(() => {
      const srgbifyColor = (color: THREE.Color) => {
        const copy = color.clone()
        return copy.convertLinearToSRGB()
      }
  
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          const geometry = mesh.geometry
          const material = mesh.material
  
          // 🟩 Vertex color fix
          if (geometry.attributes.color) {
            const colors = geometry.attributes.color.array
            const itemSize = geometry.attributes.color.itemSize || 3
            for (let i = 0; i < colors.length; i += itemSize) {
              const linearColor = new THREE.Color(colors[i], colors[i + 1], colors[i + 2])
              const srgbColor = srgbifyColor(linearColor)
              colors[i] = srgbColor.r
              colors[i + 1] = srgbColor.g
              colors[i + 2] = srgbColor.b
            }
            geometry.attributes.color.needsUpdate = true
          }
  
          // 🟨 Material patch
          const patchMaterial = (mat: THREE.Material) => {
            if (
              mat instanceof THREE.MeshStandardMaterial ||
              mat instanceof THREE.MeshPhongMaterial
            ) {
              if (mat.map) {
                mat.map.colorSpace = THREE.SRGBColorSpace
                mat.map.needsUpdate = true
              }
  
              mat.vertexColors = !!geometry.attributes.color
              mat.flatShading = false
              mat.side = THREE.DoubleSide
              mat.needsUpdate = true
            }
          }
  
          if (Array.isArray(material)) {
            material.forEach(patchMaterial)
          } else {
            patchMaterial(material)
          }
  
          mesh.castShadow = true
          mesh.receiveShadow = true
        }
      })
  
      // Set mesh for stat overlay
      const mesh = model.getObjectByProperty('type', 'Mesh')
      if (mesh) setMesh(mesh)
    }, [model, setMesh])
  
    return <primitive object={model} rotation={[Math.PI / 2, 0, 0]} />
  }

  export function GenericModel({ url, format, setMesh }: Props) {
    const LoaderClass = useMemo(() => {
      if (format === 'glb' || format === 'gltf') return GLTFLoader
      if (format === 'fbx') return FBXLoader
      if (format === 'obj') return OBJLoader
      return GLTFLoader
    }, [format])
  
    const model = useLoader(LoaderClass, url)
  
    useEffect(() => {
      const mesh = model?.scene?.getObjectByProperty?.('type', 'Mesh') || 
                   model?.getObjectByProperty?.('type', 'Mesh')
      if (mesh) setMesh(mesh)
    }, [model, setMesh])
  
    const object = model.scene || model
  
    return <primitive object={object} rotation={[Math.PI / 2, 0, 0]} />
  }
  
type Props = {
    url: string
    format?: string
    setMesh: (mesh: any) => void
  }

  
  export function GetModel({ url, format, setMesh }: Props) {
    return <GenericModel url={url} format={format} setMesh={setMesh} />
  }
  
export default function GetM({ url, format = 'gltf', preview }: { url: string; format: string; preview: boolean }) {
    const [mesh, setMesh] = useState<any>(null);
    const model = GetModel({ url, format, setMesh});
    return (
        <>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
            <color attach="background" args={["#f0f5f1"]} />
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
                <ambientLight intensity={1.0} />
                <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow />
                <meshNormalMaterial attach="material" />
                <OrbitControls autoRotate />
                <Environment preset="city" />
            </Suspense>
            </Canvas>
            <MeshStatsOverlay mesh={mesh} preview={preview} />
            </>
    )
}

type MeshStatsOverlayProps = {
    mesh: any;
    preview: boolean;
  };
  
  export function MeshStatsOverlay({ mesh, preview = false }: MeshStatsOverlayProps) {
    const [vertexCount, setVertexCount] = useState<number | null>(null);
    const [triangleCount, setTriangleCount] = useState<number | null>(null);
  
    useEffect(() => {
      if (!mesh || !mesh.geometry) {
        setVertexCount(null);
        setTriangleCount(null);
        return;
      }
  
      const geometry = mesh.geometry;
      const position = geometry.attributes.position;
      const vCount = position.count;
  
      const tCount = geometry.index
        ? geometry.index.count / 3
        : vCount / 3;
  
      setVertexCount(vCount);
      setTriangleCount(tCount);
    }, [mesh]);
  
    if (vertexCount === null || triangleCount === null) return null;
    let top = 75;
    let right = 30;
    if (preview) {
        top = 10;
        right = 10;
    }
  
    return (
      <div
        style={{
          position: 'absolute',
          top,
          right,
          padding: '10px',
          background: 'rgba(0,0,0,0.6)',
          color: '#0f0',
          fontFamily: 'monospace',
          fontSize: '12px',
          zIndex: 1000,
        }}
      >
        <b>Mesh Stats</b><br />
        Vertices: {vertexCount}<br />
        Triangles: {triangleCount}
      </div>
    );
  }