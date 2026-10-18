import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { storageUrl } from '../lib/images.js'
import { uploadImage, removeFile } from './storageApi.js'
import UploadZone from './UploadZone.jsx'
import Notice from './Notice.jsx'

const BLANK = { is_active: false, type: 'text', title: '', content: '', image_path: '' }

// 팝업 공지(popup_notice) 한 줄 편집
export default function PopupEditor() {
  const [id, setId] = useState(null)
  const [saved, setSaved] = useState(null) // 마지막으로 저장된 값
  const [form, setForm] = useState(null)
  const [notice, setNotice] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.from('popup_notice').select('*').order('id').limit(1).maybeSingle().then(({ data, error }) => {
      if (error) setNotice({ type: 'error', text: '팝업 설정을 불러오지 못했습니다. 새로고침해 주세요.' })
      const row = { ...BLANK, ...(data || {}) }
      for (const k of Object.keys(BLANK)) if (row[k] === null) row[k] = BLANK[k]
      setId(data?.id ?? null)
      setSaved(row)
      setForm(row)
    })
  }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const pickImage = async (files) => {
    setBusy(true)
    setNotice(null)
    try {
      const path = await uploadImage(files[0], 'popup')
      if (form.image_path && form.image_path !== saved.image_path) removeFile(form.image_path).catch(() => {})
      set('image_path', path)
      setNotice({ type: 'ok', text: '업로드되었습니다. 아래 "저장"을 눌러야 적용됩니다.' })
    } catch {
      setNotice({ type: 'error', text: '업로드에 실패했습니다. 다시 시도해 주세요.', files: [files[0].name] })
    }
    setBusy(false)
  }

  const save = async () => {
    setBusy(true)
    setNotice(null)
    const payload = {
      is_active: form.is_active,
      type: form.type,
      title: form.title,
      content: form.content,
      image_path: form.image_path || null,
    }
    const { data, error } = id
      ? await supabase.from('popup_notice').update(payload).eq('id', id).select().maybeSingle()
      : await supabase.from('popup_notice').insert(payload).select().maybeSingle()
    if (error) {
      setNotice({ type: 'error', text: '저장에 실패했습니다. 다시 시도해 주세요.' })
    } else {
      if (saved.image_path && saved.image_path !== form.image_path) removeFile(saved.image_path).catch(() => {})
      if (data?.id) setId(data.id)
      setSaved(form)
      setNotice({ type: 'ok', text: '저장되었습니다' })
    }
    setBusy(false)
  }

  if (!form) return <p className="adm-hint">불러오는 중…</p>

  return (
    <div className="adm-form">
      <label className="adm-check">
        <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} />
        팝업 표시 (켜면 메인 페이지에 팝업이 뜹니다)
      </label>

      <div className="adm-row">
        <label className="adm-check">
          <input type="radio" name="ptype" checked={form.type === 'text'} onChange={() => set('type', 'text')} />
          글 팝업
        </label>
        <label className="adm-check">
          <input type="radio" name="ptype" checked={form.type === 'image'} onChange={() => set('type', 'image')} />
          이미지 팝업
        </label>
      </div>

      {form.type === 'text' ? (
        <>
          <label>제목
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </label>
          <label>내용
            <textarea className="adm-textarea" rows={6} value={form.content}
              onChange={(e) => set('content', e.target.value)} />
          </label>
        </>
      ) : (
        <div>
          {form.image_path && <img className="adm-popup-img" src={storageUrl(form.image_path)} alt="" />}
          <UploadZone multiple={false} disabled={busy} label={form.image_path ? '이미지 바꾸기' : '이미지 올리기'}
            onFiles={pickImage} />
        </div>
      )}

      <Notice notice={notice} />
      <button type="button" className="adm-btn primary" disabled={busy} onClick={save}>저장</button>
    </div>
  )
}
