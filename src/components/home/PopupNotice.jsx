import { useEffect, useState } from 'react'
import { getPopupNotice } from '../../lib/api.js'
import { storageUrl } from '../../lib/images.js'

const KEY = 'samboart_popup_hide_until'

function hiddenToday() {
  try {
    return Date.now() < Number(localStorage.getItem(KEY) || 0)
  } catch {
    return false
  }
}

function hideUntilMidnight() {
  try {
    const d = new Date()
    d.setHours(24, 0, 0, 0)
    localStorage.setItem(KEY, String(d.getTime()))
  } catch {
    /* 저장이 막힌 환경에서는 이번 방문만 닫는다 */
  }
}

// 메인 페이지 진입 시에만 표시. is_active 가 켜짐일 때만 보인다.
export default function PopupNotice() {
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    if (hiddenToday()) return
    getPopupNotice().then((n) => {
      if (n?.is_active) setNotice(n)
    })
  }, [])

  if (!notice) return null

  const close = () => setNotice(null)
  const body =
    notice.type === 'image' ? (
      notice.image_path ? <img src={storageUrl(notice.image_path)} alt={notice.title || '공지'} /> : null
    ) : (
      <div className="popup-text">
        {notice.title && <h3 className="font-sub">{notice.title}</h3>}
        {notice.content && <p className="font-body">{notice.content}</p>}
      </div>
    )

  return (
    <div className="popup-dim" role="dialog" aria-modal="true">
      <div className="popup">
        {body}
        <div className="popup-actions">
          <button type="button" className="font-body"
            onClick={() => { hideUntilMidnight(); close() }}>오늘 하루 보지 않기</button>
          <button type="button" className="font-body" onClick={close}>닫기</button>
        </div>
      </div>
    </div>
  )
}
