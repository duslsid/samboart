import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CATEGORIES, categoryPath, subPath } from '../../data/categories.js'
import { flipOnEnter, useHoverOpen } from './menuUtils.js'

export default function Sidebar() {
  const { pathname } = useLocation()
  const ref = useRef(null)
  const [tooTall, setTooTall] = useState(false)
  const hover = useHoverOpen()

  // 사이드바가 화면보다 길면 고정하지 않고 일반 스크롤
  useEffect(() => {
    const check = () => {
      if (ref.current) setTooTall(ref.current.offsetHeight + 84 > window.innerHeight)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <aside ref={ref} className={`sidebar${tooTall ? ' static' : ''}`}>
      <h2 className="sidebar-title font-menu">제품 카테고리</h2>
      <ul className="sidebar-list">
        {CATEGORIES.map((c) => {
          const active = pathname.startsWith(categoryPath(c))
          return (
            <li key={c.slug}
              onMouseEnter={(e) => { flipOnEnter(e); hover.enter(c.slug) }}
              onMouseLeave={hover.leave}>
              <Link to={categoryPath(c)} onClick={hover.close}
                className={`sidebar-item font-menu${active ? ' active' : ''}`}>
                {c.name}
              </Link>
              {hover.open === c.slug && (
                <ul className="dd font-submenu">
                  {c.subs.map((s) => (
                    <li key={s.slug}><Link to={subPath(c, s)} onClick={hover.close}>{s.name}</Link></li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
