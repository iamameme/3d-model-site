// pages/api/submit.ts
import { randomUUID } from "crypto";
import { registerWorker, queue } from "../lib/queue";

registerWorker();

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).end();

  const jobId = randomUUID();
  const imageUrl = req.body.imageUrl; // Assume the image is already uploaded

  await queue.add("blender-job", { imageUrl }, { jobId });

  res.status(200).json({ jobId });
}
