import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useUser } from '@auth0/nextjs-auth0/client';
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import SearchBar from "@/components/SearchBar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const groups = Array.from({ length: 30 }, (_, i) => i + 1);
  const { user, error, isLoading } = useUser();

  if (isLoading) return null;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>VocaX</title>
        <meta name="description" content="vocaX - German Wordlist - B1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          {user ? <Link href="/api/auth/logout">Logout</Link> : <Link href="/api/auth/login">Login</Link>}
          <div>
            Welcome&nbsp;
            <code className={styles.code}>{user ? user.name : 'Anonymous User'}</code>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            src="/logo.png"
            width={60}
            height={60}
            alt="Logo"
          />
          <h2 style={{ textTransform: 'uppercase', fontWeight: '300' }}>German wordlist B1 level</h2>
        </div>

        <SearchBar />
        <br />

        <div className={styles.grid}>
          <a
            href="groups/difficult"
            className={styles.card}
          >
            <h2>
              Group Difficult
            </h2>
            <p>
              You will find all the words you have marked as <strong>difficult</strong> here
            </p>
          </a>
          {groups.map((group, idx) => (
            <a
              key={group}
              href={`groups/${group}`}
              className={styles.card}
            >
              <h2>
                Group {group} {idx >= 2 && !user && <span>&#128274;</span>}
              </h2>
              <p>
                {idx < 2 || idx >= 2 && user ? 'Open this group and explore it' : 'You need to login to explore this group'}
              </p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
