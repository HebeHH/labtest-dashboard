import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lab Test Dashboard",
  description: "A beautiful dashboard for monitoring your lab test results over time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navigation />
        <main className="pt-6 pb-12">{children}</main>
        <footer className="bg-white border-t border-blue-100 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500">
              Lab Test Dashboard - All your medical data in one place
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
