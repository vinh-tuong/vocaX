import { getGenderFromWord } from '@/utils/helpers';
import styles from '../styles/CardItem.module.css'
import homeStyles from '../styles/Home.module.css'
import { Word } from '@/utils/types';

type CardItemType = { word: Word, isDifficult: boolean, markDifficult: (w: Word) => void, speakSth: (phrase: string) => void, showMeaning: boolean, showExamples: boolean, inSlide?: boolean };

const CardItem = ({ word, isDifficult, markDifficult, speakSth, showMeaning, showExamples, inSlide = false }: CardItemType) => {  
  return (
    <div className={`${homeStyles.card} ${inSlide ? homeStyles.cardInSlide : ''} ${isDifficult && !inSlide ? homeStyles.marked : ''}`}>
      <div className={homeStyles.cardTopRight}>
        <label htmlFor={`${word.ID}-checkboxMark-${inSlide ? 'slide' : ''}`}>difficult?</label>
        <input type="checkbox" id={`${word.ID}-checkboxMark-${inSlide ? 'slide' : ''}`} checked={isDifficult} onChange={() => markDifficult(word)} />
      </div>
      <h2 className={styles[getGenderFromWord(word.word)]}>
        <button style={{ marginRight: '5px' }} onClick={() => speakSth(word.word)}>&#128264;</button>
        {word.word}
      </h2>
      <input className={`${styles.checkbox} ${showMeaning ? styles.showMeaning : ''}`} type="checkbox" id={`${word.ID}-checkbox-${inSlide ? 'slide' : ''}`} />
      <label htmlFor={`${word.ID}-checkbox-${inSlide ? 'slide' : ''}`}>
        <span className={styles.label}>show meaning</span>
        <span className={styles.meaning}>{word.meaning}</span>
      </label>
      <br />
      <br />
      {(inSlide || showExamples) && word.examples.map((example, idx) =>
        <div key={`${word.ID}-example-${idx}`} style={{ display: 'flex' }}>
          <button style={{ marginRight: '5px', alignSelf: 'center' }} onClick={() => speakSth(example)}>&#128264;</button>
          <p>{word.examples.length > 1 ? `${idx + 1}. ` : ''}{example}</p>
        </div>
      )}
    </div>
  );
};

export default CardItem;
