import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ChatUI from "@/components/ChatUI";


export const metadata: Metadata = {
  title: "Amith R Sulakhe — Full Stack Software Engineer",
  description:
    "Portfolio of Amith R Sulakhe — Full Stack Software Engineer specializing in React, Next.js, Node.js, and AI-powered SaaS platforms.",
  keywords: [
    "Amith R Sulakhe",
    "Full Stack Developer",
    "React",
    "Next.js",
    "Node.js",
    "Software Engineer",
    "Portfolio",
  ],
  authors: [{ name: "Amith R Sulakhe" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>

        <ThemeProvider>
          {children}
          <ChatUI />
        </ThemeProvider>
      </body>
    </html>
  );
}
