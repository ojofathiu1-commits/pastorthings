import Link from "next/link";
import { ChromeCross } from "@/components/BrandMark";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <ChromeCross className={styles.mark} />
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.note}>The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
      <Link href="/" className={styles.link}>
        Back To Shop
      </Link>
    </div>
  );
}
