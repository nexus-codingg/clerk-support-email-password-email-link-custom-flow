import Link from 'next/link'
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p> This is the home page. Click the links below to sign-in or sign-up</p>
        <Link href="/sign-up">Sign-Up</Link>
        <Link href="/sign-in">Sign-In</Link>
      </main>
    </div>
  );
}
