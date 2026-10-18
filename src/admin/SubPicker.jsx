import { useState } from 'react'
import { CATEGORIES } from '../data/categories.js'

// 대분류 → 중분류 선택. 선택이 바뀌면 render 에 { category, sub } 를 넘겨 그린다.
export default function SubPicker({ render }) {
  const [catSlug, setCatSlug] = useState(CATEGORIES[0].slug)
  const category = CATEGORIES.find((c) => c.slug === catSlug)
  const [subSlug, setSubSlug] = useState(category.subs[0].slug)
  const sub = category.subs.find((s) => s.slug === subSlug) || category.subs[0]

  const changeCat = (slug) => {
    setCatSlug(slug)
    setSubSlug(CATEGORIES.find((c) => c.slug === slug).subs[0].slug)
  }

  return (
    <div>
      <div className="adm-row">
        <label>
          대분류
          <select value={catSlug} onChange={(e) => changeCat(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label>
          중분류
          <select value={sub.slug} onChange={(e) => setSubSlug(e.target.value)}>
            {category.subs.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </label>
      </div>
      {render({ category, sub })}
    </div>
  )
}
