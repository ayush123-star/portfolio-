import { readFile, writeFile } from "fs/promises";
import path from "path";

// Sirf local dev (npm run dev) mein chalega. Live/production pe 404.
const FILE = path.join(process.cwd(), "src", "data", "portfolio.json");
const SECTIONS = {
  profile: "object",
  heroWords: "array",
  about: "object",
  whatIDo: "array",
  stack: "array",
  marquee: "array",
  projects: "array",
  activities: "array",
  certificates: "array",
  backgrounds: "object",
  music: "object",
};

// Sirf dev + sirf localhost. Dev server network pe bhi khulta hai, isliye host check zaroori hai.
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];
const devOnly = (request) => {
  const host = (request.headers.get("host") || "").replace(/:\d+$/, "");
  const local =
    process.env.NODE_ENV === "development" && LOCAL_HOSTS.includes(host);
  return local ? null : Response.json({ error: "Not found" }, { status: 404 });
};

export async function GET(request) {
  const blocked = devOnly(request);
  if (blocked) return blocked;
  const data = JSON.parse(await readFile(FILE, "utf8"));
  return Response.json(data);
}

export async function PUT(request) {
  const blocked = devOnly(request);
  if (blocked) return blocked;

  const { section, data } = await request.json();
  const kind = SECTIONS[section];
  if (!kind) {
    return Response.json({ error: "Unknown section" }, { status: 400 });
  }
  const ok =
    kind === "array"
      ? Array.isArray(data)
      : data && typeof data === "object" && !Array.isArray(data);
  if (!ok) {
    return Response.json({ error: "Wrong data shape" }, { status: 400 });
  }

  // Poori file read karke sirf ek section badalna — taaki doosre sections na jaayein
  const current = JSON.parse(await readFile(FILE, "utf8"));
  current[section] = data;
  await writeFile(FILE, JSON.stringify(current, null, 2) + "\n", "utf8");
  return Response.json({ ok: true });
}
