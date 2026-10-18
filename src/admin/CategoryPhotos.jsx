import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { storageUrl } from '../lib/images.js'
import { CATEGORIES } from '../data/categories.js'
import { uploadImage, removeFile } from './storageApi.js'
import UploadZone from './UploadZone.jsx'
import Notice from './Notice.jsx'

// 대분류당 대표 사진 1장 (category_photos). 올리면 기존 사진을 교체한다.
export default function CategoryPhotos() {
  const [rows, setRows] = useState(null)
  const [notice, setNotice] = useState(null)
  const [busy, setBusy] = useState(null) // 작업 중인 대분류 이름

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('category_photos').select('*')
    if (error) setNotice({ type: 'error', text: '목록을 불러오지 못했습니다. 새로고침해 주세요.' })
    setRows(data || [])
  }, [])

  useEffect(() => { load() }, [load])

  const byCategory = Object.fromEntries((rows || []).map((r) => [r.category, r]))

  const replace = async (category, file) => {
    setNotice(null)
    setBusy(category)
    const old = byCategory[category]
    let path = null
    try {
      path = await uploadImage(file, 'categories')
      const { error } = old
        ? await supabase.from('category_photos').update({ file_path: path }).eq('id', old.id)
        : await supabase.from('category_photos').insert({ category, file_path: path })
      if (error) throw error
      if (old) removeFile(old.file_path).catch(() => {})
      setNotice({ type: 'ok', text: '업로드되었습니다' })
    } catch {
      if (path) removeFile(path).catch(() => {})
      setNotice({ type: 'error', text: '업로드에 실패했습니다. 다시 시도해 주세요.', files: [file.name] })
    }
    setBusy(null)
    await load()
  }

  const remove = async (category) => {
    const row = byCategory[category]
    if (!row || !window.confirm('이 사진을 삭제할까요?')) return
    setNotice(null)
    setBusy(category)
    try {
      await removeFile(row.file_path)
      const { error } = await supabase.from('category_photos').delete().eq('id', row.id)
      if (error) throw error
      setNotice({ type: 'ok', text: '삭제되었습니다' })
    } catch {
      setNotice({ type: 'error', text: '삭제에 실패했습니다. 다시 시도해 주세요.' })
    }
    setBusy(null)
    await load()
  }

  return (
    <div>
      <p className="adm-hint">대분류마다 대표 사진 1장입니다. 새로 올리면 기존 사진이 바뀝니다. (메인 페이지 제품 카테고리 카드에 사용)</p>
      <Notice notice={notice} />
      {rows === null ? <p className="adm-hint">불러오는 중…</p> : (
        <ul className="adm-cats">
          {CATEGORIES.map((c) => {
            const row = byCategory[c.name]
            return (
              <li key={c.slug}>
                <strong>{c.name}</strong>
                {row ? <img src={storageUrl(row.file_path)} alt="" /> : <div className="adm-empty">사진 없음</div>}
                <UploadZone multiple={false} disabled={busy === c.name}
                  label={row ? '새 사진으로 바꾸기' : '사진 올리기'}
                  onFiles={(files) => replace(c.name, files[0])} />
                {row && (
                  <button type="button" className="adm-btn danger" disabled={busy === c.name}
                    onClick={() => remove(c.name)}>삭제</button>
                )}
                {busy === c.name && <p className="adm-hint">처리 중…</p>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
