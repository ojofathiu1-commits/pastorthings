import skeleton from "@/components/skeleton.module.css";
import styles from "./page.module.css";

export default function ProductLoading() {
  return (
    <div className={styles.wrap}>
      <div className={skeleton.block} style={{ aspectRatio: "3 / 4", borderRadius: 0 }} />
      <div className={styles.info}>
        <div className={skeleton.line} style={{ width: "60%", height: 18 }} />
        <div className={skeleton.line} style={{ width: "30%", height: 14, marginTop: 10 }} />
        <div className={skeleton.line} style={{ width: "100%", height: 42, marginTop: 20 }} />
        <div className={skeleton.line} style={{ width: "100%", height: 42, marginTop: 20 }} />
      </div>
    </div>
  );
}
