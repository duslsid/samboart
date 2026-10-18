import { useEffect } from 'react'

// 사진 전체가 보이도록 비율 유지 + 축소만 (자르지 않음). 최대 가로·세로 80% (모바일 가로 90%)
export default function PhotoPopup({ urls, index, onChange, onClose }) {
  const count = urls.length
  const prev = () => onChange((index - 1 + count) % count)
  const next = () => onChange((index + 1) % count)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = original
    }
  }, [onClose])

  const stop = (fn) => (e) => { e.stopPropagation(); fn() }

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <img src={urls[index]} alt="" className="lightbox-img" />

      {count > 1 && (
        <>
          <button type="button" className="lightbox-nav prev" aria-label="이전 사진" onClick={stop(prev)}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="square">
              <path d="M20 5L9 16L20 27" />
            </svg>
          </button>
          <button type="button" className="lightbox-nav next" aria-label="다음 사진" onClick={stop(next)}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="square">
              <path d="M12 5L23 16L12 27" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
