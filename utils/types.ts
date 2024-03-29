export type GroupData = {
  title: string;
  words: Word[];
};

export type Word = {
  ID: string;
  word: string;
  meaning: string;
  examples: string[];
};
