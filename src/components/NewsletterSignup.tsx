"use client";

import { useState } from "react";
import styles from "./NewsletterSignup.module.css";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="join" className={styles.section}>
      <h2 className={styles.title}>Join The Circle</h2>
      <p className={styles.subtitle}>
        Be first to hear about new drops and restocks — straight to your inbox.
      </p>

      {state === "done" ? (
        <p className={styles.success}>You&rsquo;re in. Watch your inbox for the next drop.</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            required
            className={styles.input}
            placeholder="your@email.com"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className={styles.submitBtn} disabled={state === "loading"}>
            {state === "loading" ? "Joining…" : "Subscribe"}
          </button>
          {state === "error" && <p className={styles.error}>Something went wrong — try again.</p>}
          <p className={styles.fine}>
            By subscribing, you agree to our <a href="/privacy">Privacy Policy</a>. Unsubscribe
            anytime.
          </p>
        </form>
      )}
    </section>
  );
}
