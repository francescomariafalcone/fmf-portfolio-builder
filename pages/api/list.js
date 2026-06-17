import { list } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { blobs: projectBlobs } = await list({ prefix: 'projects/' })
  const { blobs: fixedBlobs } = await list({ prefix: 'fixed/' })

  const projects = projectBlobs.map(b => ({
    id: b.pathname,
    name: b.pathname.replace('projects/', '').replace('.pdf', ''),
    url: b.url,
    size: b.size,
    uploadedAt: b.uploadedAt,
  }))

  const fixed = {
    intro: fixedBlobs.find(b => b.pathname.includes('Intro'))?.url || null,
    coda: fixedBlobs.find(b => b.pathname.includes('Coda'))?.url || null,
  }

  res.status(200).json({ projects, fixed })
}
