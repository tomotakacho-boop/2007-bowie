# 2007 Bowie Move Planner — Shared Layouts Build

This build includes the move checklist, an inch-scaled graph-paper floor planner traced directly from the clean 2007 Bowie blueprint, a room dimensions table, and a room-by-room inspiration gallery with photo uploads stored in Netlify Blobs.

## Mover guide

The new **Mover guide** tab condenses Ace Relocation Systems’ move instructions into four easy-access sections:

- Tasks to finish the night before and on move day
- Household goods that cannot go on the truck
- Valuable and sentimental items Ace recommends carrying yourself
- Delivery, storage, unpacking, and claims reminders

Every actionable item has a checkbox, and the checked state is retained in the current browser. The page visibly cites and links to [Ace Relocation Systems — Important Information For Your Move](https://kb.acerelocation.com/important-information-for-your-move), accessed August 26, 2026.

The inspiration form is now compact and has no HTML required markers. Idea titles and links are optional. Source and product fields accept either full URLs or plain domains such as `thecontainerstore.com`; common placeholders such as `n/a` are treated as blank. A photo is still needed to create a photo-based inspiration entry, and the form displays a friendly message if none is selected.

Every inspiration card now includes **Edit idea**. Editing reuses the compact form and supports title, room, status, source link, product link, and notes changes. The existing photo stays in place unless a replacement photo is selected.

## Interactive layout

Open **Layout → My layout** to use the floor-plan editor. Drag furniture from the inventory onto the plan, or tap an inventory item to add it. Placed pieces are scaled from their measured length and width, snap every 6 inches, and can be moved, rotated, removed, or reset to the starter arrangement.

The measured inventory currently contains:

- TV console — 69 inches long × 18 inches wide
- Coffee table — 39 inches long × 20 inches wide
- Couch — 78 inches long × 39 inches wide
- Desk — 40 inches long × 28 inches wide
- Kitchen table — 40-inch diameter, with a selectable 10-inch extender that changes it to a 50 × 40-inch oval
- Kitchen table chairs — four chairs, each 18 × 18 inches
- Glass bar cart — 22 × 8 inches
- Small marble round table — 17.5-inch diameter
- Litter Robot — 22 × 22 inches
- Bookshelf — 30 × 12 inches
- Bed — 62 × 88 inches
- Nightstand — 15 × 16 inches
- 8-cube wooden shelf — 15.5 × 38 × 30 inches
- Outdoor chair — 30 × 40 inches
- Storage box — 25 × 20 inches

The 8-cube shelf has three true-to-scale top-down footprints: upright (38 × 15.5), on its side (30 × 15.5), and laid flat (38 × 30). Select it on the plan and use **Set shelf…** to cycle through those orientations; **Rotate** still turns the current footprint 90 degrees.

The desk nook is shown in its actual built-in position at the kitchen/living boundary instead of as a separate room.

The blueprint is now the locked base layer of the interactive editor. This preserves the original wall locations and thicknesses, terrace recess, doors, closet shelving and shoe storage, bathroom fixtures, kitchen counters, entry door, WH/HP closet, washer/dryer closet, desk nook, and terrace door. Furniture remains interactive above the blueprint and graph grid.

Furniture positions and the furniture inventory now autosave to Netlify Blobs after every addition, move, rotation, dimension edit, orientation change, table extension, removal, or reset. The layout editor does not use browser storage as a fallback.

### Shared layouts and furniture

Use the **Cloud layout** menu to switch between public plans. **New layout** creates an independent blank plan with its own furniture inventory. **Copy share link** creates a direct URL to the selected layout so friends can open and edit it.

Use **+ New** in the Furniture inventory to save custom furniture. Choose **Rectangle** to enter length and width, or **Circle** to enter a single diameter; circular furniture renders as a true circle on the plan. To adjust an existing inventory item, select one of its placed copies and choose **Edit dimensions**. The updated dimensions and shape apply to every copy of that item in the current layout and save to Netlify automatically.

The furniture form uses a single compact column inside the inventory sidebar, so every control remains visible. Navigation tabs, inspiration-room filters, layout controls, and action buttons wrap onto additional lines when needed. The page itself is the only scroll container; no toolbar, filter row, form, or sidebar requires horizontal or nested scrolling.

On the first request after deployment, the function automatically migrates the previous Netlify-saved shared arrangement into **Tomo's layout**. No special browser, device, manual copy, secret key, or environment variable is needed to preserve it.

## Upload to GitHub

Upload every file and folder in this package to the root of your GitHub repository. Keep the `site` and `netlify/functions` folders exactly as shown.

If you are replacing the previous build, overwrite the repository with the files from this package. The old `.env.example` file is no longer needed.

## Deploy with Netlify

1. Connect the GitHub repository to Netlify, or let the existing Netlify project redeploy after your GitHub update.
2. Netlify will read `netlify.toml`; no build command or environment variable is required.
3. After deployment, open **Layout** and confirm **Tomo's layout** appears. Create a temporary layout, add custom furniture, and copy its share link to confirm cloud storage is active.

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

Inspiration photos, inspiration details, every interactive furniture layout, and each layout's furniture inventory are stored in Netlify Blobs, so they sync across devices. Adding, editing, or rearranging content does not require a password, private key, or browser storage.

Friends who open the same live Netlify site can create their own layouts, add custom furniture, and edit any layout whose link they have. Each layout has a stable `?layout=...` URL. Returning to the tab checks Netlify for newer changes. A custom domain and the site's `netlify.app` address share the same server data when both point to this Netlify project. A separately deployed Netlify project has its own data.

The checklist is stored in the current browser. Checklist progress will not automatically sync to another device.

Because there is no authentication, anyone who discovers the public site address can view or change cloud layouts, create additional layouts and furniture, or add, edit, and delete inspiration items. This is intentional for this personal build.
