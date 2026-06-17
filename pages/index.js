import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

const categories = ['Branding', 'Web Design', 'Mobile', 'Graphic Design', 'Photography', 'Editorial']

export default function Home() {
  const [projects, setProjects] = useState([])
  const [fixed, setFixed] = useState({ intro: null, coda: null })
  const [selected, setSelected] = useState([])
  const [order, setOrder] = useState([])
  const [clientName, setClientName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [tab, setTab] = useState('projects')
  const [activeFilters, setActiveFilters] = useState([])
  const [draggedId, setDraggedId] = useState(null)
  const [projectCategories, setProjectCategories] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const fileRef = useRef()
  const introRef = useRef()
  const codaRef = useRef()

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', () => setIsMobile(window.innerWidth < 768))
    loadFiles()
  }, [])

  async function loadFiles() {
    setLoading(true)
    try {
      const res = await fetch('/api/list')
      const data = await res.json()
      setProjects(data.projects || [])
      setFixed(data.fixed || { intro: null, coda: null })
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function uploadFile(file, type) {
    const form = new FormData()
    form.append('file', file)
    form.append('type', type)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    return res.json()
  }

  async function handleProjectUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    for (const f of files) {
      await uploadFile(f, 'projects')
    }
    await loadFiles()
    setUploading(false)
  }

  async function handleFixedUpload(e, type) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    await uploadFile(file, 'fixed')
    await loadFiles()
    setUploading(false)
  }

  function toggleSelect(id) {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
      setOrder(order.filter(o => o !== id))
    } else {
      setSelected([...selected, id])
      setOrder([...order, id])
    }
  }

  function toggleFilter(cat) {
    setActiveFilters(prev =>
      prev.includes(cat) ? prev.filter(f => f !== cat) : [...prev, cat]
    )
  }

  const filteredProjects = activeFilters.length === 0
    ? projects
    : projects.filter(p => activeFilters.includes(projectCategories[p.id]))

  const orderedSelected = order
    .map(id => projects.find(p => p.id === id))
    .filter(Boolean)

  async function generatePDF() {
    if (!fixed.intro || !fixed.coda) return alert('Carica prima Intro e Coda!')
    if (selected.length === 0) return alert('Seleziona almeno un progetto!')
    if (!clientName) return alert('Inserisci il nome del cliente!')

    setLoading(true)

    const projectUrls = order.map(id => projects.find(p => p.id === id)?.url).filter(Boolean)

    const [y, m, d] = date.split('-')
    const filename = `FMF_${d}${m}${y}_Portfolio_${clientName.replace(/\s+/g, '_')}.pdf`

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        introUrl: fixed.intro,
        codaUrl: fixed.coda,
        projectUrls,
        filename,
      })
    })

    if (!res.ok) {
      alert('Errore nella generazione del PDF')
      setLoading(false)
      return
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    setLoading(false)
  }

  const s = {
    container: { fontFamily: 'system-ui, sans-serif', maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f9f9f7' },
    header: { padding: isMobile ? '10px 12px' : '12px 20px', background: '#fff', borderBottom: '0.5px solid #e0e0e0', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' },
    label: { fontSize: 11, fontWeight: 500, color: '#666', display: 'block', marginBottom: 3 },
    input: { padding: '6px 8px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13, width: '100%' },
    main: { display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row', gap: 0 },
    leftPanel: { width: isMobile ? '100%' : 300, flexShrink: 0, borderRight: '0.5px solid #e0e0e0', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' },
    rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    section: { padding: '12px 16px', borderBottom: '0.5px solid #f0f0f0' },
    sectionTitle: { fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    projectList: { flex: 1, overflowY: 'auto', padding: '8px 12px' },
    projectCard: (sel) => ({
      padding: '8px 10px', borderRadius: 6, marginBottom: 6, cursor: 'pointer',
      border: sel ? '1.5px solid #000' : '0.5px solid #e0e0e0',
      background: sel ? '#f0f0f0' : '#fff', fontSize: 12,
      display: 'flex', alignItems: 'center', gap: 8
    }),
    tab: (active) => ({
      padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
      borderBottom: active ? '2px solid #000' : '2px solid transparent',
      color: active ? '#000' : '#999'
    }),
    btn: (variant) => ({
      padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
      border: variant === 'primary' ? 'none' : '0.5px solid #ddd',
      background: variant === 'primary' ? '#000' : '#fff',
      color: variant === 'primary' ? '#fff' : '#333',
      opacity: loading ? 0.6 : 1
    }),
    fixedCard: (present) => ({
      padding: '10px 12px', borderRadius: 6, border: present ? '1px solid #22c55e' : '1px dashed #ddd',
      background: present ? '#f0fdf4' : '#fafafa', marginBottom: 8, fontSize: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'
    }),
    miniGrid: { display: 'flex', gap: 6, overflowX: 'auto', padding: '4px 0' },
    miniThumb: { flexShrink: 0, width: 60, aspectRatio: '16/9', background: '#111', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#fff' },
    filterTag: (active) => ({
      padding: '3px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer', border: 'none',
      background: active ? '#000' : '#f0f0f0', color: active ? '#fff' : '#666'
    }),
    orderBlock: { padding: '10px 12px', background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 6, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, cursor: 'grab', fontSize: 12 },
  }

  return (
    <>
      <Head><title>FMF Portfolio Builder</title></Head>
      <div style={s.container}>

        {/* HEADER */}
        <div style={s.header}>
          <div>
            <label style={s.label}>Nome cliente</label>
            <input style={{...s.input, width: isMobile ? '100%' : 180}} placeholder="Es: Acme Corp" value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div>
            <label style={s.label}>Data</label>
            <input type="date" style={{...s.input, width: 140}} value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <button style={s.btn('secondary')} onClick={loadFiles}>↻ Sincronizza</button>
            <button style={s.btn('primary')} onClick={generatePDF} disabled={loading}>
              {loading ? 'Generando...' : '↓ Scarica PDF'}
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div style={s.main}>

          {/* LEFT */}
          <div style={s.leftPanel}>

            {/* Fixed PDFs */}
            <div style={s.section}>
              <div style={s.sectionTitle}>Parti fisse</div>
              <div style={s.fixedCard(!!fixed.intro)} onClick={() => introRef.current.click()}>
                <span>{fixed.intro ? '✓ Intro.pdf' : '+ Carica Intro'}</span>
                {uploading && <span style={{color:'#999'}}>...</span>}
              </div>
              <div style={s.fixedCard(!!fixed.coda)} onClick={() => codaRef.current.click()}>
                <span>{fixed.coda ? '✓ Coda.pdf' : '+ Carica Coda'}</span>
              </div>
              <input ref={introRef} type="file" accept=".pdf" style={{display:'none'}} onChange={e => handleFixedUpload(e, 'intro')} />
              <input ref={codaRef} type="file" accept=".pdf" style={{display:'none'}} onChange={e => handleFixedUpload(e, 'coda')} />
            </div>

            {/* Filtri */}
            <div style={s.section}>
              <div style={s.sectionTitle}>Filtra</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {categories.map(c => (
                  <button key={c} style={s.filterTag(activeFilters.includes(c))} onClick={() => toggleFilter(c)}>{c}</button>
                ))}
              </div>
            </div>

            {/* Progetti */}
            <div style={{ padding: '8px 16px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={s.sectionTitle}>Progetti ({projects.length})</span>
              <button style={{...s.btn('secondary'), padding: '4px 8px', fontSize: 11}} onClick={() => fileRef.current.click()}>
                {uploading ? '...' : '+ Aggiungi'}
              </button>
              <input ref={fileRef} type="file" accept=".pdf" multiple style={{display:'none'}} onChange={handleProjectUpload} />
            </div>

            <div style={s.projectList}>
              {loading && <div style={{textAlign:'center', color:'#999', padding: 20}}>Caricando...</div>}
              {filteredProjects.map(proj => (
                <div key={proj.id} style={s.projectCard(selected.includes(proj.id))} onClick={() => toggleSelect(proj.id)}>
                  <div style={{width:8, height:8, borderRadius:'50%', background: selected.includes(proj.id) ? '#000' : '#ddd', flexShrink:0}} />
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{proj.name}</div>
                  </div>
                </div>
              ))}
              {!loading && projects.length === 0 && (
                <div style={{textAlign:'center', color:'#999', padding: 20, fontSize: 12}}>
                  Nessun progetto.<br/>Clicca "+ Aggiungi" per caricare i tuoi PDF.
                </div>
              )}
            </div>

            {/* Miniature ordine */}
            {orderedSelected.length > 0 && (
              <div style={{ padding: '8px 12px', borderTop: '0.5px solid #f0f0f0' }}>
                <div style={s.sectionTitle}>Ordine ({orderedSelected.length})</div>
                <div style={s.miniGrid}>
                  {orderedSelected.map(p => (
                    <div key={p.id} style={s.miniThumb} title={p.name}>
                      <span style={{fontSize:7, padding:2, textAlign:'center'}}>{p.name.slice(0,6)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={s.rightPanel}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '0.5px solid #e0e0e0', background: '#fff', padding: '0 16px' }}>
              {['projects', 'reorder'].map(t => (
                <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>
                  {t === 'projects' ? 'Anteprima' : 'Riordina'}
                </button>
              ))}
            </div>

            {/* Anteprima */}
            {tab === 'projects' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {/* Intro */}
                <div style={{ background: '#111', color: '#fff', aspectRatio: '16/9', borderRadius: 6, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                  {fixed.intro
                    ? <><span style={{fontSize:11, opacity:0.5}}>Intro.pdf</span><span style={{fontSize:13, fontWeight:500}}>Francesco Maria Falcone</span></>
                    : <span style={{fontSize:12, opacity:0.4}}>Carica Intro.pdf</span>
                  }
                </div>

                {/* Progetti selezionati */}
                {orderedSelected.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#999', padding: 40, fontSize: 12 }}>
                    Seleziona i progetti dalla lista a sinistra
                  </div>
                )}
                {orderedSelected.map((proj, i) => (
                  <div key={proj.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>{i + 1}. {proj.name}</div>
                    <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', aspectRatio: '16/9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 12, color: '#ccc' }}>{proj.name}</span>
                    </div>
                  </div>
                ))}

                {/* Coda */}
                <div style={{ background: '#111', color: '#fff', aspectRatio: '16/9', borderRadius: 6, marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                  {fixed.coda
                    ? <><span style={{fontSize:11, opacity:0.5}}>Coda.pdf</span><span style={{fontSize:13, fontWeight:500}}>Grazie</span></>
                    : <span style={{fontSize:12, opacity:0.4}}>Carica Coda.pdf</span>
                  }
                </div>
              </div>
            )}

            {/* Riordina */}
            {tab === 'reorder' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {orderedSelected.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#999', padding: 40, fontSize: 12 }}>
                    Seleziona i progetti per riordinarli
                  </div>
                )}
                {orderedSelected.map((proj, i) => (
                  <div
                    key={proj.id}
                    draggable
                    onDragStart={() => setDraggedId(proj.id)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => {
                      const from = order.indexOf(draggedId)
                      const to = order.indexOf(proj.id)
                      if (from !== to) {
                        const newOrder = [...order]
                        newOrder.splice(from, 1)
                        newOrder.splice(to, 0, draggedId)
                        setOrder(newOrder)
                      }
                    }}
                    style={s.orderBlock}
                  >
                    <span style={{ color: '#ccc', fontSize: 16 }}>≡</span>
                    <span style={{ flex: 1, fontWeight: 500 }}>{proj.name}</span>
                    <span style={{ fontSize: 11, background: '#f0f0f0', padding: '2px 8px', borderRadius: 10 }}>#{i + 1}</span>
                    <button
                      onClick={() => toggleSelect(proj.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 16 }}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
