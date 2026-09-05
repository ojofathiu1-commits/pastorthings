"use client";

import { useState } from "react";
import type { OrderSummary } from "@/lib/types";
import styles from "./page.module.css";

const TIMELINE_STEPS: { key: string; label: string }[] = [
  { key: "placed", label: "Order Placed" },
  { key: "payment_confirmed", label: "Payment Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

// Internal-only statuses collapse onto the nearest fan-facing step.
function stepIndexFor(status: string) {
  const normalized = status === "packed" ? "preparing" : status;
  const idx = TIMELINE_STEPS.findIndex((s) => s.key === normalized);
  return idx === -1 ? 0 : idx;
}

export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderSummary | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, contact }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Order not found.");
      } else {
        setOrder(data);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const cancelled = order?.status === "cancelled";
  const currentStep = order ? stepIndexFor(order.status) : -1;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Track Order</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          placeholder="Order code (e.g. ILLM-0042)"
          aria-label="Order code"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          required
        />
        <input
          className={styles.input}
          placeholder="Email or phone used at checkout"
          aria-label="Email or phone used at checkout"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Searching…" : "Track"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {order && (
        <div className={styles.result}>
          <p className={styles.orderCode}>{order.order_code}</p>

          {cancelled ? (
            <p className={styles.cancelled}>This order was cancelled.</p>
          ) : (
            <div className={styles.timeline}>
              {TIMELINE_STEPS.map((step, i) => (
                <div key={step.key} className={`${styles.step} ${i <= currentStep ? styles.done : ""}`}>
                  <div>
                    <div className={styles.stepDot} />
                    {i < TIMELINE_STEPS.length - 1 && <div className={styles.stepLine} />}
                  </div>
                  <div>
                    <p className={styles.stepLabel}>{step.label}</p>
                    {step.key === "shipped" && i <= currentStep && order.tracking_number && (
                      <p className={styles.trackingInfo}>
                        {order.courier_name ?? "Courier"} — {order.tracking_number}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
