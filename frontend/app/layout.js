import Providers from "@/components/Providers";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";
 
export const metadata = {
  title: { default: "BlogSphere", template: "%s | BlogSphere" },
  description: "A clean, secure blog platform with role-based access.",
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}