import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const acceptLanguage = req.headers['accept-language'] || ''
      const locale = acceptLanguage.includes('kk') || acceptLanguage.includes('kz') ? 'kk' : 'ru'
      const result = await query('SELECT * FROM invasions ORDER BY year DESC')
      
      // Map results to use correct locale
      const invasions = result.rows.map((invasion: any) => ({
        id: invasion.id,
        year: invasion.year,
        title: locale === 'kk' && invasion.title_kk ? invasion.title_kk : invasion.title,
        description: locale === 'kk' && invasion.description_kk ? invasion.description_kk : invasion.description,
        region: locale === 'kk' && invasion.region_kk ? invasion.region_kk : invasion.region,
        created_at: invasion.created_at
      }))
      
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
