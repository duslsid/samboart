import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { storageUrl } from '../lib/images.js'
import { uploadImage, removeFile } from './storageApi.js'
import UploadZone from './UploadZone.jsx'
import Notice from './Notice.jsx'

// table 의 사진 목록을 sort_order 순으로 보여주고, 업로드·삭제·드래그 순서 변경을 처리한다.
// match: 같은 묶음을 가르는 조건 (예: { subcategory: '일반곤도라' }). 새 행에도 같이 저장된다.
export default function PhotoManager({ table, folder, match = {}, hint }) {
  const [photos, setPhotos] = useState(null)
  const [notice, setNotice] = useState(null)
  const [progress, setProgress] = useState(null) // { total, done, current }
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)
  const matchKey = JSON.stringify(match)

  const load = useCallback(async () => {
    let q = supabase.from(table).select('*').order('sort_order')
    for (const [k, v] of Object.entries(match)) q = q.eq(k, v)
    const { data, error } = await q
    if (error) {
      setNotice({ type: 'error', text: '목록을 불러오지 못했습니다. 새로고침해 주세요.' })
      setPhotos([])
      return
    }
    setPhotos(data)
  }, [table, matchKey])

  useEffect(() => {
    setPhotos(null)
    setNotice(null)
    load()
  }, [load])

  const upload = async (files) => {
    setNotice(null)
    const failed = []
    let nextOrder = photos.reduce((m, p) => Math.max(m, p.sort_order), 0)
    setProgress({ total: files.length, done: 0, current: files[0].name })

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProgress({ total: files.length, done: i, current: file.name })
      let path = null
      try {
        path = await uploadImage(file, folder)
        nextOrder += 1
        const { error } = await supabase.from(table).insert({ file_path: path, sort_order: nextOrder, ...match })
        if (error) throw error
      } catch {
        if (path) removeFile(path).catch(() => {})
        failed.push(file.name)
      }
    }

    setProgress(null)
    await load()
    setNotice(
      failed.length === 0
        ? { type: 'ok', text: '업로드되었습니다' }
        : { type: 'error', text: '업로드에 실패했습니다. 다시 시도해 주세요.', files: failed }
    )
  }

  const remove = async (photo) => {
    if (!window.confirm('이 사진을 삭제할까요?')) return
    setNotice(null)
    try {
      await removeFile(photo.file_path)
      const { error } = await supabase.from(table).delete().eq('id', photo.id)
      if (error) throw error
      setNotice({ type: 'ok', text: '삭제되었습니다' })
    } catch {
      setNotice({ type: 'error', text: '삭제에 실패했습니다. 다시 시도해 주세요.' })
    }
    await load()
  }

  const drop = async (target) => {
    const from = dragIndex
    setDragIndex(null)
    setOverIndex(null)
    if (from === null || from === target) return
    const next = [...photos]
    const [moved] = next.splice(from, 1)
    next.splice(target, 0, moved)
    setPhotos(next)
    setNotice(null)
    try {
      const results = await Promise.all(
        next.map((p, i) =>
          p.sort_order === i + 1
            ? null
            : supabase.from(table).update({ sort_order: i + 1 }).eq('id', p.id)
        )
      )
      if (results.some((r) => r?.error)) throw new Error('reorder')
      setNotice({ type: 'ok', text: '순서가 저장되었습니다' })
    } catch {
      setNotice({ type: 'error', text: '순서 저장에 실패했습니다. 다시 시도해 주세요.' })
    }
    await load()
  }

  const busy = progress !== null

  return (
    <div>
      {hint && <p className="adm-hint">{hint}</p>}
      <UploadZone onFiles={upload} disabled={busy} />

      {progress && (
        <div className="adm-progress">
          <div className="bar"><div style={{ width: `${(progress.done / progress.total) * 100}%` }} /></div>
          <p>업로드 중… ({progress.done}/{progress.total}) {progress.current}</p>
        </div>
      )}

      <Notice notice={notice} />

      {photos === null ? (
        <p className="adm-hint">불러오는 중…</p>
      ) : photos.length === 0 ? (
        <p className="adm-hint">등록된 사진이 없습니다.</p>
      ) : (
        <>
          <p className="adm-hint">사진을 끌어서 순서를 바꿀 수 있습니다.</p>
          <ul className="adm-grid">
            {photos.map((p, i) => (
              <li key={p.id}
                draggable={!busy}
                className={`${dragIndex === i ? 'dragging' : ''}${overIndex === i && dragIndex !== i ? ' drop-target' : ''}`}
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => { if (dragIndex !== null) { e.preventDefault(); setOverIndex(i) } }}
                onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
                onDrop={(e) => { e.preventDefault(); drop(i) }}>
                <img src={storageUrl(p.file_path)} alt="" draggable={false} />
                <button type="button" className="adm-btn danger" disabled={busy} onClick={() => remove(p)}>삭제</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
