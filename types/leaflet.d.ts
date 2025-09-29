 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/types/leaflet.d.ts
index 0000000000000000000000000000000000000000..80601e6d3893361a9556d22670362c0341e393be 100644
--- a//dev/null
+++ b/types/leaflet.d.ts
@@ -0,0 +1,4 @@
+declare module 'leaflet' {
+  const L: any;
+  export default L;
+}
 
EOF
)
