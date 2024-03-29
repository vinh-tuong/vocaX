import { GetServerSideProps, NextPage } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import homeStyles from "@/styles/Home.module.css";
import styles from "@/styles/Group.module.css";
import axios from 'axios';
import { Inter } from 'next/font/google';
import { getGenderFromWord, onSlideSpeedBtnClick, onSpeedRateBtnClick, speak } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { ButtonFirst, ButtonNext, ButtonPlay, CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Modal from '@/components/Modal';
import VoiceSelector from '@/components/VoiceSelector';
import { GroupData, Word } from '@/utils/types';
import SlideTracker from '@/components/SlideTracker';
import CardItem from '@/components/CardItem';
import { useUser } from '@auth0/nextjs-auth0/client';
import Head from 'next/head';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

const GroupPage: NextPage<{ groupData: GroupData }> = ({ groupData }) => {
  const { title, words } = groupData;
  const { user, error, isLoading } = useUser();
  const [carouselModalOpen, setCarouselModalOpen] = useState(false);
  const [slideSpeed, setSlideSpeed] = useState(3000);
  const [speedRate, setSpeedRate] = useState(0.8);
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [wordsToShow, setWordsToShow] = useState<Word[]>([]);
  const [genderSelection, setGenderSelection] = useState('all');
  const [difficult, setDifficult] = useState<Word[]>([]);
  const [showMeaning, setShowMeaning] = useState(true);
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    try {
      const storedDifficult = localStorage.getItem('group-difficult');
      if (storedDifficult) {
        const difficultWords = JSON.parse(storedDifficult);
        setDifficult(difficultWords);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const originalWords = title === 'difficult' ? difficult : words;
    const itemsToShow = originalWords.filter((i: Word) => (getGenderFromWord((i || {}).word) === genderSelection || genderSelection === 'all'));
    setWordsToShow(itemsToShow);
  }, [difficult, genderSelection, title, words]);

  // const onShuffleBtnClick = () => {
  //   const originalWords = title === 'difficult' ? difficult : words;
  //   const itemsToShow = [...originalWords];
  //   itemsToShow.sort(() => 0.5 - Math.random())
  //   setWordsToShow(itemsToShow);
  // };

  const markAWordDifficult = (word: Word) => {
    if (difficult.some(w => w.ID === word.ID)) {
      const newDifficult = difficult.filter(w => w.ID !== word.ID);
      localStorage.setItem('group-difficult', JSON.stringify(newDifficult));
      setDifficult(newDifficult);
    } else {
      const newDifficult = [...difficult, word];
      localStorage.setItem('group-difficult', JSON.stringify(newDifficult));
      setDifficult(newDifficult);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>VocaX</title>
        <meta name="description" content={`vocaX - German Wordlist - B1 - Group ${title}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head><main className={`${homeStyles.main} ${inter.className}`}>
        <div className={homeStyles.description}>
          <Link href="/">Back to home</Link>
          <div>
            Welcome&nbsp;
            <code className={homeStyles.code}>{user ? user.name : 'Anonymous User'}</code>
          </div>
        </div>
        <h1>Group: {title}</h1>
        <h3 style={{ textAlign: 'center' }}>{title === 'difficult' ? 'Here you will find all the words you have marked as difficult' : `Here you will find all the words for group ${title}`}</h3>
        <br />
        <select value={genderSelection} onChange={(e) => setGenderSelection(e.target.value)}>
          <option value="all">Show All</option>
          <option value="der">Show Der</option>
          <option value="die">Show Die</option>
          <option value="das">Show Das</option>
          <option value="other">Show Others</option>
        </select>
        <VoiceSelector selected={selectedVoice} setSelected={setSelectedVoice} />
        <br />
        <div>
          <button className={styles.button} onClick={() => onSlideSpeedBtnClick(slideSpeed, setSlideSpeed)}>{slideSpeed / 1000}s</button>
          <button className={styles.button} onClick={() => onSpeedRateBtnClick(speedRate, setSpeedRate)}>{speedRate}x</button>
          {/* <button className={styles.button} onClick={onShuffleBtnClick}>Shuffle</button> */}
          <button className={styles.button} onClick={() => setCarouselModalOpen(true)}>Slideshow</button>
        </div>
        <br />
        <div>
          <input type="checkbox" id="showMeaning" checked={showMeaning} onChange={(e) => setShowMeaning(e.target.checked)} />
          <label htmlFor="showMeaning">Show Meaning</label>
          <input type="checkbox" id="showExamples" checked={showExamples} onChange={(e) => setShowExamples(e.target.checked)} />
          <label htmlFor="showExamples">Show Examples</label>
        </div>
        <br />
        <div className={homeStyles.grid}>
          {wordsToShow.map((word) => (
            <CardItem
              key={word.ID}
              word={word}
              isDifficult={difficult.some(w => w.ID === word.ID)}
              markDifficult={markAWordDifficult}
              speakSth={(phrase) => speak({ phrase, rate: speedRate, voice: selectedVoice })}
              showMeaning={showMeaning}
              showExamples={showExamples}
            />
          ))}
        </div>
        <Modal open={carouselModalOpen} onModalClose={() => setCarouselModalOpen(false)} style={{ backgroundColor: "#dbc7ac" }}>
          <CarouselProvider
            naturalSlideWidth={300}
            naturalSlideHeight={300}
            totalSlides={wordsToShow.length}
            infinite={true}
            isPlaying={carouselModalOpen}
            interval={slideSpeed}
          >
            <Slider>
              {wordsToShow.map((word, idx) => <Slide index={idx} key={word.ID}>
                <CardItem
                  word={word}
                  isDifficult={difficult.some(w => w.ID === word.ID)}
                  markDifficult={markAWordDifficult}
                  speakSth={(phrase) => speak({ phrase, rate: speedRate, voice: selectedVoice })}
                  showMeaning={showMeaning}
                  showExamples={showExamples}
                  inSlide={true}
                />
              </Slide>
              )}
            </Slider>
            <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
              <ButtonPlay className={styles.button} childrenPlaying="Pause" childrenPaused="Play" />
              <ButtonFirst className={styles.button}>First</ButtonFirst>
              <ButtonNext className={styles.button}>Next</ButtonNext>
            </div>
            <SlideTracker items={wordsToShow} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} playSound={true} voice={selectedVoice} speedRate={speedRate} />
          </CarouselProvider>
        </Modal>
      </main>
    </>
  );
};

// Update getServerSideProps to fetch group data from your API
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params, req, res } = context;
  const group = params?.group;
  // For groups greater than 2, require authentication
  if (parseInt(group as string, 10) > 2) {
    const session = await getSession(req, res);
    if (!session) {
      return {
        redirect: {
          destination: '/api/auth/login',
          permanent: false,
        },
      };
    }
  }

  // Use the dynamic base URL
  const baseUrl = process.env.AUTH0_BASE_URL;

  // Fetch group data from your API
  try {
    const { data: groupData } = await axios.get<GroupData>(`${baseUrl}/api/groups/${group}`);
    return { props: { groupData } };
  } catch (error) {
    console.error('Failed to fetch group data:', error);
    return { notFound: true };
  }
};

export default GroupPage;
