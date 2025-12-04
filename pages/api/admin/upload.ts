import type { NextApiRequest, NextApiResponse } from 'next'

// File upload handler - accepts base64 data
// For Vercel compatibility, we store base64 in database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { fileData, fileName, fileType } = req.body

      if (!fileData) {
        res.status(400).json({ error: 'No file data provided' })
        return
      }

      // Return base64 data path (stored in database)
      // Format: data:image/jpeg;base64,/9j/4AAQSkZJRg...
      const filePath = fileData // Store base64 directly

      res.status(200).json({ 
        success: true, 
        path: filePath,
        filename: fileName || 'file'
      })
    } catch (error: any) {
      console.error('Upload error:', error)
      res.status(500).json({ error: error.message || 'Failed to process file upload' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

