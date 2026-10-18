import { useEffect, useState } from 'react'

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m5!3m3!1m2!1s0x357b7b95313450f9%3A0xf64cab2d7ae79ac1!2z7J247LKc6rSR7Jet7IucIOuCqOuPmeq1rCDsnbjso7zrjIDroZwgNzI1!5e0!3m2!1sko!2skr!4v1791980075644!5m2!1sko!2skr'

// 모바일에서 지도 위를 스크롤해도 페이지가 스크롤되도록, 지도를 한 번 탭하기 전에는 덮개로 막는다.
export default function LocationSection({ id, title }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!active) return
    const off = (e) => {
      if (!e.target.closest?.('.map-box')) setActive(false)
    }
    document.addEventListener('touchstart', off, { passive: true })
    return () => document.removeEventListener('touchstart', off)
  }, [active])

  return (
    <section className="location" id={id}>
      {title && <h2 className="font-sub section-title">{title}</h2>}
      <div className="location-body">
        <div className="map-box">
          <iframe
            src={MAP_SRC}
            title="삼보아트 위치 지도"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          {!active && <div className="map-guard" onClick={() => setActive(true)} />}
        </div>
        <div className="location-info">
          <p className="font-body address">인천시 남동구 인주대로 725, 1층 삼보인테리어</p>
          <div className="route-btns">
            <a href="https://naver.me/x3j2ebWb" target="_blank" rel="noopener noreferrer"
              className="btn-route font-body">네이버지도</a>
            <a href="https://kko.to/fDxyJP9gAH" target="_blank" rel="noopener noreferrer"
              className="btn-route font-body">카카오맵</a>
          </div>
        </div>
      </div>
    </section>
  )
}
