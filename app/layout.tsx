import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeScaler Internship Portal",
  description: "Apply for the CodeScaler Internship Program.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
