import { put } from '@vercel/blob'
import multiparty from 'multiparty'
import fs from 'fs'

export const config = {
  api: { bodyParser: false }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const form = new multiparty.Form()

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message })

    const file = files.file?.[0]
    const type = fields.type?.[0] || 'projects'

    if (!file) return res.status(400).json({ error: 'No file' })

    const buffer = fs.readFileSync(file.path)
    const filename = file.originalFilename
    const blobPath = `${type}/${filename}`

    const blob = await put(blobPath, buffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
    })

    res.status(200).json({
      url: blob.url,
      name: filename,
      type,
    })
  })
}
