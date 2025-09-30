import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChAPPerone — You don't have to walk alone",
  description: "Volunteer walking companions for safety. Oakland pilot (94610 & 94611)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
