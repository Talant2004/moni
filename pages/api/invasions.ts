import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '../../lib/database'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const db = getDatabase()
      const invasions = db.prepare('SELECT * FROM invasions ORDER BY year DESC').all()
      res.status(200).json(invasions)
    } catch (error) {
      console.error('Database error:', error)
      res.status(500).json({ error: 'Failed to fetch invasions' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}




