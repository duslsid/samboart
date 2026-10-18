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
  const isHome = pathname === '/'

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
        <Sidebar />
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
