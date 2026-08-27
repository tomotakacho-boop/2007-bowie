import { getStore } from "@netlify/blobs";

const BOARD_WIDTH_INCHES = 373;
const BOARD_HEIGHT_INCHES = BOARD_WIDTH_INCHES * 1382 / 1136;
const MAX_ITEMS = 200;
const FURNITURE_TYPES = new Set([
  "tvconsole",
  "coffee",
  "couch",
  "desk",
  "kitchenTable",
  "kitchenChair",
  "barCart",
  "marbleTable",
  "litterRobot",
  "bookshelf",
  "bed",
  "nightstand",
  "cubeShelf",
  "outdoorChair",
  "storageBox",
]);

function json(value, status = 200) {
  return Response.json(value, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function cleanId(value) {
  return String(value || "").trim().slice(0, 100);
}

function clampNumber(value, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number)) return minimum;
  return Math.min(maximum, Math.max(minimum, number));
}

function cleanFurniture(items) {
  if (!Array.isArray(items)) return null;
  const seenIds = new Set();
  return items.slice(0, MAX_ITEMS).flatMap((item) => {
    if (!item || typeof item !== "object" || !FURNITURE_TYPES.has(item.type)) return [];
    let id = cleanId(item.id) || crypto.randomUUID();
    if (seenIds.has(id)) id = crypto.randomUUID();
    seenIds.add(id);
    const orientationMaximum = item.type === "cubeShelf" ? 2 : 0;
    return [{
      id,
      type: item.type,
      x: clampNumber(item.x, 0, BOARD_WIDTH_INCHES),
      y: clampNumber(item.y, 0, BOARD_HEIGHT_INCHES),
      rotated: Boolean(item.rotated),
      orientation: Math.round(clampNumber(item.orientation, 0, orientationMaximum)),
      extended: item.type === "kitchenTable" && Boolean(item.extended),
    }];
  });
}

export default async function handler(request) {
  const store = getStore("shared-floor-layout");

  if (request.method === "GET") {
    const layout = await store.get("current", { type: "json", consistency: "strong" });
    return json({ layout: layout || null });
  }

  if (request.method === "PUT") {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "The layout update could not be read." }, 400);
    }

    if (!Array.isArray(body?.items)) return json({ error: "The furniture list is required." }, 400);
    if (body.items.length > MAX_ITEMS) return json({ error: `A layout can contain up to ${MAX_ITEMS} pieces.` }, 413);

    const items = cleanFurniture(body.items);
    const layout = {
      version: 1,
      items,
      updatedAt: new Date().toISOString(),
    };
    await store.setJSON("current", layout);
    return json({ layout });
  }

  return json({ error: "Method not allowed." }, 405);
}
