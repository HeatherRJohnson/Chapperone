 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/app/layout.tsx b/app/layout.tsx
index c90cf21932c5cdf395844bc1dbc4e82db752b3e0..2292f6ddc2efdd7a6c133e029d728b937bb12dce 100644
--- a/app/layout.tsx
+++ b/app/layout.tsx
@@ -1,7 +1,9 @@
-export default function RootLayout({ children }) {
+import type { ReactNode } from 'react';
+
+export default function RootLayout({ children }: { children: ReactNode }) {
   return (
     <html lang="en">
       <body style={{margin:0}}>{children}</body>
     </html>
   );
 }
 
EOF
)