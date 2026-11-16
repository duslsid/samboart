import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBanner from './TopBanner.jsx'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import Footer from './Footer.jsx'
import TopButton from './TopButton.jsx'
import MobileCallBar from './MobileCallBar.jsx'
import MainSlider from '../home/MainSlider.jsx'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  // 페이지별 정적 사본은 /privacy/ 처럼 끝에 슬래시가 붙은 주소로 열리므로, 비교할 때는 끝 슬래시를 뗀다
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  const isHome = path === '/'
  const noSidebar = path === '/privacy' // 개인정보처리방침은 사이드바 없이 본문만

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 페이지 이동 시 맨 위로 (해시 이동은 각 페이지가 처리)
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <>
      <TopBanner hidden={scrolled} />
      <Header scrolled={scrolled} bannerHidden={scrolled} />
      <div className="header-spacer" />
      {isHome && <MainSlider />}
      <div className={`container page-wrap${isHome ? ' after-hero' : ''}`}>
        {!noSidebar && <Sidebar />}
        <main className="page-main">
          <Outlet />
        </main>
      </div>
      <Footer />
      <TopButton />
      <MobileCallBar />
    </>
  )
}
