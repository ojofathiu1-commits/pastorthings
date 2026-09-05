"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";
import styles from "./ProductActions.module.css";

const MADE_TO_ORDER_MAX_QTY = 10;

export function ProductActions({
  product,
  availableUnits,
}: {
  product: Product;
  availableUnits: number;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const maxQty = product.made_to_order ? MADE_TO_ORDER_MAX_QTY : availableUnits;

  if (
    product.status === "sold_out" ||
    (product.status === "available" && !product.made_to_order && availableUnits <= 0)
  ) {
    return (
      <div className={styles.wrap}>
        <button type="button" className={styles.cta} disabled>
          Sold Out
        </button>
      </div>
    );
  }

  if (product.status === "coming_soon") {
    return <NotifyForm productId={product.id} />;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.qtyRow}>
        <button
          type="button"
          className={styles.qtyBtn}
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
        >
          −
        </button>
        <span className={styles.qtyValue} aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          className={styles.qtyBtn}
          aria-label="Increase quantity"
          onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
          disabled={qty >= maxQty}
        >
          +
        </button>
      </div>
      <button
        type="button"
        className={styles.cta}
        onClick={() => {
          addItem(
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              priceKobo: product.price_kobo ?? 0,
              image: product.images[0] ?? null,
            },
            qty,
          );
        }}
      >
        Buy Now
      </button>
    </div>
  );
}

function NotifyForm({ productId }: { productId: string }) {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() && !whatsapp.trim()) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email: email.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className={styles.wrap}>
        <p className={styles.success}>You&rsquo;re on the list — we&rsquo;ll let you know the moment this drops.</p>
      </div>
    );
  }

  return (
    <form className={styles.wrap} onSubmit={handleSubmit}>
      <div className={styles.form}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="tel"
          placeholder="WhatsApp number (optional)"
          aria-label="WhatsApp number (optional)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
        <button type="submit" className={styles.cta} disabled={state === "loading"}>
          {state === "loading" ? "Submitting…" : "Notify Me"}
        </button>
      </div>
      {state === "error" && (
        <p className={styles.error}>Enter an email or WhatsApp number to get notified.</p>
      )}
      <p className={styles.note}>We&rsquo;ll only message you about this drop.</p>
    </form>
  );
}
