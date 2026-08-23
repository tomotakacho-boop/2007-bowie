# 2007 Bowie Move Planner - Build 2

This version adds room-based inspiration filters and cross-device photo uploads using Netlify Blobs.

## Upload to GitHub

Upload every file and folder in this package to the root of your GitHub repository. Preserve the `site` and `netlify/functions` folders exactly as shown.

## Connect to Netlify

1. Import the GitHub repository into Netlify.
2. Netlify will read `netlify.toml`; no build command is required.
3. Open **Project configuration**, then **Environment variables**.
4. Add a variable named `INSPIRATION_ADMIN_KEY`.
5. Set its value to a long private passphrase that only you know.
6. Redeploy the site after adding the environment variable.

Use that same passphrase in the site's **Private upload key** field whenever you upload or delete an inspiration item. The passphrase is checked by the server and is not included in the website files.

## Inspiration rooms

- Living/Dining
- Bedroom
- Kitchen
- Desk Nook
- Bathroom
- WIC
- Terrace

When **All rooms** is selected, ideas are grouped into room sections. Selecting a room shows only that room.

## Storage and privacy

Photos and inspiration metadata are stored in Netlify Blobs and sync across devices. The gallery is publicly viewable because the website is public. Uploads and deletions require `INSPIRATION_ADMIN_KEY`.

The move checklist still uses browser storage and therefore remains specific to each browser/device in this build.
