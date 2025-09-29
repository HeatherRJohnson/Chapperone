 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 7db18a6778acb2742d509fad9b9a6cc4426e4159..0d891b40a67fea1978d4f945e28f6f5b2a57ba59 100644
--- a/README.md
+++ b/README.md
@@ -1,21 +1,33 @@
 # ChAPPerone (Next.js + Supabase)
 
 "You don't have to walk alone" — Oakland pilot (94610 & 94611)
 
 ## Quick start
 1. Copy `.env.example` to `.env.local` and fill in Supabase values.
 2. `npm install`
 3. `npm run dev`
 4. Visit http://localhost:3000
 
 ## Deploy (Vercel)
 - Import this repo.
 - Add env vars from `.env.example` to Vercel Project → Settings → Environment.
 - Deploy; you'll get a `https://<project>.vercel.app` URL.
 
+## Update GitHub (no command line required)
+If you are not comfortable with Git, you can still apply these fixes through the GitHub web interface:
+
+1. Sign in at [github.com](https://github.com) and open the repository (`HeatherRJohnson/Chapperone`).
+2. Click the **Code** tab, then press the period (`.`) key to open the web editor (or click the **.`** button).
+3. In the file tree on the left, open each file that changed in this fix: `.gitignore`, `MapPanel.tsx`, `app/page.tsx`, `app/layout.tsx`, `package.json`, `tsconfig.json`, `types/leaflet.d.ts`, and `README.md`.
+4. Replace the file contents with the versions from this commit. The easiest way is to copy/paste from the working files in the pull request diff.
+5. After you finish editing, click **Source Control** (left sidebar), enter a commit message like `Fix Leaflet client build`, and choose **Commit & Push**. This automatically updates the `main` branch.
+6. Return to Vercel and redeploy the project. The build should now succeed.
+
+> Tip: You only need to edit the files listed above. The `.gitignore` addition ensures that `node_modules` and other local files do not get uploaded accidentally.
+
 ## Supabase setup
 Run the SQL in `/supabase/schema.sql` once (Supabase → SQL Editor). Enable Email OTP (Auth → Providers → Email).
 
 ## Notes
 - Desktop-first UI; map-first flow; in-app chat (MVP); volunteer-only.
 - Pilot: pickup must be inside 94610 or 94611; walk time cap 20 minutes.
 
EOF
)