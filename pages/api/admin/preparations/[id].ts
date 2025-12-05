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

      // Delete existing photos and links
      await query('DELETE FROM preparation_photos WHERE preparation_id = $1', [id])
      await query('DELETE FROM preparation_links WHERE preparation_id = $1', [id])

      // Insert new photos (base64 data)
      if (body.photos && Array.isArray(body.photos)) {
        for (const photoData of body.photos) {
          if (photoData && typeof photoData === 'string') {
            await query(`
              INSERT INTO preparation_photos (preparation_id, photo_path)
              VALUES ($1, $2)
            `, [id, photoData])
          }
        }
      }

      // Insert new links
      if (body.links && Array.isArray(body.links)) {
        for (const link of body.links) {
          if (link.title && link.url) {
            await query(`
              INSERT INTO preparation_links (preparation_id, title, url)
              VALUES ($1, $2, $3)
            `, [id, link.title, link.url])
          }
        }
      }

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

