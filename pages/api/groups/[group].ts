// pages/api/groups/[group].ts
import type { NextApiRequest, NextApiResponse } from 'next';

async function fetchGroupData(groupId: string) {
  // Special handling the "difficult" group
  if (groupId === 'difficult') {
    // Here you could fetch words from localStorage if necessary
    // For demonstration purposes, we return an empty list
    return {
      title: groupId,
      words: [] // Return empty for the difficult group
    };
  }

  // Dynamically import the group data from a JSON file based on groupId
  try {
    const groupData = await import(`@/data/groups/words_${groupId}.json`);
    return {
      title: groupId,
      words: groupData.default // Assuming the default export is the array of words
    };
  } catch (error) {
    console.error('Failed to fetch group data:', error);
    throw new Error('Group data not found');
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { group } = req.query;

  try {
    const groupData = await fetchGroupData(group as string);
    res.status(200).json(groupData);
  } catch (error) {
    res.status(404).json({ message: 'Group not found' });
  }
}
