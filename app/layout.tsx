import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/layouts/providers";
import GlobalAlertDialog from "@/components/layouts/global-alert-dialog";
import GlobalToast from "@/components/layouts/global-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | 나도하루",
    default: "나도하루",
  },
  description: "나도하루 소셜 미디어",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <GlobalToast />
          <GlobalAlertDialog />
          {children}
        </body>
      </Providers>
    </html>
  );
}
