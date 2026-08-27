import { getStore } from "@netlify/blobs";

const BOARD_WIDTH_INCHES = 373;
const BOARD_HEIGHT_INCHES = BOARD_WIDTH_INCHES * 1382 / 1136;
const MAX_ITEMS = 200;
const MAX_LAYOUTS = 100;
const MAX_CATALOG_ITEMS = 100;
const INDEX_KEY = "layouts-index";

const DEFAULT_CATALOG = {
  tvconsole: { name: "TV console", length: 69, width: 18 },
  coffee: { name: "Coffee table", length: 39, width: 20 },
  couch: { name: "Couch", length: 78, width: 39 },
  desk: { name: "Desk", length: 40, width: 28 },
  kitchenTable: { name: "Kitchen table", length: 40, width: 40, round: true, extendable: true, extension: 10 },
  kitchenChair: { name: "Kitchen table chair", length: 18, width: 18, quantity: 4 },
  barCart: { name: "Glass bar cart", length: 22, width: 8 },
  marbleTable: { name: "Small marble round table", length: 17.5, width: 17.5, round: true },
  litterRobot: { name: "Litter Robot", length: 22, width: 22 },
  bookshelf: { name: "Bookshelf", length: 30, width: 12 },
  bed: { name: "Bed", length: 62, width: 88 },
  nightstand: { name: "Nightstand", length: 15, width: 16 },
  cubeShelf: {
    name: "8-cube wooden shelf",
    length: 38,
    width: 15.5,
    footprints: [
      { length: 38, width: 15.5, name: "upright" },
      { length: 30, width: 15.5, name: "on its side" },
      { length: 38, width: 30, name: "laid flat" },
    ],
  },
  outdoorChair: { name: "Outdoor chair", length: 30, width: 40 },
  storageBox: { name: "Storage box", length: 25, width: 20 },
};

const STARTER_FURNITURE = [
  { id: "starter-tv-console", type: "tvconsole", x: 176, y: 236, rotated: true },
  { id: "starter-coffee", type: "coffee", x: 270, y: 245, rotated: true },
  { id: "starter-couch", type: "couch", x: 318, y: 230, rotated: true },
  { id: "starter-kitchen-table", type: "kitchenTable", x: 244, y: 188, rotated: false },
];

function json(value, status = 200) {
  return Response.json(value, { status, headers: { "cache-control": "no-store" } });
}

function cleanText(value, maximum = 80) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, maximum);
}

function clampNumber(value, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number)) return minimum;
  return Math.min(maximum, Math.max(minimum, number));
}

function validLayoutId(value) {
  return /^(main|[a-f0-9-]{36})$/.test(String(value || ""));
}

function validCatalogId(value) {
  return /^[A-Za-z0-9_-]{1,80}$/.test(String(value || ""));
}

function furnitureDescription(definition) {
  if (definition.extendable) return `${definition.length}″ diameter · extends to ${definition.length + definition.extension}″ × ${definition.width}″`;
  if (definition.round) return `${definition.length}″ diameter`;
  if (definition.footprints?.length) return `${definition.length}″ L × ${definition.width}″ W · ${definition.footprints.length} orientations`;
  return `${definition.length}″ L × ${definition.width}″ W`;
}

function cleanFootprints(value) {
  if (!Array.isArray(value)) return undefined;
  const footprints = value.slice(0, 6).map((item, index) => ({
    length: clampNumber(item?.length, 1, 300),
    width: clampNumber(item?.width, 1, 300),
    name: cleanText(item?.name, 40) || `orientation ${index + 1}`,
  }));
  return footprints.length ? footprints : undefined;
}

function cleanCatalog(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value);
  if (!entries.length || entries.length > MAX_CATALOG_ITEMS) return null;
  const catalog = {};
  for (const [id, item] of entries) {
    if (!validCatalogId(id) || !item || typeof item !== "object") continue;
    const definition = {
      name: cleanText(item.name) || "Furniture",
      length: clampNumber(item.length, 1, 300),
      width: clampNumber(item.width, 1, 300),
    };
    if (item.round) definition.round = true;
    if (item.extendable) {
      definition.extendable = true;
      definition.extension = clampNumber(item.extension || 10, 1, 120);
    }
    if (Number.isFinite(Number(item.quantity))) definition.quantity = Math.round(clampNumber(item.quantity, 1, 50));
    const footprints = cleanFootprints(item.footprints);
    if (footprints) definition.footprints = footprints;
    definition.description = furnitureDescription(definition);
    catalog[id] = definition;
  }
  return Object.keys(catalog).length ? catalog : null;
}

function catalogWithDescriptions(catalog = DEFAULT_CATALOG) {
  return Object.fromEntries(Object.entries(catalog).map(([id, item]) => [id, {
    ...item,
    description: furnitureDescription({ extension: 10, ...item }),
  }]));
}

function cleanFurniture(items, catalog) {
  if (!Array.isArray(items)) return null;
  const seenIds = new Set();
  return items.slice(0, MAX_ITEMS).flatMap((item) => {
    if (!item || typeof item !== "object" || !catalog[item.type]) return [];
    let id = cleanText(item.id, 100) || crypto.randomUUID();
    if (seenIds.has(id)) id = crypto.randomUUID();
    seenIds.add(id);
    const definition = catalog[item.type];
    const orientationMaximum = Math.max(0, (definition.footprints?.length || 1) - 1);
    return [{
      id,
      type: item.type,
      x: clampNumber(item.x, 0, BOARD_WIDTH_INCHES),
      y: clampNumber(item.y, 0, BOARD_HEIGHT_INCHES),
      rotated: Boolean(item.rotated),
      orientation: Math.round(clampNumber(item.orientation, 0, orientationMaximum)),
      extended: Boolean(definition.extendable && item.extended),
    }];
  });
}

async function ensureIndex(store) {
  const existing = await store.get(INDEX_KEY, { type: "json", consistency: "strong" });
  if (Array.isArray(existing) && existing.length) return existing;

  const now = new Date().toISOString();
  const catalog = catalogWithDescriptions();
  const legacy = await store.get("current", { type: "json", consistency: "strong" });
  const items = cleanFurniture(legacy?.items || STARTER_FURNITURE, catalog) || [];
  const mainLayout = {
    id: "main",
    name: "Tomo's layout",
    version: 2,
    catalog,
    items,
    createdAt: now,
    updatedAt: legacy?.updatedAt || now,
  };
  const index = [{ id: mainLayout.id, name: mainLayout.name, createdAt: now, updatedAt: mainLayout.updatedAt }];
  await Promise.all([
    store.setJSON("layout-main", mainLayout),
    store.setJSON(INDEX_KEY, index),
  ]);
  return index;
}

function layoutKey(id) {
  return `layout-${id}`;
}

export default async function handler(request) {
  const store = getStore("shared-floor-layout");
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (request.method === "GET") {
    const layouts = await ensureIndex(store);
    if (!id) return json({ layouts });
    if (!validLayoutId(id)) return json({ error: "That layout link is invalid." }, 400);
    const layout = await store.get(layoutKey(id), { type: "json", consistency: "strong" });
    return layout ? json({ layout }) : json({ error: "That layout was not found." }, 404);
  }

  if (request.method === "POST") {
    let body;
    try { body = await request.json(); }
    catch { return json({ error: "The new layout could not be read." }, 400); }
    const layouts = await ensureIndex(store);
    if (layouts.length >= MAX_LAYOUTS) return json({ error: `This site can contain up to ${MAX_LAYOUTS} layouts.` }, 413);
    const now = new Date().toISOString();
    const layout = {
      id: crypto.randomUUID(),
      name: cleanText(body?.name) || "Untitled layout",
      version: 2,
      catalog: catalogWithDescriptions(),
      items: [],
      createdAt: now,
      updatedAt: now,
    };
    const nextIndex = [...layouts, { id: layout.id, name: layout.name, createdAt: now, updatedAt: now }];
    await Promise.all([store.setJSON(layoutKey(layout.id), layout), store.setJSON(INDEX_KEY, nextIndex)]);
    return json({ layout, layouts: nextIndex }, 201);
  }

  if (request.method === "PUT") {
    if (!validLayoutId(id)) return json({ error: "A valid layout id is required." }, 400);
    let body;
    try { body = await request.json(); }
    catch { return json({ error: "The layout update could not be read." }, 400); }
    if (!Array.isArray(body?.items)) return json({ error: "The furniture list is required." }, 400);
    if (body.items.length > MAX_ITEMS) return json({ error: `A layout can contain up to ${MAX_ITEMS} pieces.` }, 413);
    const catalog = cleanCatalog(body.catalog);
    if (!catalog) return json({ error: "A valid furniture inventory is required." }, 400);
    const layouts = await ensureIndex(store);
    const existing = await store.get(layoutKey(id), { type: "json", consistency: "strong" });
    if (!existing) return json({ error: "That layout was not found." }, 404);
    const updatedAt = new Date().toISOString();
    const layout = {
      ...existing,
      id,
      name: cleanText(body.name) || existing.name || "Untitled layout",
      version: 2,
      catalog,
      items: cleanFurniture(body.items, catalog) || [],
      updatedAt,
    };
    const nextIndex = layouts.map((entry) => entry.id === id
      ? { ...entry, name: layout.name, updatedAt }
      : entry);
    await Promise.all([store.setJSON(layoutKey(id), layout), store.setJSON(INDEX_KEY, nextIndex)]);
    return json({ layout, layouts: nextIndex });
  }

  return json({ error: "Method not allowed." }, 405);
}
