import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "وكر الأوغاد", description: "لعبة عصابات استراتيجية" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}