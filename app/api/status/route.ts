// pages/api/status.ts
import { queue } from "@/lib/queue";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const jobId = searchParams.get("jobId");
  const job = await queue.getJob(jobId);

  if (!job) {
    return new Response("", {
      status: 404,
    });
  }
  const state = await job.getState();
  return new Response(JSON.stringify({ status: state }), {
    headers: { "Content-Type": "application/json" },
  });
}
