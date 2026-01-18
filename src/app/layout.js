import "./globals.css";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
