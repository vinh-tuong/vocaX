import { useEffect, useRef, useState } from 'react';
import styles from '../styles/SearchBar.module.css';
import axios from 'axios';
import { Word } from '@/utils/types';
import CardItem from './CardItem';
import { speak } from '@/utils/helpers';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word>();
  const [difficult, setDifficult] = useState<Word[]>([]);
  const searchBarRef = useRef<HTMLInputElement>(null);

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

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    // Fetch suggestions from the API
    const response = await axios.get(`/api/search?q=${value.toLowerCase()}`);
    setSuggestions(response.data);
    if (response.data.length === 0) {
      setSelectedWord(undefined);
    }
  };

  const handleSelectSuggestion = (suggestion: Word) => {
    setSelectedWord(suggestion);
    setQuery(suggestion.word);
    setSuggestions([]);
  };

  const onSearchBtnClick = () => {
    if (query && suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    } else {
      setQuery('');
      searchBarRef.current?.focus();
    }
  };

  return (
    <>
      <div className={`${styles.searchContainter} ${suggestions.length > 0 ? styles.focusing : ''}`}>
        <input
          type="text"
          ref={searchBarRef}
          className={styles.searchBar}
          placeholder="Search for a word"
          value={query} onChange={handleSearch}
        />
        <div className={styles.searchButtonWrapper}><button onClick={onSearchBtnClick} className={`${styles.searchButton} ${query && suggestions.length === 0 ? styles.hasQuery : ''}`}></button></div>
        {suggestions.length > 0 && (
          <ul className={styles.searchSuggestions}>
            {suggestions.map((suggestion) => (
              <li key={suggestion.ID} role="presentation" onClick={() => handleSelectSuggestion(suggestion)}><span>{suggestion.word}</span></li>
            ))}
          </ul>
        )}
      </div>
      {query && selectedWord && suggestions.length === 0 && (
        <div className={styles.searchResult}>
          <CardItem
            word={selectedWord}
            isDifficult={difficult.some(w => w.ID === selectedWord.ID)}
            markDifficult={markAWordDifficult}
            speakSth={(phrase) => speak({ phrase, rate: 1, voice: -1 })}
            showMeaning={true}
            showExamples={true}
            showVoice={true}
          />
        </div>
      )}
    </>
  );
};

export default SearchBar;
