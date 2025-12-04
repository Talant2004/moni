import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = req.body

      const name = body.name || ''
      const name_kk = body.name_kk || ''
      const layer_type = body.layer_type || 'polygon'
      const year = body.year ? parseInt(body.year) : null
      const season = body.season || null
      const visible = body.visible === true || body.visible === 'true'
      const color = body.color || '#00FF00'
      const opacity = body.opacity ? parseFloat(body.opacity) : 0.7
      const animation_start = body.animation_start || null
      const animation_end = body.animation_end || null
      const kml_data = body.kml_data || null

      const result = await query(`
        INSERT INTO map_layers (name, name_kk, layer_type, year, season, visible, color, opacity, animation_start, animation_end, kml_data)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `, [
        name,
        name_kk || null,
        layer_type,
        year,
        season,
        visible,
        color,
        opacity,
        animation_start || null,
        animation_end || null,
        kml_data || null
      ])

      res.status(200).json({ success: true, id: result.rows[0].id })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to create map layer' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

