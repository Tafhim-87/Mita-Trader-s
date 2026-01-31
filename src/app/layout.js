import "./globals.css";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Providers from "./providers";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Suspense fallback={<LoadingScreen />}>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
