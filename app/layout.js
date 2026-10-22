import "./globals.css";

import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-pt-24">
      <body className="min-h-full flex flex-col bg-[#030303] text-white selection:bg-[#ff7a45]/30 selection:text-white antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
