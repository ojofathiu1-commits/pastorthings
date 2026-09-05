"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart, type CartItem } from "./CartProvider";
import { ChromeCross } from "./BrandMark";
import { formatNaira } from "@/lib/money";
import styles from "./AddedToCartToast.module.css";

const AUTO_DISMISS_MS = 4500;

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export function AddedToCartToast() {
  const { justAdded, dismissJustAdded } = useCart();
  const [displayItem, setDisplayItem] = useState<CartItem | null>(null);
  const [prevJustAdded, setPrevJustAdded] = useState(justAdded);

  // Keep showing the last item through the closing transition, even after
  // `justAdded` goes back to null -- adjusting state during render (React's
  // documented pattern for this) instead of a useEffect avoids an extra pass.
  if (justAdded !== prevJustAdded) {
    setPrevJustAdded(justAdded);
    if (justAdded) setDisplayItem(justAdded);
  }

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(dismissJustAdded, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [justAdded, dismissJustAdded]);

  const open = justAdded !== null;

  return (
    <div className={`${styles.wrap} ${open ? styles.open : ""}`} aria-live="polite">
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.headerLeft}>
            <CheckIcon />
            Added to Cart
          </span>
          <button className={styles.close} aria-label="Dismiss" onClick={dismissJustAdded}>
            <CloseIcon />
          </button>
        </div>

        {displayItem && (
          <div className={styles.item}>
            <div className={styles.thumb}>
              {displayItem.image ? (
                <Image src={displayItem.image} alt={displayItem.name} fill sizes="52px" style={{ objectFit: "cover" }} />
              ) : (
                <ChromeCross className={styles.placeholderMark} />
              )}
            </div>
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{displayItem.name}</p>
              <p className={styles.itemMeta}>
                Qty {displayItem.quantity} · {formatNaira(displayItem.priceKobo)}
              </p>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.continueBtn} onClick={dismissJustAdded}>
            Continue Shopping
          </button>
          <Link href="/cart" className={styles.viewCartBtn} onClick={dismissJustAdded}>
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
