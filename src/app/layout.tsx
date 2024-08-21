import React from "react";
import { Roboto } from "next/font/google";
import "./globals.css";
import ClientWrapper from '@/components/ClientWrapper';

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
  title: "Summarist",
  description: "The Ultimate Reading App",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${roboto.className} bg-white text-gray-900`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
};

export default RootLayout;