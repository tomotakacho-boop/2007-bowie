import { getStore } from "@netlify/blobs";

const ROOMS = new Set([
  "Living/Dining",
  "Bedroom",
  "Kitchen",
  "Desk Nook",
  "Bathroom",
  "WIC",
  "Terrace",
]);

const STATUSES = new Set(["Idea", "Considering", "Purchased", "Rejected"]);
const IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function json(value, status = 200) {
  return Response.json(value, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function cleanText(value, maximum) {
  return String(value || "").trim().slice(0, maximum);
}

function cleanUrl(value) {
  const text = cleanText(value, 1500);
  if (!text) return "";
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

async function getItems(store) {
  return (await store.get("items", { type: "json", consistency: "strong" })) || [];
}

function withImageUrl(item) {
  return {
    ...item,
    imageUrl: `/.netlify/functions/inspiration?image=${encodeURIComponent(item.imageKey)}`,
  };
}

function imageContentType(key) {
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export default async function handler(request) {
  const url = new URL(request.url);
  const metadata = getStore("inspiration-items");
  const images = getStore("inspiration-images");

  if (request.method === "GET" && url.searchParams.has("image")) {
    const key = url.searchParams.get("image") || "";
    if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(key)) {
      return new Response("Invalid image", { status: 400 });
    }
    const image = await images.get(key, { type: "blob" });
    if (!image) return new Response("Image not found", { status: 404 });
    return new Response(image, {
      headers: {
        "content-type": imageContentType(key),
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff",
      },
    });
  }

  if (request.method === "GET") {
    const items = await getItems(metadata);
    return json({ items: items.map(withImageUrl) });
  }

  if (request.method === "POST") {
    let form;
    try {
      form = await request.formData();
    } catch {
      return json({ error: "The upload could not be read." }, 400);
    }

    const image = form.get("image");
    const title = cleanText(form.get("title"), 100);
    const room = cleanText(form.get("room"), 40);
    const status = cleanText(form.get("status"), 30) || "Idea";
    if (!image || typeof image.arrayBuffer !== "function") return json({ error: "Choose a photo." }, 400);
    if (!IMAGE_TYPES.has(image.type)) return json({ error: "Use a JPEG, PNG, or WebP image." }, 400);
    if (image.size > 5 * 1024 * 1024) return json({ error: "The uploaded image must be under 5 MB." }, 413);
    if (!title) return json({ error: "Add an idea title." }, 400);
    if (!ROOMS.has(room)) return json({ error: "Choose a valid room." }, 400);
    if (!STATUSES.has(status)) return json({ error: "Choose a valid status." }, 400);

    const id = crypto.randomUUID();
    const imageKey = `${id}.${IMAGE_TYPES.get(image.type)}`;
    await images.set(imageKey, await image.arrayBuffer(), {
      metadata: { contentType: image.type, originalName: cleanText(image.name, 200) },
    });

    const item = {
      id,
      imageKey,
      title,
      room,
      status,
      notes: cleanText(form.get("notes"), 500),
      sourceUrl: cleanUrl(form.get("sourceUrl")),
      productUrl: cleanUrl(form.get("productUrl")),
      createdAt: new Date().toISOString(),
    };

    const items = await getItems(metadata);
    items.unshift(item);
    await metadata.setJSON("items", items.slice(0, 500));
    return json({ item: withImageUrl(item) }, 201);
  }

  if (request.method === "DELETE") {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "The delete request could not be read." }, 400);
    }
    const id = cleanText(body.id, 50);
    const items = await getItems(metadata);
    const item = items.find((entry) => entry.id === id);
    if (!item) return json({ error: "Idea not found." }, 404);
    await images.delete(item.imageKey);
    await metadata.setJSON("items", items.filter((entry) => entry.id !== id));
    return json({ deleted: true });
  }

  return json({ error: "Method not allowed." }, 405);
}
