import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM invasions ORDER BY year DESC')
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Database error:', error)
      res.status(500).json({ error: 'Failed to fetch invasions' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
