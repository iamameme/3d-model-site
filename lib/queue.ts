// lib/queue.ts
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const connection = new IORedis(process.env.REDIS_URL || "redis://redis:6379", {
  maxRetriesPerRequest: null,
});

export type GenerateJobData = {
  imageUrl: string;
  format: string;
  extrude: number;
  simplicity: number;
  enclosed: boolean;
  rounded: boolean;
  minlength: number;
};

export const queue = new Queue("blender-job", { connection });

export const registerWorker = () => {
  const worker = new Worker<GenerateJobData>(
    "blender-job",
    async (job) => {
      const {
        imageUrl,
        format,
        extrude,
        simplicity,
        enclosed,
        rounded,
        minlength,
      } = job.data;

      let blenderCmd = `blender --background --python ./imageToMeshPlugin.py -- --image "${imageUrl}" --extrude ${extrude} --simplicity ${simplicity} --filetype ${format} --minlength ${minlength}`;
      if (enclosed) blenderCmd += ` --enclosed`;
      if (rounded) blenderCmd += ` --rounded`;

      console.log("🌀 Executing:", blenderCmd);

      try {
        const { stdout, stderr } = await execAsync(blenderCmd, {
          maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        });

        if (stderr) {
          console.warn(`⚠️ Blender stderr: ${stderr}`);
        }

        console.log(`✅ Blender output: ${stdout}`);
        return stdout;
      } catch (err) {
        console.error("❌ Blender failed:", err);
        throw err;
      }
    },
    {
      connection,
      concurrency: 1, // optional: for testing
    }
  );

  worker.on("active", (job) => console.log(`🚧 Started job ${job.id}`));
  worker.on("completed", (job) => console.log(`✅ Completed job ${job.id}`));
  worker.on("failed", (job, err) =>
    console.error(`❌ Failed job ${job?.id}`, err)
  );

  return worker;
};
