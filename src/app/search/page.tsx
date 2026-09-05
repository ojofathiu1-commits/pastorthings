import { ProductCard } from "@/components/ProductCard";
import { searchProducts } from "@/lib/products";
import shopStyles from "../page.module.css";

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const results = q ? await searchProducts(q) : [];

  return (
    <section className={shopStyles.section}>
      <h1 className={shopStyles.sectionTitle}>{q ? `Results for “${q}”` : "Search"}</h1>
      {q && results.length === 0 && <p className={shopStyles.empty}>No products matched.</p>}
      {results.length > 0 && (
        <div className={shopStyles.grid}>
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
