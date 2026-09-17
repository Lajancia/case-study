import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
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
  // next-themes settles the theme from localStorage in an inline script that
  // runs before first paint. Under this site's CSP that script only executes if
  // it carries the request's nonce, which proxy.ts puts on the request as
  // x-nonce. Without it the page would paint light and then correct itself.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    // suppressHydrationWarning: the inline script adds the theme class to this
    // element before React hydrates, so the server's markup is expected to
    // differ here and only here.
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        {/* attribute="class" to match the `dark` variant globals.css declares.
            The stylesheet has no .light rule — light is the :root default — so
            the class next-themes adds for it is simply inert. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          nonce={nonce}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
