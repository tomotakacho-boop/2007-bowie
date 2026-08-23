# 2007 Bowie Move Planner — Key-Free Build

This build includes the move checklist, floorplan views, and a room-by-room inspiration gallery with photo uploads stored in Netlify Blobs.

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

The checklist is stored in the current browser. Checklist progress will not automatically sync to another device.

Because there is no authentication, anyone who discovers the public site address could add or delete inspiration items. This is intentional for this personal build.
