import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = req.body

      const title = body.title || ''
      const title_kk = body.title_kk || ''
      const year = parseInt(body.year)
      const season = body.season || 'spring'
      const region = body.region || ''
      const district = body.district || ''
      const description = body.description || ''
      const description_kk = body.description_kk || ''
      const full_text = body.full_text || ''
      const full_text_kk = body.full_text_kk || ''
      const latitude = body.latitude ? parseFloat(body.latitude) : null
      const longitude = body.longitude ? parseFloat(body.longitude) : null
      const threat_level = body.threat_level === true || body.threat_level === 'true'
      const treated_area = body.treated_area === true || body.treated_area === 'true'
      const temperature = body.temperature ? parseFloat(body.temperature) : null
      const precipitation = body.precipitation ? parseFloat(body.precipitation) : null
      const humidity = body.humidity ? parseFloat(body.humidity) : null
      const wind_speed = body.wind_speed ? parseFloat(body.wind_speed) : null

      // Insert invasion
      const result = await query(`
        INSERT INTO invasions (year, title, description, full_text, region, title_kk, description_kk, full_text_kk, region_kk)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [year, title, description, full_text, region, title_kk || null, description_kk || null, full_text_kk || null, null])

      const invasionId = result.rows[0].id

      // Insert photos (base64 data)
      if (body.photos && Array.isArray(body.photos)) {
        for (const photoData of body.photos) {
          if (photoData && typeof photoData === 'string') {
            await query(`
              INSERT INTO invasion_photos (invasion_id, photo_path)
              VALUES ($1, $2)
            `, [invasionId, photoData])
          }
        }
      }

      // Insert links
      if (body.links && Array.isArray(body.links)) {
        for (const link of body.links) {
          if (link.title && link.url) {
            await query(`
              INSERT INTO invasion_links (invasion_id, title, url)
              VALUES ($1, $2, $3)
            `, [invasionId, link.title, link.url])
          }
        }
      }

      // Insert map data if coordinates provided
      if (latitude && longitude) {
        await query(`
          INSERT INTO map_data (region, district, year, season, latitude, longitude, threat_level, treated_area, temperature, precipitation, humidity, wind_speed)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          region,
          district,
          year,
          season,
          latitude,
          longitude,
          threat_level ? 1 : 0,
          treated_area ? 1 : 0,
          temperature,
          precipitation,
          humidity,
          wind_speed
        ])
      }

      res.status(200).json({ success: true, id: invasionId })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to create invasion' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

