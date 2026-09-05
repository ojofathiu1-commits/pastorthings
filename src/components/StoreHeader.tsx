"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { ChromeCross } from "./BrandMark";
import { SocialLinks } from "./SocialLinks";
import styles from "./StoreHeader.module.css";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.2" y2="16.2" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5L6 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export function StoreHeader() {
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count } = useCart();
  const router = useRouter();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    setSearchOpen(false);
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <>
      <header className={styles.storeHeader}>
        <div className={styles.leftGroup}>
          <button
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            aria-label="Menu"
            onClick={() => setNavOpen(true)}
          >
            <MenuIcon />
          </button>

          <Link href="/" className={styles.logo} aria-label="ILL MEMBER home">
            <ChromeCross className={styles.cross} />
            <span className={styles.wordmark}>ILL MEMBER</span>
          </Link>
        </div>

        <div className={styles.rightGroup}>
          <button
            className={`${styles.iconBtn} ${styles.searchBtn}`}
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon />
          </button>
          <Link href="/cart" className={styles.cartWrap} aria-label="Cart">
            <span className={styles.iconBtn}>
              <CartIcon />
            </span>
            {count > 0 && <span className={styles.cartBadge}>{count}</span>}
          </Link>
        </div>
      </header>

      <div
        className={`${styles.navOverlay} ${navOpen ? styles.open : ""}`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />
      <nav className={`${styles.navPanel} ${navOpen ? styles.open : ""}`} aria-hidden={!navOpen}>
        <div className={styles.navHeader}>
          <Link href="/" className={styles.navLogo} onClick={() => setNavOpen(false)}>
            <ChromeCross className={styles.navLogoCross} />
            <span className={styles.navLogoWordmark}>ILL MEMBER</span>
          </Link>
          <button className={styles.navClose} aria-label="Close menu" onClick={() => setNavOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.navLinks}>
          <Link href="/" onClick={() => setNavOpen(false)}>
            Shop
          </Link>
          <Link href="/#coming-soon" onClick={() => setNavOpen(false)}>
            Coming Soon
          </Link>
          <Link href="/track-order" onClick={() => setNavOpen(false)}>
            Track Order
          </Link>
        </div>

        <div className={styles.navDivider} />

        <div className={styles.navLinksSecondary}>
          <Link href="/#join" onClick={() => setNavOpen(false)}>
            Join The Circle
          </Link>
          <Link href="/privacy" onClick={() => setNavOpen(false)}>
            Privacy
          </Link>
          <Link href="/#about" onClick={() => setNavOpen(false)}>
            About KennyBlaze
          </Link>
        </div>

        <div className={styles.navSocials}>
          <SocialLinks size="small" />
        </div>
      </nav>

      {searchOpen && (
        <form className={styles.searchPanel} onSubmit={submitSearch}>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
          />
          <button
            type="button"
            className={styles.searchClose}
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          >
            <CloseIcon />
          </button>
        </form>
      )}
    </>
  );
}
