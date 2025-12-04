import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      // Delete related records first
      await query('DELETE FROM method_links WHERE method_id = $1', [id])
      await query('DELETE FROM method_photos WHERE method_id = $1', [id])
      
      // Delete method
      await query('DELETE FROM methods WHERE id = $1', [id])
      
      res.status(200).json({ success: true })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to delete method' })
    }
  } else if (req.method === 'PUT') {
    try {
      const body = req.body

      await query(`
        UPDATE methods 
        SET name = $1, name_kk = $2, description = $3, description_kk = $4,
            video_url = $5
        WHERE id = $6
      `, [
        body.name,
        body.name_kk || null,
        body.description || null,
        body.description_kk || null,
        body.video_url || null,
        id
      ])

      res.status(200).json({ success: true })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to update method' })
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

