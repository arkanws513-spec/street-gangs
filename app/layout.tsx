import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "وكر الأوغاد",
  description: "لعبة عصابات استراتيجية",
  manifest: "/manifest.webmanifest",
  themeColor: "#080a0f",
  appleWebApp: {
    capable: true,
    title: "وكر الأوغاد",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}