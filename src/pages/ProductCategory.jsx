import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findCategory, subPath } from '../data/categories.js'
import { getFirstProductPhotos } from '../lib/api.js'
import { storageUrl } from '../lib/images.js'
import Placeholder from '../components/common/Placeholder.jsx'
import CroppedImage from '../components/common/CroppedImage.jsx'
import NotFound from './NotFound.jsx'

const RATIO = '240 / 180'

export default function ProductCategory() {
  const { cat } = useParams()
  const category = findCategory(cat)
  const [photos, setPhotos] = useState(null)

  useEffect(() => {
    if (!category) return
    setPhotos(null)
    getFirstProductPhotos(category.subs.map((s) => s.name)).then(setPhotos)
  }, [cat])

  if (!category) return <NotFound />

  return (
    <div className="product-page">
      <h1 className="font-title page-title page-title-cat">{category.name}</h1>
      <ul className="card-grid">
        {category.subs.map((s) => {
          const path = photos?.[s.name]
          return (
            <li key={s.slug}>
              <Link to={subPath(category, s)} className="card">
                {photos === null ? (
                  <div style={{ aspectRatio: RATIO }} />
                ) : path ? (
                  <CroppedImage src={storageUrl(path)} alt={s.name} ratio={RATIO} className="card-img" />
                ) : (
                  <Placeholder label={`${s.name} 사진`} ratio={RATIO} />
                )}
                <h2 className="font-sub card-name">{s.name}</h2>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
