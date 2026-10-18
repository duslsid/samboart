import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CATEGORIES, categoryPath, subPath } from '../../data/categories.js'
import { ONLINE_STORES } from '../../data/site.js'
import { flipOnEnter, useHoverOpen } from './menuUtils.js'

const MENUS = [
  {
    label: '회사소개', to: '/about', match: '/about',
    children: [
      { label: '회사소개', to: '/about' },
      { label: '오시는길', to: '/about/location' },
      { label: '온라인판매처', children: ONLINE_STORES.map((s) => ({ label: s.label, href: s.href })) },
    ],
  },
  {
    label: '제품소개', to: categoryPath(CATEGORIES[0]), match: '/products',
    children: CATEGORIES.map((c) => ({
      label: c.name, to: categoryPath(c),
      children: c.subs.map((s) => ({ label: s.name, to: subPath(c, s) })),
    })),
  },
  { label: '시공사례', to: '/gallery', match: '/gallery' },
  { label: '견적문의', to: '/contact', match: '/contact' },
]

function ItemLink({ item, onClick }) {
  if (item.href) {
    return <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick}>{item.label}</a>
  }
  if (item.to) return <Link to={item.to} onClick={onClick}>{item.label}</Link>
  return <span className="no-link">{item.label}</span>
}

function DropList({ items, sub = false, onNavigate }) {
  const hover = useHoverOpen()
  return (
    <ul className={`dd font-submenu${sub ? ' dd-sub' : ''}`}>
      {items.map((it) => (
        <li key={it.label}
          onMouseEnter={(e) => { flipOnEnter(e); hover.enter(it.label) }}
          onMouseLeave={hover.leave}>
          <ItemLink item={it} onClick={onNavigate} />
          {it.children && hover.open === it.label && (
            <DropList items={it.children} sub onNavigate={onNavigate} />
          )}
        </li>
      ))}
    </ul>
  )
}

function MobileItem({ item, depth = 0, onNavigate }) {
  const [open, setOpen] = useState(false)
  return (
    <li>
      <div className={`m-row ${depth === 0 ? 'font-menu' : 'font-submenu'}`} style={{ paddingLeft: 20 + depth * 16 }}>
        <ItemLink item={item} onClick={onNavigate} />
        {item.children && (
          <button type="button" className="m-toggle" aria-expanded={open}
            aria-label={`${item.label} 하위 메뉴 ${open ? '닫기' : '열기'}`} onClick={() => setOpen(!open)}>
            {open ? '−' : '+'}
          </button>
        )}
      </div>
      {item.children && open && (
        <ul>
          {item.children.map((c) => (
            <MobileItem key={c.label} item={c} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Header({ scrolled, bannerHidden }) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const navHover = useHoverOpen()

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <header className={`header${bannerHidden ? ' top0' : ''}${scrolled ? ' shadow' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="logo" aria-label="삼보아트 메인으로">
          {/* 로고 이미지가 준비되면 public/image/logo 의 파일로 교체 */}
          <span className="logo-ph">로고 이미지 준비 중</span>
        </Link>

        <nav className="nav-desktop" aria-label="주 메뉴">
          <ul>
            {MENUS.map((m) => (
              <li key={m.label} className="nav-item"
                onMouseEnter={() => navHover.enter(m.label)} onMouseLeave={navHover.leave}>
                <Link to={m.to} onClick={navHover.close}
                  className={`font-menu${pathname.startsWith(m.match) ? ' active' : ''}`}>
                  <span>{m.label}</span>
                </Link>
                {m.children && navHover.open === m.label && (
                  <DropList items={m.children} onNavigate={navHover.close} />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className="hamburger" aria-label="메뉴 열기" aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="square">
            {menuOpen ? <path d="M5 5L19 19M19 5L5 19" /> : <path d="M3 6H21M3 12H21M3 18H21" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="m-nav" aria-label="모바일 메뉴">
          <ul>
            {MENUS.map((m) => (
              <MobileItem key={m.label} item={m} onNavigate={() => setMenuOpen(false)} />
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
