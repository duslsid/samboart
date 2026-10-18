import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import LocationPage from './pages/LocationPage.jsx'
import ProductCategory from './pages/ProductCategory.jsx'
import ProductSub from './pages/ProductSub.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

// 관리자 화면은 손님 사이트와 분리해 필요할 때만 불러온다
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/location" element={<LocationPage />} />
        <Route path="/products/:cat" element={<ProductCategory />} />
        <Route path="/products/:cat/:sub" element={<ProductSub />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/admin" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
    </Routes>
  )
}
