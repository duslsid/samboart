import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, categoryPath } from '../../data/categories.js'
import { getCategoryPhotos } from '../../lib/api.js'
import { storageUrl } from '../../lib/images.js'
import Placeholder from '../common/Placeholder.jsx'
import CroppedImage from '../common/CroppedImage.jsx'

const RATIO = '310 / 230'

export default function CategoryCards() {
  const [photos, setPhotos] = useState(null)

  useEffect(() => {
    getCategoryPhotos().then(setPhotos)
  }, [])

  return (
    <section className="home-categories">
      <h2 className="font-sub section-title">제품 소개</h2>
      <ul className="card-grid">
        {CATEGORIES.map((c) => {
          const path = photos?.[c.name]
          return (
            <li key={c.slug}>
              <Link to={categoryPath(c)} className="card">
                {photos === null ? (
                  <div className="card-empty" style={{ aspectRatio: RATIO }} />
                ) : path ? (
                  <CroppedImage src={storageUrl(path)} alt={c.name} ratio={RATIO} className="card-img" />
                ) : (
                  <Placeholder label={`${c.name} 대표 사진`} ratio={RATIO} />
                )}
                <h3 className="font-sub card-name">{c.name}</h3>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
