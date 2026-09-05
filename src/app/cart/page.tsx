"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatNaira } from "@/lib/money";
import styles from "./page.module.css";

export default function CartPage() {
  const { items, subtotalKobo, setQuantity, removeItem } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className={styles.wrap}>
        <div className={styles.empty}>
          <p className={styles.emptyText}>Your cart is empty.</p>
          <Link href="/" className={styles.browseLink}>
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Your Cart</h1>

      <div className={styles.items}>
        {items.map((item) => (
          <div className={styles.item} key={item.productId}>
            <div className={styles.thumb}>
              {item.image && (
                <Image src={item.image} alt={item.name} fill sizes="68px" style={{ objectFit: "cover" }} />
              )}
            </div>
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemPrice}>{formatNaira(item.priceKobo)}</p>
              <div className={styles.itemControls}>
                <div className={styles.qtyRow}>
                  <button
                    className={styles.qtyBtn}
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.remove}
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>{formatNaira(subtotalKobo)}</span>
        </div>
        <button className={styles.checkoutBtn} onClick={() => router.push("/checkout")}>
          Proceed to Checkout
        </button>
        <Link href="/" className={styles.continueLink}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
