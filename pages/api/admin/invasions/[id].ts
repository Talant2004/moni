import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      // Delete related records first
      await query('DELETE FROM invasion_links WHERE invasion_id = $1', [id])
      await query('DELETE FROM invasion_photos WHERE invasion_id = $1', [id])
      
      // Delete invasion
      await query('DELETE FROM invasions WHERE id = $1', [id])
      
      res.status(200).json({ success: true })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to delete invasion' })
    }
  } else if (req.method === 'PUT') {
    try {
      const body = req.body

      await query(`
        UPDATE invasions 
        SET title = $1, title_kk = $2, description = $3, description_kk = $4,
            full_text = $5, full_text_kk = $6, region = $7, region_kk = $8,
            year = $9
        WHERE id = $10
      `, [
        body.title,
        body.title_kk || null,
        body.description || null,
        body.description_kk || null,
        body.full_text || null,
        body.full_text_kk || null,
        body.region,
        body.region_kk || null,
        body.year,
        id
      ])

      res.status(200).json({ success: true })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to update invasion' })
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

