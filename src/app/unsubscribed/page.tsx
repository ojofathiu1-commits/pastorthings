import Link from "next/link";
import styles from "../not-found.module.css";

export default function UnsubscribedPage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>You&rsquo;re Unsubscribed</h1>
      <p className={styles.note}>You won&rsquo;t get any more mailing list emails from us.</p>
      <Link href="/" className={styles.link}>
        Back To Shop
      </Link>
    </div>
  );
}
