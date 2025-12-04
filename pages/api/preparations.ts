import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const locale = req.headers['accept-language']?.includes('kk') ? 'kk' : 'ru'
      const result = await query('SELECT * FROM preparations ORDER BY name')
      
      // Map results to use correct locale
      const preparations = result.rows.map((prep: any) => ({
        id: prep.id,
        name: locale === 'kk' && prep.name_kk ? prep.name_kk : prep.name,
        description: locale === 'kk' && prep.description_kk ? prep.description_kk : prep.description,
        active_substance: locale === 'kk' && prep.active_substance_kk ? prep.active_substance_kk : prep.active_substance,
        application_method: locale === 'kk' && prep.application_method_kk ? prep.application_method_kk : prep.application_method,
        created_at: prep.created_at
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
