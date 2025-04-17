import { Environment, OrbitControls, PresentationControls, Stage, Stats, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'

function GetModel({
    url,
    setMesh,
  }: {
    url: string,
    setMesh: (mesh: any) => void;
  }) {
  const { scene } = useGLTF(url || "/assets/3d/bacon.glb")

  useEffect(() => {
    // Find the first mesh in the GLTF scene
    const firstMesh = scene.getObjectByProperty('type', 'Mesh');
    if (firstMesh) setMesh(firstMesh);
  }, [scene, setMesh]);

  return <primitive object={scene} rotation={[Math.PI / 2, 0, 0]} />
}

export function Get3DModel(url) {
    const [mesh, setMesh] = useState<any>(null);
    const model = GetModel({ url, setMesh});
    return (
        <>
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
            <MeshStatsOverlay mesh={mesh} />
            </>
    )
}

type MeshStatsOverlayProps = {
    mesh: any;
  };
  
  export function MeshStatsOverlay({ mesh }: MeshStatsOverlayProps) {
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
  
    return (
      <div
        style={{
          position: 'absolute',
          top: 75,
          right: 30,
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