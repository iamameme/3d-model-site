// pages/api/download.ts
import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const { id } = req.query;
  const filePath = path.join(process.cwd(), "public/output", `${id}.obj`);

  if (!fs.existsSync(filePath)) return res.status(404).end("Not ready yet");

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename=${id}.obj`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}
