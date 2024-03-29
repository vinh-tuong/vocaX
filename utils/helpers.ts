const getGenderFromWord = (word: string) => {
  if (["E", "e", "Die", "die"].includes(word.split(" ")[0])) {
    return "die";
  }

  if (["R", "r", "Der", "der"].includes(word.split(" ")[0])) {
    return "der";
  }

  if (["S", "s", "Das", "das"].includes(word.split(" ")[0])) {
    return "das";
  }

  return "other";
}

var utterance: SpeechSynthesisUtterance;

const speak = ({ phrase, rate = 1, voice = 0 }: { phrase: string, rate: number, voice: number }) => {
  if (!utterance) {
    utterance = new SpeechSynthesisUtterance();
  }
  utterance.text = phrase;
  // utterance.lang = 'de-DE';
  utterance.voice = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('de'))[voice];
  utterance.rate = rate;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const stop = () => {
  window.speechSynthesis.cancel();
};

const onSlideSpeedBtnClick = (slideSpeed: number, setSlideSpeed: (speed: number) => void) => {
  if (slideSpeed === 3000) {
    setSlideSpeed(5000);
    return;
  }

  if (slideSpeed === 5000) {
    setSlideSpeed(1500);
    return;
  }

  if (slideSpeed === 1500) {
    setSlideSpeed(3000);
    return;
  }
};

const onSpeedRateBtnClick = (speedRate: number, setSpeedRate: (rate: number) => void) => {
  if (speedRate === 1) {
    setSpeedRate(0.6);
    return;
  }

  if (speedRate === 0.6) {
    setSpeedRate(0.8);
    return;
  }

  if (speedRate === 0.8) {
    setSpeedRate(1);
    return;
  }
};

export { getGenderFromWord, speak, stop, onSlideSpeedBtnClick, onSpeedRateBtnClick };

