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

      await query(`
        INSERT INTO preparations (name, description, active_substance, application_method, name_kk, description_kk, active_substance_kk, application_method_kk)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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

      res.status(200).json({ success: true })
    } catch (error: any) {
      console.error('Database error:', error)
      res.status(500).json({ error: error.message || 'Failed to create preparation' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

