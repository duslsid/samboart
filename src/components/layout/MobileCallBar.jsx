import { PHONE_DISPLAY, PHONE_TEL } from '../../data/site.js'

export default function MobileCallBar() {
  return (
    <a href={PHONE_TEL} className="callbar font-body">
      {PHONE_DISPLAY} 전화하기
    </a>
  )
}
