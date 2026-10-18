import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { CATEGORIES } from '../data/categories.js'
import Notice from './Notice.jsx'

// 중분류 32개의 설명을 한 화면의 표에서 입력하고 한 번에 저장한다.
const ROWS = CATEGORIES.flatMap((c) =>
  c.subs.map((s, i) => ({ category: c.name, sub: s.name, first: i === 0, span: c.subs.length }))
)

export default function SubDescriptionTable() {
  const [original, setOriginal] = useState(null) // { 중분류: 설명 }
  const [values, setValues] = useState({})
  const [notice, setNotice] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('subcategory_info').select('subcategory, description').then(({ data, error }) => {
      if (error) setNotice({ type: 'error', text: '설명을 불러오지 못했습니다. 새로고침해 주세요.' })
      const map = Object.fromEntries(ROWS.map((r) => [r.sub, '']))
      for (const row of data || []) if (row.subcategory in map) map[row.subcategory] = row.description || ''
      setOriginal(map)
      setValues(map)
    })
  }, [])

  const save = async () => {
    const changed = ROWS.filter((r) => values[r.sub].trim() !== original[r.sub].trim())
    if (changed.length === 0) {
      setNotice({ type: 'ok', text: '변경된 내용이 없습니다.' })
      return
    }
    setSaving(true)
    setNotice(null)
    const { error } = await supabase.from('subcategory_info').upsert(
      changed.map((r) => ({ subcategory: r.sub, description: values[r.sub].trim() || null })),
      { onConflict: 'subcategory' }
    )
    setSaving(false)
    if (error) {
      setNotice({ type: 'error', text: '저장에 실패했습니다. 다시 시도해 주세요.' })
      return
    }
    const next = { ...original }
    for (const r of changed) next[r.sub] = values[r.sub].trim()
    setOriginal(next)
    setValues((v) => ({ ...v, ...Object.fromEntries(changed.map((r) => [r.sub, values[r.sub].trim()])) }))
    setNotice({ type: 'ok', text: '저장되었습니다' })
  }

  if (!original) return <p className="adm-hint">불러오는 중…</p>

  return (
    <div>
      <p className="adm-hint">비워 두면 손님 화면에서 설명 영역이 나타나지 않습니다. 여러 줄 입력이 가능합니다.</p>
      <button type="button" className="adm-btn primary adm-save-top" disabled={saving} onClick={save}>저장</button>
      <Notice notice={notice} />
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>대분류</th><th>중분류</th><th>설명</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.sub}>
                {r.first && <th rowSpan={r.span} scope="rowgroup" className="cat">{r.category}</th>}
                <th scope="row" className="sub">{r.sub}</th>
                <td>
                  <textarea rows={2} value={values[r.sub]}
                    onChange={(e) => setValues((v) => ({ ...v, [r.sub]: e.target.value }))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
