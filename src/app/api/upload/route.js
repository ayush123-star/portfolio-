import { mkdir, writeFile } from "fs/promises";
import path from "path";

// Certificate / avatar images aur background music ke liye. Sirf local dev mein.
const TYPES = {
  "image/png": { ext: "png", max: 5 },
  "image/jpeg": { ext: "jpg", max: 5 },
  "image/webp": { ext: "webp", max: 5 },
  "image/gif": { ext: "gif", max: 5 },
  "audio/mpeg": { ext: "mp3", max: 20 },
  "audio/ogg": { ext: "ogg", max: 20 },
  "audio/wav": { ext: "wav", max: 20 },
  "audio/x-wav": { ext: "wav", max: 20 },
  "audio/mp4": { ext: "m4a", max: 20 },
  "audio/x-m4a": { ext: "m4a", max: 20 },
};

export async function POST(request) {
  // Sirf dev + sirf localhost (dev server network pe bhi khulta hai)
  const host = (request.headers.get("host") || "").replace(/:\d+$/, "");
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(host);
  if (process.env.NODE_ENV !== "development" || !local) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "No file" }, { status: 400 });
  }
  const type = TYPES[file.type];
  if (!type) {
    return Response.json(
      { error: "Ye file type allowed nahi hai (image: PNG/JPG/WEBP/GIF, music: MP3/OGG/WAV/M4A)" },
      { status: 400 },
    );
  }
  if (file.size > type.max * 1024 * 1024) {
    return Response.json({ error: `${type.max}MB se badi file nahi` }, { status: 400 });
  }

  const base = (file.name || "file")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .slice(0, 40) || "file";
  const name = `${Date.now()}-${base}.${type.ext}`;

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return Response.json({ path: `/uploads/${name}` });
}
