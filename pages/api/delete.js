import { del } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end()
  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'No url' })
  await del(url)
  res.status(200).json({ success: true })
}
