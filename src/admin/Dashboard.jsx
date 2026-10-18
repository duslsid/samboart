import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import PhotoManager from './PhotoManager.jsx'
import CategoryPhotos from './CategoryPhotos.jsx'
import SubPicker from './SubPicker.jsx'
import SubDescriptionTable from './SubDescriptionTable.jsx'
import PopupEditor from './PopupEditor.jsx'

const TABS = [
  { key: 'main', label: '메인 이미지' },
  { key: 'category', label: '대분류 대표 사진' },
  { key: 'product', label: '중분류 사진' },
  { key: 'desc', label: '중분류 설명' },
  { key: 'gallery', label: '시공사례 사진' },
  { key: 'popup', label: '팝업 공지' },
]

export default function Dashboard({ email }) {
  const [tab, setTab] = useState('main')

  return (
    <div className="adm-wrap">
      <header className="adm-header">
        <h1>삼보아트 관리자</h1>
        <div>
          <span>{email}</span>
          <button type="button" className="adm-btn" onClick={() => supabase.auth.signOut()}>로그아웃</button>
        </div>
      </header>

      <nav className="adm-tabs">
        {TABS.map((t) => (
          <button key={t.key} type="button" className={tab === t.key ? 'on' : ''} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </nav>

      <section className="adm-panel">
        {tab === 'main' && (
          <PhotoManager table="main_photos" folder="main"
            hint="메인 페이지 상단에 순서대로 전환되어 보입니다. 3~5장을 권장합니다." />
        )}
        {tab === 'category' && <CategoryPhotos />}
        {tab === 'product' && (
          <SubPicker render={({ category, sub }) => (
            <PhotoManager table="product_photos" folder={`products/${category.slug}/${sub.slug}`}
              match={{ subcategory: sub.name }}
              hint="맨 앞 사진이 대분류 페이지의 대표 사진으로 쓰입니다." />
          )} />
        )}
        {tab === 'gallery' && <PhotoManager table="gallery_photos" folder="gallery" />}
        {tab === 'desc' && <SubDescriptionTable />}
        {tab === 'popup' && <PopupEditor />}
      </section>
    </div>
  )
}
