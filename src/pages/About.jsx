import { useState } from 'react'
import { localImage } from '../lib/images.js'
import Placeholder from '../components/common/Placeholder.jsx'

const STORE_PHOTO = 'store/exterior.jpg' // public/image/store/exterior.jpg

export default function About() {
  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <div className="about-page">
      <h1 className="font-title page-title">회사소개</h1>

      <section className="about-section">
        <h2 className="font-sub section-title">소개</h2>
        <Placeholder label="회사 소개글이 들어갈 자리" className="about-text-ph" />
      </section>

      <section className="about-section">
        <h2 className="font-sub section-title">가게 외관</h2>
        {photoFailed ? (
          <Placeholder label="가게 외관 사진" ratio="980 / 450" />
        ) : (
          <img src={localImage(STORE_PHOTO)} alt="삼보아트 가게 외관" className="about-store"
            onError={() => setPhotoFailed(true)} />
        )}
      </section>
    </div>
  )
}
