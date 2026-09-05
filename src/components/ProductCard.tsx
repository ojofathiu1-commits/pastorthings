"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChromeCross } from "./BrandMark";
import { useCart } from "./CartProvider";
import { formatNaira } from "@/lib/money";
import { availableUnits } from "@/lib/stock";
import type { Product } from "@/lib/types";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const units = availableUnits(product);
  const soldOut = product.status === "available" && !product.made_to_order && units <= 0;
  const comingSoon = product.status === "coming_soon";
  const image = product.images[0] ?? null;

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceKobo: product.price_kobo ?? 0,
        image,
      },
      1,
    );
  }

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 960px) 25vw, (min-width: 640px) 33vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <ChromeCross className={styles.placeholderMark} />
        )}
        {comingSoon && <span className={`${styles.tag} ${styles.comingSoon}`}>Coming Soon</span>}
        {soldOut && <span className={`${styles.tag} ${styles.soldOut}`}>Sold Out</span>}
      </div>
      <p className={styles.name}>{product.name}</p>
      {product.price_kobo != null && <p className={styles.price}>{formatNaira(product.price_kobo)}</p>}

      {comingSoon ? (
        <button
          type="button"
          className={styles.ctaOutline}
          onClick={(e) => {
            e.preventDefault();
            router.push(`/product/${product.slug}`);
          }}
        >
          Notify Me
        </button>
      ) : (
        <button type="button" className={styles.cta} disabled={soldOut} onClick={handleBuyNow}>
          {soldOut ? "Sold Out" : "Buy Now"}
        </button>
      )}
    </Link>
  );
}
