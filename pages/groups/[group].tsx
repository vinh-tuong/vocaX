import { GetServerSideProps, NextPage } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import homeStyles from "@/styles/Home.module.css";
import styles from "@/styles/Group.module.css";
import axios from 'axios';
import { Inter } from 'next/font/google';
import { getGenderFromWord, mobileCheck, onSlideSpeedBtnClick, onspeechRateBtnClick, speak, stop, getGroupName, getScrollPercent } from '@/utils/helpers';
import { useEffect, useRef, useState } from 'react';
import { ButtonFirst, ButtonNext, ButtonBack, ButtonPlay, CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Modal from '@/components/Modal';
import VoiceSelector from '@/components/VoiceSelector';
import { GroupData, Word } from '@/utils/types';
import SlideTracker from '@/components/SlideTracker';
import CardItem from '@/components/CardItem';
import { useUser } from '@auth0/nextjs-auth0/client';
import Head from 'next/head';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

const inter = Inter({ subsets: ["latin"] });

const GroupPage: NextPage<{ groupData: GroupData }> = ({ groupData }) => {
  const { title, words } = groupData;
  const { user, error, isLoading } = useUser();
  const [carouselModalOpen, setCarouselModalOpen] = useState(false);
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const [slideSpeed, setSlideSpeed] = useState(3000);
  const [speechRate, setSpeechRate] = useState(0.8);
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [wordsToShow, setWordsToShow] = useState<Word[]>([]);
  const [genderSelection, setGenderSelection] = useState('all');
  const [difficult, setDifficult] = useState<Word[]>([]);
  const [showMeaning, setShowMeaning] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [showVoice, setShowVoice] = useState(true);
  const timerDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const originalWords = title === 'difficult' ? difficult : words;
    const itemsToShow = originalWords.filter((i: Word) => (getGenderFromWord((i || {}).word) === genderSelection || genderSelection === 'all'));
    setWordsToShow(itemsToShow);
  }, [difficult, genderSelection, title, words]);

  useEffect(() => {
    window.onscroll = handleDebounceScroll;
    try {
      const storedDifficult = localStorage.getItem('group-difficult');
      if (storedDifficult) {
        const difficultWords = JSON.parse(storedDifficult);
        setDifficult(difficultWords);
      }
    } catch (e) {
      console.error(e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleDebounceScroll = () => {
    if (timerDebounceRef.current) {
      clearTimeout(timerDebounceRef.current);
    }
    timerDebounceRef.current = setTimeout(() => {
      if (title === 'difficult') {
        return;
      }

      const storedProgress = localStorage.getItem('progress');
      const progressItems = JSON.parse(storedProgress || '{}');

      if (!progressItems[title] || parseInt(progressItems[title]) < getScrollPercent()) {
        progressItems[title] = getScrollPercent().toString();
        localStorage.setItem('progress', JSON.stringify(progressItems));
      }
    }, 500);
  };

  if (isLoading) return null;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>VocaX - Group page</title>
        <meta name="description" content={`vocaX - German Wordlist - B1 - Group ${title}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head><main className={`${homeStyles.main} ${inter.className}`}>
        <div className={homeStyles.description}>
          <Link href="/">Back to Home</Link>
          <div>
            Welcome&nbsp;
            <code className={homeStyles.code}>{user ? user.name : 'Anonymous User'}</code>
          </div>
        </div>
        <h1><span style={{ fontWeight: '400' }}>Group:</span> {getGroupName(title)}</h1>
        <p style={{ textAlign: 'center' }}>{title === 'difficult' ? 'Here you will find all the words you have marked as difficult' : `Here you will find all the words for group ${getGroupName(title)}`}</p>
        <br />
        {mobileCheck() && <p>(Hint: swipe to change between slides)</p>}
        <br />
        {title !== 'difficult' && <SearchBar group={title} />}
        <br />
        <button className={styles.button} onClick={() => setCarouselModalOpen(true)}>Slideshow</button>
        <br />
        {wordsToShow.length === 0 && title === 'difficult' && <p>Congrats! The world seems to be easy for you :-)</p>}
        <div className={homeStyles.grid}>
          {wordsToShow.map((word) => (
            <CardItem
              key={word.ID}
              word={word}
              isDifficult={difficult.some(w => w.ID === word.ID)}
              markDifficult={markAWordDifficult}
              speakSth={(phrase) => speak({ phrase, rate: speechRate, voice: selectedVoice })}
              showMeaning={showMeaning}
              showExamples={showExamples}
              showVoice={showVoice}
            />
          ))}
        </div>
        <button className={`${styles.button} ${styles.menuBtn}`} onClick={() => setSettingModalOpen(true)}>
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18L20 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12L20 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 6L20 6" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`${styles.button} ${styles.scrollTopBtn}`}>&#8593;</button>
        <Modal open={settingModalOpen} onModalClose={() => setSettingModalOpen(false)}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
            <select value={genderSelection} onChange={(e) => setGenderSelection(e.target.value)}>
              <option value="all">Show All</option>
              <option value="der">Show Der</option>
              <option value="die">Show Die</option>
              <option value="das">Show Das</option>
              <option value="other">Show Others</option>
            </select>
            <div>
              <p>Selected voice:</p>
              <VoiceSelector selected={selectedVoice} setSelected={setSelectedVoice} />
            </div>
            <div>
              <span>Slideshow speed:</span>
              <button className={styles.button} onClick={() => onSlideSpeedBtnClick(slideSpeed, setSlideSpeed)}>{slideSpeed / 1000}s</button>
            </div>
            <div>
              <span>Speech rate:</span>
              <button className={styles.button} onClick={() => onspeechRateBtnClick(speechRate, setSpeechRate)}>{speechRate}x</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <input type="checkbox" id="showMeaning" checked={showMeaning} onChange={(e) => setShowMeaning(e.target.checked)} />
                <label htmlFor="showMeaning">Show Meaning</label>
              </div>
              <div>
                <input type="checkbox" id="showExamples" checked={showExamples} onChange={(e) => setShowExamples(e.target.checked)} />
                <label htmlFor="showExamples">Show Examples</label>
              </div>
              <div>
                <input type="checkbox" id="showVoice" checked={showVoice} onChange={(e) => { setShowVoice(e.target.checked); stop(); }} />
                <label htmlFor="showVoice">Enable Voice</label>
              </div>
            </div>
            <button onClick={() => setSettingModalOpen(false)} className={styles.button}>Close</button>
          </div>
        </Modal>
        <Modal open={carouselModalOpen} onModalClose={() => setCarouselModalOpen(false)} isSlideshow={true} style={{ backgroundColor: "#dbc7ac" }}>
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
                  speakSth={(phrase) => speak({ phrase, rate: speechRate, voice: selectedVoice })}
                  showMeaning={showMeaning}
                  showExamples={showExamples}
                  showVoice={showVoice}
                  inSlide={true}
                />
              </Slide>
              )}
            </Slider>
            <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
              <ButtonPlay className={styles.button} childrenPlaying="Pause" childrenPaused="Play" />
              <ButtonFirst className={styles.button}>First</ButtonFirst>
              <ButtonBack className={styles.button}>Prev</ButtonBack>
              <ButtonNext className={styles.button}>Next</ButtonNext>
            </div>
            <SlideTracker items={wordsToShow} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} playSound={showVoice} voice={selectedVoice} speechRate={speechRate} />
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
  if (parseInt(group as string, 10) > 3) {
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
