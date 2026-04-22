import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionWrapper } from "@/components/providers/SessionWrapper";
import { LayoutWrapper } from "@/components/providers/LayoutWrapper";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrowIn",
  description: "Plateform to connect investors with startups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${montserrat.variable} antialiased`}
      >
        <SessionWrapper>
          <LayoutWrapper>
            <Toaster position="top-right" />
            {children}
          </LayoutWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
