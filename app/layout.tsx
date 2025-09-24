// down-the-line/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Body from "../components/Body"; // Importer Body Client Component

export const metadata: Metadata = {
  title: "Down The Line",
  description: "Football Coaching Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <Body>{children}</Body>
    </html>
  );
}