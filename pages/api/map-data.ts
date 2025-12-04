import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '../../lib/database'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const db = getDatabase()
      const { region, district, year, season, showThreat, showTreated, weather } = req.query

      let query = 'SELECT * FROM map_data WHERE 1=1'
      const params: any[] = []

      if (region) {
        query += ' AND region = ?'
        params.push(region)
      }

      if (district) {
        query += ' AND district LIKE ?'
        params.push(`%${district}%`)
      }

      if (year) {
        query += ' AND year = ?'
        params.push(parseInt(year as string))
      }

      if (season) {
        query += ' AND season = ?'
        params.push(season)
      }

      if (showThreat === 'true') {
        query += ' AND threat_level > 0'
      }

      if (showTreated === 'true') {
        query += ' AND treated_area > 0'
      }

      // Weather filter - filter by weather parameter type
      if (weather) {
        const weatherType = weather as string
        switch (weatherType) {
          case 'temperature':
            // Show only records with temperature data (not null)
            query += ' AND temperature IS NOT NULL'
            break
          case 'precipitation':
            query += ' AND precipitation IS NOT NULL'
            break
          case 'humidity':
            query += ' AND humidity IS NOT NULL'
            break
          case 'wind':
            query += ' AND wind_speed IS NOT NULL'
            break
        }
      }

      query += ' ORDER BY year DESC, region, district'

      const data = db.prepare(query).all(...params)
      res.status(200).json(data)
    } catch (error) {
      console.error('Database error:', error)
      res.status(500).json({ error: 'Failed to fetch map data' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

