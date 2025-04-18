// pages/api/submit.ts
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { queue, registerWorker } from "@/lib/queue";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

registerWorker();

export async function POST(request: Request) {
  const body = await request.json();
  const {
    imageData,
    format,
    extrude,
    simplicity,
    enclosed,
    rounded,
    minlength,
  } = body; // Assume the image is already uploaded
  const jobId = randomUUID() + "-" + format;

  const matches = imageData.match(/^data:(.+);base64,(.+)$/);

  if (!matches)
    return NextResponse.json({ error: "Invalid base64 data" }, { status: 400 });

  const [, mimeType, base64String] = matches;
  const buffer = Buffer.from(base64String, "base64");

  const filePath = path.join("/tmp", `${jobId}.png`);
  await fs.writeFile(filePath, buffer);

  await prisma.data.upsert({
    where: { id: "theone" },
    update: {
      counter: {
        increment: 1,
      },
    },
    create: {
      id: "theone",
      counter: 1,
    },
  });

  await queue.add(
    "blender-job",
    {
      imageUrl: filePath,
      format,
      extrude,
      simplicity,
      enclosed,
      rounded,
      minlength,
    },
    { jobId, removeOnComplete: false, removeOnFail: false }
  );

  // Schedule file deletion in 2 minutes
  setTimeout(async () => {
    try {
      await fs.unlink(filePath);
      console.log(`Deleted temp file: ${filePath}`);
    } catch (err) {
      console.warn(`Failed to delete temp file: ${filePath}`, err);
    }
  }, 2 * 60 * 1000); // 2 minutes

  return new Response(JSON.stringify({ jobId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
