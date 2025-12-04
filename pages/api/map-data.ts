import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { region, district, year, season, showThreat, showTreated, weather } = req.query

      let sql = 'SELECT * FROM map_data WHERE 1=1'
      const params: any[] = []
      let paramIndex = 1

      if (region) {
        sql += ` AND region = $${paramIndex}`
        params.push(region)
        paramIndex++
      }

      if (district) {
        sql += ` AND district LIKE $${paramIndex}`
        params.push(`%${district}%`)
        paramIndex++
      }

      if (year) {
        sql += ` AND year = $${paramIndex}`
        params.push(parseInt(year as string))
        paramIndex++
      }

      if (season) {
        sql += ` AND season = $${paramIndex}`
        params.push(season)
        paramIndex++
      }

      if (showThreat === 'true') {
        sql += ' AND threat_level > 0'
      }

      if (showTreated === 'true') {
        sql += ' AND treated_area > 0'
      }

      // Weather filter - filter by weather parameter type
      if (weather) {
        const weatherType = weather as string
        switch (weatherType) {
          case 'temperature':
            sql += ' AND temperature IS NOT NULL'
            break
          case 'precipitation':
            sql += ' AND precipitation IS NOT NULL'
            break
          case 'humidity':
            sql += ' AND humidity IS NOT NULL'
            break
          case 'wind':
            sql += ' AND wind_speed IS NOT NULL'
            break
        }
      }

      sql += ' ORDER BY year DESC, region, district'

      const result = await query(sql, params)
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Database error:', error)
      res.status(500).json({ error: 'Failed to fetch map data' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
