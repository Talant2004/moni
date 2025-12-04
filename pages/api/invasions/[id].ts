import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      const locale = req.headers['accept-language']?.includes('kk') ? 'kk' : 'ru'
      
      const invasionResult = await query('SELECT * FROM invasions WHERE id = $1', [id])
      
      if (invasionResult.rows.length === 0) {
        res.status(404).json({ error: 'Invasion not found' })
        return
      }

      const invasion = invasionResult.rows[0]

      // Select fields based on locale
      const title = locale === 'kk' && invasion.title_kk ? invasion.title_kk : invasion.title
      const description = locale === 'kk' && invasion.description_kk ? invasion.description_kk : invasion.description
      const fullText = locale === 'kk' && invasion.full_text_kk ? invasion.full_text_kk : (invasion.full_text || invasion.fullText || '')
      const region = locale === 'kk' && invasion.region_kk ? invasion.region_kk : invasion.region

      // Get photos
      const photosResult = await query('SELECT photo_path FROM invasion_photos WHERE invasion_id = $1', [id])
      
      // Get links
      const linksResult = await query('SELECT title, url FROM invasion_links WHERE invasion_id = $1', [id])

      res.status(200).json({
        id: invasion.id,
        year: invasion.year,
        title,
        description,
        full_text: fullText,
        fullText: fullText,
        region,
        photos: photosResult.rows.map((p: any) => p.photo_path),
        links: linksResult.rows,
        created_at: invasion.created_at
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
