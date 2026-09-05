import skeleton from "@/components/skeleton.module.css";
import styles from "./page.module.css";

export default function ShopLoading() {
  return (
    <>
      <div className={skeleton.block} style={{ aspectRatio: "4 / 5" }} />

      <section className={styles.section}>
        <div className={skeleton.line} style={{ width: 110, height: 13 }} />
        <div className={styles.grid} style={{ marginTop: 18 }}>
          {[0, 1].map((i) => (
            <div key={i}>
              <div className={skeleton.block} style={{ aspectRatio: "3 / 4" }} />
              <div className={skeleton.line} style={{ width: "70%", height: 11, marginTop: 10 }} />
              <div className={skeleton.line} style={{ width: "40%", height: 9, marginTop: 6 }} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
