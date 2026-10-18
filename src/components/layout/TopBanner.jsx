import { PHONE_DISPLAY } from '../../data/site.js'

export default function TopBanner({ hidden }) {
  return (
    <div className={`topbanner${hidden ? ' hide' : ''}`}>
      <div className="container font-banner">견적문의 {PHONE_DISPLAY}</div>
    </div>
  )
}
