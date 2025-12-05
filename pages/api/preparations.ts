import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const acceptLanguage = req.headers['accept-language'] || ''
      const locale = acceptLanguage.includes('kk') || acceptLanguage.includes('kz') ? 'kk' : 'ru'
      const result = await query('SELECT * FROM preparations ORDER BY name')
      
      // Map results to use correct locale and load photos
      const preparations = await Promise.all(result.rows.map(async (prep: any) => {
        // Get photos for this preparation
        const photosResult = await query(
          'SELECT photo_path FROM preparation_photos WHERE preparation_id = $1',
          [prep.id]
        )
        
        // Get links for this preparation
        const linksResult = await query(
          'SELECT title, url FROM preparation_links WHERE preparation_id = $1',
          [prep.id]
        )
        
        return {
          id: prep.id,
          name: locale === 'kk' && prep.name_kk ? prep.name_kk : prep.name,
          description: locale === 'kk' && prep.description_kk ? prep.description_kk : prep.description,
          active_substance: locale === 'kk' && prep.active_substance_kk ? prep.active_substance_kk : prep.active_substance,
          application_method: locale === 'kk' && prep.application_method_kk ? prep.application_method_kk : prep.application_method,
          photos: photosResult.rows.map((p: any) => p.photo_path),
          links: linksResult.rows,
          created_at: prep.created_at
        }
      }))
      
      res.status(200).json(preparations)
    } catch (error) {
      console.error('Database error:', error)
      res.status(500).json({ error: 'Failed to fetch preparations' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
