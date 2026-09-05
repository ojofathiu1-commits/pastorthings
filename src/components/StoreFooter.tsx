import Link from "next/link";
import { ChromeCross } from "./BrandMark";
import { SocialLinks } from "./SocialLinks";
import styles from "./StoreFooter.module.css";

export function StoreFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div>
        <div className={styles.logo}>
          <ChromeCross className={styles.cross} />
          <span className={styles.wordmark}>ILL MEMBER</span>
        </div>
        <p className={styles.bottom}>© {year} ILL MEMBER. All rights reserved.</p>
        <div className={styles.footerSocials}>
          <SocialLinks size="small" />
        </div>
      </div>

      <nav className={styles.links}>
        <Link href="/">Shop</Link>
        <Link href="/track-order">Track Order</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
    </footer>
  );
}
