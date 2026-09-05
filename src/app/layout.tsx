import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/CartProvider";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { AddedToCartToast } from "@/components/AddedToCartToast";
import "./globals.css";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";
const DESCRIPTION = "Official store for ILL MEMBER — limited drops, shipped worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ILL MEMBER",
    template: "%s — ILL MEMBER",
  },
  description: DESCRIPTION,
  openGraph: {
    siteName: "ILL MEMBER",
    type: "website",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <StoreHeader />
          <main>{children}</main>
          <StoreFooter />
          <AddedToCartToast />
        </CartProvider>
      </body>
    </html>
  );
}
