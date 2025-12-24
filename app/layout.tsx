import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionWrapper } from "@/components/providers/SessionWrapper";
import Header from '@/components/landingpage/Header';
import Footer from "@/components/landingpage/Footer";

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
          <Header />
          <Toaster position="top-right" />
          {children}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
