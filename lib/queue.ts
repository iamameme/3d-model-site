// lib/queue.ts
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

export type GenerateJobData = {
  imageUrl: string;
  format: string;
  extrude: number;
  simplicity: number;
  enclosed: boolean;
  rounded: boolean;
};

export const queue = new Queue("blender", { connection });

export const registerWorker = () => {
  const worker = new Worker(
    "blender",
    async (job) => {
      const { imageUrl, format, extrude, simplicity, enclosed, rounded } =
        job.data as GenerateJobData;

      // Call Blender CLI to process the image
      const { exec } = await import("child_process");
      let blenderCmd = `blender --background --python imageToMeshPlugin.py -- --image ${imageUrl} --extrude ${extrude} --simplicity ${simplicity} --filetype ${format}`;
      if (enclosed) {
        blenderCmd += ` --enclosed`;
      }
      if (rounded) {
        blenderCmd += ` --rounded`;
      }
      return new Promise((resolve, reject) => {
        exec(blenderCmd, (err, stdout, stderr) => {
          if (err) reject(stderr);
          else resolve(stdout);
        });
      });
    },
    { connection }
  );
  return worker;
};
