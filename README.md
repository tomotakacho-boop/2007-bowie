# 2007 Bowie Move Planner — Measured Furniture Build

This build includes the move checklist, an inch-scaled graph-paper floor planner, a clean floorplan reference without dimension annotations, a room dimensions table, and a room-by-room inspiration gallery with photo uploads stored in Netlify Blobs.

## Interactive layout

Open **Layout → My layout** to use the floor-plan editor. Drag furniture from the inventory onto the plan, or tap an inventory item to add it. Placed pieces are scaled from their measured length and width, snap every 6 inches, and can be moved, rotated, removed, or reset to the starter arrangement.

The measured inventory currently contains:

- TV console — 69 inches long × 18 inches wide
- Coffee table — 39 inches long × 20 inches wide
- Couch — 78 inches long × 39 inches wide
- Kitchen table — 40-inch diameter, with a selectable 10-inch extender that changes it to a 50 × 40-inch oval

The desk nook is shown as a dashed overlay at the kitchen/living boundary instead of as a separate room.

Furniture positions are saved in the current browser. They do not sync between people or devices in this build. The inspiration gallery continues to sync through Netlify Blobs.

## Upload to GitHub

Upload every file and folder in this package to the root of your GitHub repository. Keep the `site` and `netlify/functions` folders exactly as shown.

If you are replacing the previous build, overwrite the repository with the files from this package. The old `.env.example` file is no longer needed.

## Deploy with Netlify

1. Connect the GitHub repository to Netlify, or let the existing Netlify project redeploy after your GitHub update.
2. Netlify will read `netlify.toml`; no build command or environment variable is required.
3. After deployment, open the site and test **Inspiration → Add inspiration** with a small JPEG, PNG, or WebP photo.

## Inspiration rooms

- Living/Dining
- Bedroom
- Kitchen
- Desk Nook
- Bathroom
- WIC
- Terrace

Use **All rooms** to see room sections together, or choose one room to filter the gallery.

## Storage behavior

Inspiration photos and their details are stored in Netlify Blobs, so they sync across devices. Adding and deleting ideas does not require a password or private key.

Friends who open the same live Netlify site can add photos, and those photos will appear for everyone visiting that site. A custom domain and the site's `netlify.app` address also share the gallery when both point to this same Netlify project. A separate copy deployed as a different Netlify project has its own separate gallery.

The checklist is stored in the current browser. Checklist progress will not automatically sync to another device.

Because there is no authentication, anyone who discovers the public site address could add or delete inspiration items. This is intentional for this personal build.
