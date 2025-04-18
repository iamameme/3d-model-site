// scripts/bullboard.ts
import express from "express";
import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { queue } from "../lib/queue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/");

createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter,
});

const app = express();
app.use("/", serverAdapter.getRouter());

app.listen(3004, () => {
  console.log("🚀 Bull Board running at http://localhost:3001/admin/queues");
});
