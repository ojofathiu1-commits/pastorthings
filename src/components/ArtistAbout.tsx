import Image from "next/image";
import { SocialLinks } from "./SocialLinks";
import styles from "./ArtistAbout.module.css";

// DRAFT -- placeholder brand copy for KennyBlaze to edit or replace with his own words.
const BRAND_NOTE = `ILL MEMBER is my own line — pieces I'd actually wear myself. No filler, no rushed drops, just things I'm genuinely into. Starting with a chain, with more to come.`;

export function ArtistAbout() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.portrait}>
        <Image
          src="/brand/artist-portrait.jpg"
          alt="KennyBlaze"
          fill
          sizes="(min-width: 720px) 280px, 100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div>
        <h2 className={styles.name}>KennyBlaze</h2>
        <p className={styles.badge}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            />
          </svg>
          Verified Artist
        </p>
        <p className={styles.brandNote}>{BRAND_NOTE}</p>
        <div className={styles.socials}>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
