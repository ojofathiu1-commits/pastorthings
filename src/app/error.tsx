"use client";

import { useEffect } from "react";
import { ChromeCross } from "@/components/BrandMark";
import styles from "./not-found.module.css";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <ChromeCross className={styles.mark} />
      <h1 className={styles.title}>Something Went Wrong</h1>
      <p className={styles.note}>Give it another try — if it keeps happening, check back shortly.</p>
      <button type="button" className={styles.link} onClick={reset}>
        Try Again
      </button>
    </div>
  );
}
