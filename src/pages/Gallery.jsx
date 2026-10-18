import { useEffect, useState } from 'react'
import { getGalleryPhotos } from '../lib/api.js'
import { storageUrl } from '../lib/images.js'
import Placeholder from '../components/common/Placeholder.jsx'
import CroppedImage from '../components/common/CroppedImage.jsx'
import PhotoPopup from '../components/common/PhotoPopup.jsx'

const RATIO = '240 / 180'

// gallery_photos 를 sort_order 순으로 보여준다. 사진이 없으면 "준비 중" 표시.
export default function Gallery() {
  const [photos, setPhotos] = useState(null)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    getGalleryPhotos().then(setPhotos)
  }, [])

  return (
    <div className="gallery-page product-page">
      <h1 className="font-title page-title">시공사례</h1>

      {photos !== null && (
        photos.length === 0 ? (
          <Placeholder label="시공 사례 사진은 추후 업데이트됩니다." className="gallery-ph" />
        ) : (
          <ul className="photo-grid">
            {photos.map((p, i) => (
              <li key={p.id}>
                <button type="button" className="photo-btn" onClick={() => setOpenIndex(i)}
                  aria-label={`시공사례 사진 ${i + 1} 크게 보기`}>
                  <CroppedImage src={storageUrl(p.file_path)} alt={`시공사례 ${i + 1}`} ratio={RATIO} />
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
