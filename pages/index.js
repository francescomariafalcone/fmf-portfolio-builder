import { useState, useEffect } from 'react'

export default function Home() {
  const [clientName, setClientName] = useState('Acme Corp')
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0])
  const [projects, setProjects] = useState([
    { id: 'proj1', name: 'Branding Acme', category: 'Branding', pages: 4, color: '#fff3e0' },
    { id: 'proj2', name: 'Website E-commerce', category: 'Web Design', pages: 5, color: '#f3e5f5' },
    { id: 'proj3', name: 'Mobile App', category: 'Mobile', pages: 3, color: '#e8f5e9' },
    { id: 'proj4', name: 'Print Campaign', category: 'Branding', pages: 2, color: '#fbe9e7' },
    { id: 'proj5', name: 'Social Media', category: 'Graphic Design', pages: 3, color: '#f1f8e9' },
  ])

  const categories = ['Branding', 'Web Design', 'Mobile', 'Graphic Design']

  const [selections, setSelections] = useState(new Map())
  const [filtered, setFiltered] = useState(new Set())
  const [order, setOrder] = useState(projects.map(p => p.id))
  const [draggedItem, setDraggedItem] = useState(null)
  const [currentTab, setCurrentTab] = useState('preview')
  const [introContent, setIntroContent] = useState('FMF Portfolio\nfor [NOME CLIENTE]')
  const [codaContent, setCodaContent] = useState('Grazie per l\'attenzione\n© 2025 FMF Design')

  useEffect(() => {
    const newSelections = new Map()
    projects.forEach(p => {
      newSelections.set(p.id, { pages: Array.from({ length: p.pages }, (_, i) => i + 1) })
    })
    setSelections(newSelections)
  }, [])

  const getFilteredProjects = () => {
    if (filtered.size === 0) return projects
    return projects.filter(p => filtered.has(p.category))
  }

  const toggleFilter = (cat) => {
    const newFiltered = new Set(filtered)
    if (newFiltered.has(cat)) {
      newFiltered.delete(cat)
    } else {
      newFiltered.add(cat)
    }
    setFiltered(newFiltered)
  }

  const toggleProject = (projId, checked) => {
    const proj = projects.find(p => p.id === projId)
    const newSelections = new Map(selections)
    if (checked) {
      newSelections.set(projId, { pages: Array.from({ length: proj.pages }, (_, i) => i + 1) })
    } else {
      newSelections.set(projId, { pages: [] })
    }
    setSelections(newSelections)
  }

  const generatePagePreview = (projId, pageNum) => {
    const proj = projects.find(p => p.id === projId)
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 450
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = proj.color
    ctx.fillRect(0, 0, 800, 450)
    ctx.strokeStyle = '#999'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, 800, 450)

    ctx.fillStyle = '#333'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(proj.name, 400, 180)

    ctx.font = '16px sans-serif'
    ctx.fillStyle = '#666'
    ctx.fillText(`p. ${pageNum}`, 400, 250)

    return canvas.toDataURL('image/png')
  }

  const downloadPDF = async () => {
    const clientDisplay = clientName.replace(/\s+/g, '_')
    const [year, month, day] = dateInput.split('-')
    const fileName = `FMF_${day}${month}${year}_Portfolio_${clientDisplay}.pdf`

    // Placeholder: In production, questo chiamerà l'API /api/generate-pdf
    alert(`PDF verrà scaricato come: ${fileName}\n\nIn fase di sviluppo locale, usa npm run dev`)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '12px', height: '100vh', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
      {/* HEADER */}
      <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f5f5f5', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: '500' }}>Nome cliente</label>
          <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: '100%', padding: '6px 8px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: '500' }}>Data</label>
          <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} style={{ width: '100%', padding: '6px 8px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: '500' }}>Font custom (opz.)</label>
          <input type="file" accept=".ttf,.otf,.woff" style={{ width: '100%', fontSize: '12px' }} />
        </div>
        <button onClick={downloadPDF} style={{ padding: '8px 12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
          Download PDF
        </button>
      </div>

      {/* MAIN */}
      <div style={{ display: 'flex', gap: '12px', flex: 1, overflow: 'hidden' }}>
        {/* LEFT */}
        <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
          {/* Editors */}
          <div style={{ backgroundColor: '#000', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '12px' }}>
            <div style={{ fontSize: '10px', opacity: '0.7', marginBottom: '8px' }}>INTRODUZIONE</div>
            <div contentEditable suppressContentEditableWarning style={{ minHeight: '60px', fontSize: '13px', lineHeight: '1.5', outline: 'none' }} onInput={(e) => setIntroContent(e.currentTarget.textContent)}>
              {introContent}
            </div>
          </div>

          <div style={{ backgroundColor: '#000', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '12px' }}>
            <div style={{ fontSize: '10px', opacity: '0.7', marginBottom: '8px' }}>CODA</div>
            <div contentEditable suppressContentEditableWarning style={{ minHeight: '60px', fontSize: '13px', lineHeight: '1.5', outline: 'none' }} onInput={(e) => setCodaContent(e.currentTarget.textContent)}>
              {codaContent}
            </div>
          </div>

          {/* Filters */}
          <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '10px' }}>Filtra</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => toggleFilter(cat)} style={{ padding: '4px 10px', fontSize: '11px', border: filtered.has(cat) ? '1px solid #0070f3' : '1px solid #ddd', backgroundColor: filtered.has(cat) ? '#0070f3' : '#fff', color: filtered.has(cat) ? '#fff' : '#000', borderRadius: '4px', cursor: 'pointer' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div style={{ flex: '1 1 auto', border: '1px solid #ddd', padding: '12px', borderRadius: '8px', overflow: 'auto' }}>
            <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '10px' }}>Progetti</div>
            {getFilteredProjects().map(proj => (
              <div key={proj.id} style={{ marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" checked={selections.get(proj.id)?.pages.length > 0} onChange={(e) => toggleProject(proj.id, e.target.checked)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>{proj.name}</div>
                    <div style={{ fontSize: '10px', opacity: '0.6' }}>{proj.category} • {proj.pages}p</div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
          {/* TABS */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #ddd' }}>
            <button onClick={() => setCurrentTab('preview')} style={{ padding: '8px 12px', border: 'none', backgroundColor: 'transparent', borderBottom: currentTab === 'preview' ? '2px solid #0070f3' : 'transparent', color: currentTab === 'preview' ? '#0070f3' : '#666', fontWeight: '500', cursor: 'pointer', fontSize: '12px' }}>
              Anteprima
            </button>
            <button onClick={() => setCurrentTab('reorder')} style={{ padding: '8px 12px', border: 'none', backgroundColor: 'transparent', borderBottom: currentTab === 'reorder' ? '2px solid #0070f3' : 'transparent', color: currentTab === 'reorder' ? '#0070f3' : '#666', fontWeight: '500', cursor: 'pointer', fontSize: '12px' }}>
              Riordina
            </button>
          </div>

          {/* PREVIEW */}
          {currentTab === 'preview' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
              {/* Intro */}
              <div style={{ backgroundColor: '#000', color: '#fff', padding: '40px', textAlign: 'center', marginBottom: '16px', borderRadius: '4px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>FMF Portfolio</div>
                <div style={{ fontSize: '24px' }}>for {clientName || '[NOME CLIENTE]'}</div>
                <div style={{ fontSize: '12px', marginTop: '16px', opacity: '0.6' }}>{dateInput}</div>
              </div>

              {/* Projects */}
              {order.map(projId => {
                const proj = projects.find(p => p.id === projId)
                const sel = selections.get(projId)
                if (!sel || sel.pages.length === 0) return null
                return (
                  <div key={projId}>
                    <div style={{ fontWeight: '500', fontSize: '12px', marginBottom: '8px', opacity: '0.6' }}>{proj.name}</div>
                    {sel.pages.map(pageNum => (
                      <div key={pageNum} style={{ aspectRatio: '16/9', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                        <img src={generatePagePreview(projId, pageNum)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`${proj.name} p${pageNum}`} />
                      </div>
                    ))}
                  </div>
                )
              })}

              {/* Coda */}
              <div style={{ backgroundColor: '#000', color: '#fff', padding: '40px', textAlign: 'center', marginTop: '16px', borderRadius: '4px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', whiteSpace: 'pre-wrap' }}>
                {codaContent}
              </div>
            </div>
          )}

          {/* REORDER */}
          {currentTab === 'reorder' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
              {order.map((projId, idx) => {
                const proj = projects.find(p => p.id === projId)
                const sel = selections.get(projId)
                if (!sel || sel.pages.length === 0) return null
                return (
                  <div key={projId} draggable onDragStart={() => setDraggedItem(projId)} onDragOver={(e) => e.preventDefault()} onDrop={() => {
                    const dragIdx = order.indexOf(draggedItem)
                    const targetIdx = order.indexOf(projId)
                    if (dragIdx !== targetIdx) {
                      const newOrder = [...order]
                      newOrder.splice(dragIdx, 1)
                      newOrder.splice(targetIdx, 0, draggedItem)
                      setOrder(newOrder)
                    }
                  }} style={{ padding: '10px', marginBottom: '8px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'grab', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                    <span>≡</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{proj.name}</div>
                      <div style={{ fontSize: '10px', opacity: '0.6' }}>{sel.pages.length}p</div>
                    </div>
                    <div style={{ fontSize: '10px', backgroundColor: '#0070f3', color: '#fff', padding: '2px 6px', borderRadius: '3px' }}>#{idx + 1}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* BUTTONS */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={downloadPDF} style={{ flex: 1, padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '500', cursor: 'pointer' }}>
              Scarica PDF
            </button>
            <button onClick={() => {
              setOrder(projects.map(p => p.id))
              const newSelections = new Map()
              projects.forEach(p => {
                newSelections.set(p.id, { pages: Array.from({ length: p.pages }, (_, i) => i + 1) })
              })
              setSelections(newSelections)
            }} style={{ padding: '10px 12px', border: '1px solid #ddd', backgroundColor: '#fff', borderRadius: '4px', fontWeight: '500', cursor: 'pointer' }}>
              Azzera
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
