import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      // Delete related records first
      await query('DELETE FROM preparation_links WHERE preparation_id = $1', [id])
      await query('DELETE FROM preparation_photos WHERE preparation_id = $1', [id])
      
      // Delete preparation
      await query('DELETE FROM preparations WHERE id = $1', [id])
      res.status(200).json({ success: true })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to delete preparation' })
    }
  } else if (req.method === 'PUT') {
    try {
      const body = req.body

      await query(`
        UPDATE preparations 
        SET name = $1, name_kk = $2, description = $3, description_kk = $4,
            active_substance = $5, active_substance_kk = $6,
            application_method = $7, application_method_kk = $8
        WHERE id = $9
      `, [
        body.name,
        body.name_kk || null,
        body.description || null,
        body.description_kk || null,
        body.active_substance || null,
        body.active_substance_kk || null,
        body.application_method || null,
        body.application_method_kk || null,
        id
      ])

      res.status(200).json({ success: true })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to update preparation' })
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

