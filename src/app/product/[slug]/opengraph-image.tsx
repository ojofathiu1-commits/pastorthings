import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/products";
import { formatNaira } from "@/lib/money";
import { ogFonts } from "@/lib/og-fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

const CROSS_PATH =
  "M 53.57,61.14 L 62.91,61.14 C 67.69,58.35 70.15,63.28 71.14,64.14 C 70.15,65.00 67.69,69.93 65.79,69.50 L 62.91,67.14 L 53.57,67.14 L 53.57,78.07 C 55.89,86.15 51.36,90.33 50.57,92.00 C 49.78,90.33 45.25,86.15 45.64,82.94 L 47.57,78.07 L 47.57,67.14 L 38.23,67.14 C 33.45,69.93 30.99,65.00 30.00,64.14 C 30.99,63.28 33.45,58.35 35.35,58.78 L 38.23,61.14 L 47.57,61.14 L 47.57,56.36 C 45.25,52.67 49.78,50.76 50.57,50.00 C 51.36,50.76 55.89,52.67 55.50,54.13 L 53.57,56.36 L 53.57,61.14 Z";

export default async function ProductOGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const image = product?.images[0] ? `${SITE_URL}${product.images[0]}` : null;
  const fonts = await ogFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#000",
          fontFamily: "Noto Sans",
        }}
      >
        <div
          style={{
            width: 480,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#141414",
          }}
        >
          {image ? (
            <img src={image} alt="" width={480} height={630} style={{ objectFit: "cover" }} />
          ) : (
            <svg width="130" height="133" viewBox="28 48 45 46">
              <path d={CROSS_PATH} fill="#555" stroke="#666" strokeWidth="0.6" />
            </svg>
          )}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 56px",
          }}
        >
          <span style={{ fontSize: 22, letterSpacing: 6, color: "#8a8a8a" }}>ILL MEMBER</span>
          <span style={{ fontSize: 52, fontWeight: 700, color: "#f5f5f5", marginTop: 20, maxWidth: 620 }}>
            {product?.name ?? "Shop"}
          </span>
          {product?.price_kobo != null && (
            <span style={{ fontSize: 32, color: "#8a8a8a", marginTop: 20 }}>
              {formatNaira(product.price_kobo)}
            </span>
          )}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
