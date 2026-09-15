import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The theme lives in a cookie so the server can put the class on <html>
  // directly. A script could not do this: not-found and error boundaries
  // render on the client, where a <script> element is never executed.
  const theme = (await cookies()).get("theme")?.value;
  const themeClass = theme === "dark" ? " dark" : theme === "light" ? " light" : "";

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}${themeClass}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
