// pages/api/status.ts
import { queue } from "@/lib/queue";

export default async function handler(req, res) {
  const jobId = req.query.id;
  const job = await queue.getJob(jobId);

  if (!job) return res.status(404).json({ status: "not found" });

  const state = await job.getState();
  res.status(200).json({ status: state });
}
