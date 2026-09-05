"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./HeroSlideshow.module.css";

const SLIDE_DURATION_MS = 5000;

export function HeroSlideshow({ images }: { images: { src: string; position: string }[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      {images.map((img, i) => (
        <div key={img.src} className={`${styles.slide} ${i === active ? styles.active : ""}`}>
          <Image
            src={img.src}
            alt="ILL MEMBER"
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: img.position }}
          />
        </div>
      ))}

      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((img, i) => (
            <span key={img.src} className={`${styles.dot} ${i === active ? styles.active : ""}`} />
          ))}
        </div>
      )}
    </>
  );
}
