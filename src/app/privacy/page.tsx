import styles from "./page.module.css";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.updated}>Last updated {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

      <div className={styles.section}>
        <h2 className={styles.heading}>What We Collect</h2>
        <p className={styles.body}>
          When you place an order, we collect your name, email, phone number, and delivery
          address so we can fulfil and ship it. If you sign up to be notified about a
          coming-soon drop, we collect the email or WhatsApp number you provide. If you join our
          mailing list, we collect your email. We don&rsquo;t require an account to shop —
          nothing else is collected beyond what&rsquo;s needed for these purposes.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>Payments</h2>
        <p className={styles.body}>
          Payments are processed by Paystack. We never see or store your card details — Paystack
          handles that directly and shares only the payment status and a reference with us.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>How We Use It</h2>
        <p className={styles.body}>
          To process and ship your order, send order and delivery updates, notify you about
          drops you&rsquo;ve asked to hear about, and — if you&rsquo;ve joined the mailing list —
          send occasional emails about new releases. We don&rsquo;t sell your information to
          anyone.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>Sharing</h2>
        <p className={styles.body}>
          Your delivery details are shared with the courier fulfilling your order. Payment
          details are handled by Paystack. We don&rsquo;t share your information with anyone
          else.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>Unsubscribing</h2>
        <p className={styles.body}>
          Every mailing list email includes an unsubscribe link. Notify-me signups are one-time —
          you&rsquo;re messaged once, when that item goes live.
        </p>
      </div>
    </div>
  );
}
