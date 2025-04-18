// pages/api/download.ts
import path from "path";
import fs from "fs/promises";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("jobId");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }
  const format = id.split("-")[id.split("-").length - 1].toLowerCase();
  let contentType = "application/octet-stream";
  let contentDisposition = `attachment; filename="${id}.obj"`;
  let fileName = `${id}.obj`;
  switch (format) {
    case "gltf":
      contentType = "model/gltf-binary";
      contentDisposition = `inline; filename="${id}.glb"`;
      fileName = `${id}.glb`;
      break;
    case "fbx":
      contentDisposition = `inline; filename="${id}.fbx"`;
      fileName = `${id}.fbx`;
      break;
  }

  const filePath = path.join("/tmp", fileName);

  try {
    const fileBuffer = await fs.readFile(filePath);

    setTimeout(async () => {
      try {
        await fs.unlink(filePath);
        console.log(`Deleted temp file: ${filePath}`);
      } catch (err) {
        console.warn(`Failed to delete temp file: ${filePath}`, err);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response("File not found", { status: 404 });
  }
}
