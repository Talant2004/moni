import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      await query('DELETE FROM map_layers WHERE id = $1', [id])
      res.status(200).json({ success: true })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to delete map layer' })
    }
  } else if (req.method === 'PUT') {
    try {
      const body = req.body

      await query(`
        UPDATE map_layers 
        SET name = $1, name_kk = $2, layer_type = $3, year = $4, season = $5,
            visible = $6, color = $7, opacity = $8,
            animation_start = $9, animation_end = $10, kml_data = $11
        WHERE id = $12
      `, [
        body.name,
        body.name_kk || null,
        body.layer_type,
        body.year || null,
        body.season || null,
        body.visible || false,
        body.color || '#00FF00',
        body.opacity || 0.7,
        body.animation_start || null,
        body.animation_end || null,
        body.kml_data || null,
        id
      ])

      res.status(200).json({ success: true })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to update map layer' })
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

