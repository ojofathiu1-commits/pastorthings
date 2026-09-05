import { ArtistAbout } from "@/components/ArtistAbout";
import { Hero } from "@/components/Hero";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ProductCard } from "@/components/ProductCard";
import { getShopProducts } from "@/lib/products";
import styles from "./page.module.css";

export default async function ShopPage() {
  const { available, comingSoon } = await getShopProducts();

  return (
    <>
      <Hero />

      <section id="available-now" className={styles.section}>
        <h1 className={styles.sectionTitle}>Available Now</h1>
        {available.length === 0 ? (
          <p className={styles.empty}>Nothing in stock right now — check Coming Soon below.</p>
        ) : (
          <div className={styles.grid}>
            {available.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <hr className={styles.divider} />

      <section id="coming-soon" className={styles.section}>
        <h2 className={styles.sectionTitle}>Coming Soon</h2>
        <p className={styles.sectionSubtitle}>Get notified the moment these drop.</p>
        {comingSoon.length === 0 ? (
          <p className={styles.empty}>Nothing announced yet.</p>
        ) : (
          <div className={styles.grid}>
            {comingSoon.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <ArtistAbout />

      <NewsletterSignup />
    </>
  );
}
