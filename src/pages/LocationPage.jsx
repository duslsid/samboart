import LocationSection from '../components/common/LocationSection.jsx'

export default function LocationPage() {
  return (
    <div className="location-page">
      <h1 className="font-title page-title">오시는 길</h1>
      <LocationSection />
      <p className="font-body location-contact">
        전화 <a href="tel:01044394306">010-4439-4306</a>
        <span className="sep">/</span>
        <a href="tel:0324651933">032-465-1933</a>
      </p>
    </div>
  )
}
