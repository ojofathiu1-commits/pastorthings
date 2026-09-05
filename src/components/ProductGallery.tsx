"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChromeCross } from "./BrandMark";
import styles from "./ProductGallery.module.css";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) {
    return (
      <div className={styles.wrap}>
        <div className={styles.slide}>
          <ChromeCross className={styles.placeholder} />
        </div>
      </div>
    );
  }

  function scrollTo(index: number) {
    setActive(index);
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * index, behavior: "smooth" });
  }

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.scroller} ref={scrollerRef} onScroll={handleScroll}>
        {images.map((src, i) => (
          <div className={styles.slide} key={src}>
            <Image
              src={src}
              alt={`${name} — photo ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(min-width: 720px) 50vw, 100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <div className={styles.dots}>
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Photo ${i + 1}`}
                className={`${styles.dot} ${i === active ? styles.active : ""}`}
                onClick={() => scrollTo(i)}
              />
            ))}
          </div>

          <div className={styles.thumbRow}>
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Photo ${i + 1}`}
                className={`${styles.thumb} ${i === active ? styles.active : ""}`}
                onClick={() => scrollTo(i)}
              >
                <Image src={src} alt="" fill sizes="64px" style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
