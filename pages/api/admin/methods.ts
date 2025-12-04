import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = req.body

      const name = body.name || ''
      const name_kk = body.name_kk || ''
      const description = body.description || ''
      const description_kk = body.description_kk || ''
      const video_url = body.video_url || ''

      // Insert method
      const result = await query(`
        INSERT INTO methods (name, name_kk, description, description_kk, video_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [
        name,
        name_kk || null,
        description || null,
        description_kk || null,
        video_url || null
      ])

      const methodId = result.rows[0].id

      // Insert photos (base64 data)
      if (body.photos && Array.isArray(body.photos)) {
        for (const photoData of body.photos) {
          if (photoData && typeof photoData === 'string') {
            await query(`
              INSERT INTO method_photos (method_id, photo_path)
              VALUES ($1, $2)
            `, [methodId, photoData])
          }
        }
      }

      // Insert links
      if (body.links && Array.isArray(body.links)) {
        for (const link of body.links) {
          if (link.title && link.url) {
            await query(`
              INSERT INTO method_links (method_id, title, url)
              VALUES ($1, $2, $3)
            `, [methodId, link.title, link.url])
          }
        }
      }

      res.status(200).json({ success: true, id: methodId })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to create method' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

