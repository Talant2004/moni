import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = req.body

      const name = body.name || ''
      const name_kk = body.name_kk || ''
      const prep_type = body.prep_type || ''
      const dosage = body.dosage || ''
      const description = body.description || ''
      const description_kk = body.description_kk || ''
      const active_substance = body.active_substance || ''
      const active_substance_kk = body.active_substance_kk || ''
      const application_method = body.application_method || ''
      const application_method_kk = body.application_method_kk || ''

      // Insert preparation
      const result = await query(`
        INSERT INTO preparations (name, description, active_substance, application_method, name_kk, description_kk, active_substance_kk, application_method_kk)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        name,
        description,
        active_substance,
        application_method,
        name_kk || null,
        description_kk || null,
        active_substance_kk || null,
        application_method_kk || null
      ])

      const prepId = result.rows[0].id

      // Insert photos (base64 data)
      if (body.photos && Array.isArray(body.photos)) {
        for (const photoData of body.photos) {
          if (photoData && typeof photoData === 'string') {
            await query(`
              INSERT INTO preparation_photos (preparation_id, photo_path)
              VALUES ($1, $2)
            `, [prepId, photoData])
          }
        }
      }

      // Insert links
      if (body.links && Array.isArray(body.links)) {
        for (const link of body.links) {
          if (link.title && link.url) {
            await query(`
              INSERT INTO preparation_links (preparation_id, title, url)
              VALUES ($1, $2, $3)
            `, [prepId, link.title, link.url])
          }
        }
      }

      res.status(200).json({ success: true, id: prepId })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to create preparation' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

