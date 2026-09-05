import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductActions } from "@/components/ProductActions";
import { ProductGallery } from "@/components/ProductGallery";
import { formatNaira } from "@/lib/money";
import { getProductBySlug } from "@/lib/products";
import { availableUnits } from "@/lib/stock";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const units = availableUnits(product);
  const lowStock = product.status === "available" && units > 0 && units <= product.initial_stock * 0.15;

  return (
    <div className={styles.wrap}>
      <ProductGallery images={product.images} name={product.name} />

      <div className={styles.info}>
        <h1 className={styles.name}>{product.name}</h1>

        {product.price_kobo != null && <p className={styles.price}>{formatNaira(product.price_kobo)}</p>}

        {!product.made_to_order && product.status === "available" && (
          <p className={`${styles.stockLine} ${lowStock ? styles.low : ""}`}>
            {units > 0
              ? `${units} of ${product.initial_stock} left`
              : "Sold out"}
          </p>
        )}

        {product.description && <p className={styles.description}>{product.description}</p>}

        <ProductActions product={product} availableUnits={units} />
      </div>
    </div>
  );
}
