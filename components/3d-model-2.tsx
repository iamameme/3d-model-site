// components/3d-model.tsx
import dynamic from "next/dynamic";
import React from "react";

const ModelCanvas = dynamic(() => import("./3d-model"), { ssr: false });

export function Get3DModel(url: string, format = 'gltf', preview = false) {
  return <ModelCanvas url={url} format={format} preview={preview} />;
}