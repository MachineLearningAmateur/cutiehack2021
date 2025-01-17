import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../util/mongodb'

export default async function FetchCheckIn(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase();
    const { user: id } = req.body;
    const checkins = await db.collection('checkins').find({'userId': id}).toArray();
    res.status(200);
    res.json({ checkins });
  }
  catch {
    res.status(500);
    res.json({ error: "Unable to fetch checkins..."});
  }
}