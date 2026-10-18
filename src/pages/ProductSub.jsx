import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { findSub } from '../data/categories.js'
import { getProductPhotos, getSubcategoryDescription } from '../lib/api.js'
import { storageUrl } from '../lib/images.js'
import Placeholder from '../components/common/Placeholder.jsx'
import CroppedImage from '../components/common/CroppedImage.jsx'
import PhotoPopup from '../components/common/PhotoPopup.jsx'
import NotFound from './NotFound.jsx'

const RATIO = '240 / 180'

export default function ProductSub() {
  const { cat, sub } = useParams()
  const found = findSub(cat, sub)
  const [photos, setPhotos] = useState(null)
  const [description, setDescription] = useState('')
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    if (!found) return
    setPhotos(null)
    setDescription('')
    setOpenIndex(null)
    getProductPhotos(found.sub.name).then(setPhotos)
    getSubcategoryDescription(found.sub.name).then(setDescription)
  }, [cat, sub])

  if (!found) return <NotFound />
  const { category, sub: subItem } = found

  return (
    <div className="product-page">
      <p className="font-body parent-name">{category.name}</p>
      <h1 className="font-title page-title page-title-sub">{subItem.name}</h1>

      {description && <p className="font-body sub-desc">{description}</p>}

      {photos !== null && (
        photos.length === 0 ? (
          <div className="photo-grid">
            <Placeholder label={`${subItem.name} 사진`} ratio={RATIO} />
          </div>
        ) : (
          <ul className="photo-grid">
            {photos.map((p, i) => (
              <li key={p.id}>
                <button type="button" className="photo-btn" onClick={() => setOpenIndex(i)}
                  aria-label={`${subItem.name} 사진 ${i + 1} 크게 보기`}>
                  <CroppedImage src={storageUrl(p.file_path)} alt={`${subItem.name} ${i + 1}`} ratio={RATIO} />
                </button>
              </li>
            ))}
          </ul>
        )
      )}


      {openIndex !== null && photos && (
        <PhotoPopup
          urls={photos.map((p) => storageUrl(p.file_path))}
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  )
}
