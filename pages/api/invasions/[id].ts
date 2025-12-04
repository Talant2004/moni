import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '../../../lib/database'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      const db = getDatabase()
      
      const invasion = db.prepare('SELECT * FROM invasions WHERE id = ?').get(id)
      
      if (!invasion) {
        res.status(404).json({ error: 'Invasion not found' })
        return
      }

      // Get photos
      const photos = db.prepare('SELECT photo_path FROM invasion_photos WHERE invasion_id = ?').all(id)
      
      // Get links
      const links = db.prepare('SELECT title, url FROM invasion_links WHERE invasion_id = ?').all(id)

      res.status(200).json({
        ...invasion,
        photos: photos.map((p: any) => p.photo_path),
        links: links
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




