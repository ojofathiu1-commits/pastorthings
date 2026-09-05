import fs from "node:fs";
import path from "node:path";
import { ChromeCross } from "./BrandMark";
import { HeroSlideshow } from "./HeroSlideshow";
import styles from "./Hero.module.css";

const MAX_SLIDES = 6;

// Tuned per-photo so the subject stays in frame at the hero's wide crop --
// these are candid selfies, not shot for this layout, so a single default
// crop doesn't suit all of them equally.
const OBJECT_POSITIONS = ["50% 20%", "25% 15%", "50% 10%"];

function findHeroImages(): { src: string; position: string }[] {
  const images: { src: string; position: string }[] = [];
  for (let i = 1; i <= MAX_SLIDES; i++) {
    for (const ext of ["jpg", "jpeg", "png", "webp"]) {
      const file = `hero-${i}.${ext}`;
      if (fs.existsSync(path.join(process.cwd(), "public", "brand", file))) {
        images.push({ src: `/brand/${file}`, position: OBJECT_POSITIONS[i - 1] ?? "center" });
        break;
      }
    }
  }
  return images;
}

export function Hero() {
  const images = findHeroImages();

  return (
    <div className={styles.hero}>
      {images.length > 0 ? (
        <HeroSlideshow images={images} />
      ) : (
        <ChromeCross className={styles.placeholderMark} />
      )}
      <div className={styles.scrim} />
      <div className={styles.content}>
        <a href="#available-now" className={styles.cta}>
          Shop The Drop
        </a>
      </div>
    </div>
  );
}
