# 2007 Bowie Move Planner

A self-contained, mobile-friendly move planner with:

- A dated moving checklist
- Progress tracking
- Proposed and clean floorplan views
- A starter design-inspiration board
- Device-local saving for checklist changes and added ideas

## Add to GitHub

1. Create an empty GitHub repository.
2. Upload every file from this folder to the repository root.
3. Commit the files to the main branch.

## Deploy with Netlify

1. In Netlify, choose **Add new project** and **Import an existing project**.
2. Select GitHub and choose this repository.
3. Leave the build command blank.
4. Use `.` as the publish directory if Netlify does not detect it automatically.
5. Choose **Deploy**.

The included `netlify.toml` normally supplies the publish directory automatically.

## Important storage note

This first build saves checklist changes and added ideas in the visitor's browser. Data does not sync between devices and can be lost if browser storage is cleared. A later build can add an account and cloud database for cross-device syncing.

