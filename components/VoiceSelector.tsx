import { useState, useEffect } from "react";

const VoiceSelector = ({ selected = 0, setSelected }: { selected: number, setSelected: (value: number) => void }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const populateVoiceList = () => {
      const newVoices = synth.getVoices().filter(voice => voice.lang.startsWith('de'));
      setVoices(newVoices);
    };

    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoiceList;
    }
  }, []);

  const onVoiceSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(+e.target.value);
  };

  return (
    <select
      value={selected}
      onChange={onVoiceSelectChange}
    >
      {voices.map((voice, index) => (
        <option key={index} value={index}>
          {voice.name} ({voice.lang}) {voice.default && ' [Default]'}
        </option>
      ))}
    </select>
  );
};

export default VoiceSelector;
