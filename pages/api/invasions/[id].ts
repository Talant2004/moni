import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      
      const invasionResult = await query('SELECT * FROM invasions WHERE id = $1', [id])
      
      if (invasionResult.rows.length === 0) {
        res.status(404).json({ error: 'Invasion not found' })
        return
      }

      const invasion = invasionResult.rows[0]

      // Get photos
      const photosResult = await query('SELECT photo_path FROM invasion_photos WHERE invasion_id = $1', [id])
      
      // Get links
      const linksResult = await query('SELECT title, url FROM invasion_links WHERE invasion_id = $1', [id])

      res.status(200).json({
        ...invasion,
        photos: photosResult.rows.map((p: any) => p.photo_path),
        links: linksResult.rows
      })
    } catch (error) {
      console.error('Database error:', error)
      res.status(500).json({ error: 'Failed to fetch invasion' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
