import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMainPhotos } from '../../lib/api.js'
import { storageUrl } from '../../lib/images.js'
import Placeholder from '../common/Placeholder.jsx'

const INTERVAL = 4000 // 전환 간격 4초 (전환 시간 1초는 CSS)

export default function MainSlider() {
  const [photos, setPhotos] = useState(null) // null = 불러오는 중
  const [index, setIndex] = useState(0)

  useEffect(() => {
    getMainPhotos().then(setPhotos)
  }, [])

  useEffect(() => {
    if (!photos || photos.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), INTERVAL)
    return () => clearInterval(id)
  }, [photos])

  if (!photos) return <div className="main-slider" />
  if (photos.length === 0) {
    return (
      <div className="main-slider">
        <Placeholder label="메인 이미지 (시공 사진 3~5장이 순서대로 전환되는 자리)" className="fill" />
      </div>
    )
  }

  return (
    <Link to="/gallery" className="main-slider" aria-label="시공사례 보기">
      {photos.map((p, i) => (
        <img key={p.id} src={storageUrl(p.file_path)} alt="시공 사진"
          className={i === index ? 'on' : ''} />
      ))}
    </Link>
  )
}
