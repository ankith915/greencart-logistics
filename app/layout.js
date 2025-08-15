// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GreenCart Logistics",
  description: "Delivery Simulation & KPI Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-800`}>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="max-w-7xl w-full mx-auto p-6">{children}</main>
          <footer className="text-center py-6 text-sm text-slate-500">
            © {new Date().getFullYear()} GreenCart Logistics — Built with ❤️
          </footer>
        </div>
      </body>
    </html>
  );
}
