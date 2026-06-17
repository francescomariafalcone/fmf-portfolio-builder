import { PDFDocument } from 'pdf-lib'

export const config = {
  api: { bodyParser: { sizeLimit: '100mb' } }
}

async function fetchPdf(url) {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  return buffer
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { introUrl, codaUrl, projectUrls } = req.body

  if (!introUrl || !codaUrl || !projectUrls?.length) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const finalPdf = await PDFDocument.create()

    // 1. Intro
    const introBytes = await fetchPdf(introUrl)
    const introDoc = await PDFDocument.load(introBytes)
    const introPages = await finalPdf.copyPages(introDoc, introDoc.getPageIndices())
    introPages.forEach(p => finalPdf.addPage(p))

    // 2. Progetti in ordine
    for (const url of projectUrls) {
      const projBytes = await fetchPdf(url)
      const projDoc = await PDFDocument.load(projBytes)
      const projPages = await finalPdf.copyPages(projDoc, projDoc.getPageIndices())
      projPages.forEach(p => finalPdf.addPage(p))
    }

    // 3. Coda
    const codaBytes = await fetchPdf(codaUrl)
    const codaDoc = await PDFDocument.load(codaBytes)
    const codaPages = await finalPdf.copyPages(codaDoc, codaDoc.getPageIndices())
    codaPages.forEach(p => finalPdf.addPage(p))

    const pdfBytes = await finalPdf.save()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${req.body.filename || 'portfolio.pdf'}"`)
    res.send(Buffer.from(pdfBytes))

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
