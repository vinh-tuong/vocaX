import words from '@/data/words.json'; // Path to your JSON file
import { Word } from '@/utils/types';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, g } = req.query; // "q" is the search query

  if (!q) {
    return res.status(400).json({ message: 'query is required' });
  }

  let wordsToSearch;

  if (g) {
    const groupData = await import(`@/data/groups/words_${g}.json`);
    wordsToSearch = groupData.default;
  } else {
    wordsToSearch = words;
  }

  const results = wordsToSearch.filter((wordObj: Word) =>
    wordObj.word.toLowerCase().includes(q as string)
  ).slice(0, 10); // Return a maximum of 10 results

  res.status(200).json(results);
}
