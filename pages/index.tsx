import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useUser } from '@auth0/nextjs-auth0/client';
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import SearchBar from "@/components/SearchBar";
import { getGroupName } from "@/utils/helpers";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const groups = Array.from({ length: 30 }, (_, i) => i + 1);
  const { user, error, isLoading } = useUser();
  const [progress, setProgress] = useState<{ [key: string]: string; }>({});

  useEffect(() => {
    const storedProgress = localStorage.getItem('progress');
    const progressItems = JSON.parse(storedProgress || '{}');
    setProgress(progressItems);
  }, []);

  if (isLoading) return null;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>VocaX - Homepage</title>
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
        <p>Groups discovered: {Object.keys(progress).length} / 30 </p>
        <br />
        <div className={styles.grid}>
          <a
            href="groups/difficult"
            className={styles.card}
          >
            <h2>
              {getGroupName('difficult')}
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
                {getGroupName(group.toString())} {idx >= 3 && !user && <span>&#128274;</span>}
              </h2>
              <div className={styles.progressBar} style={{ marginBottom: '20px' }}>
                <div className={styles.progressBarInner} style={{ width: `${progress[group]}%`, backgroundColor: `${parseInt(progress[group]) === 100 ? 'green' : 'orange'}` }}></div>
              </div>
              <p>
                {idx < 3 || idx >= 3 && user ? 'Open this group and explore it' : 'You need to login to explore this group. Register for free!'}
              </p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
