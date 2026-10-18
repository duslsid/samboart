import CategoryCards from '../components/home/CategoryCards.jsx'
import InquirySection from '../components/home/InquirySection.jsx'
import LocationSection from '../components/common/LocationSection.jsx'
import PopupNotice from '../components/home/PopupNotice.jsx'

export default function Home() {
  return (
    <>
      <CategoryCards />
      <InquirySection />
      <LocationSection title="찾아오시는 길" />
      <PopupNotice />
    </>
  )
}
