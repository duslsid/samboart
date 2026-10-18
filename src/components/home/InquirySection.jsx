import { Link } from 'react-router-dom'
import { ONLINE_STORES } from '../../data/site.js'

export default function InquirySection() {
  return (
    <section className="home-inquiry">
      <h2 className="font-sub section-title">문의 및 구매</h2>
      <div className="inquiry-body">
        <div className="inquiry-col">
          <h3 className="font-body inquiry-sub">맞춤 제작·시공 문의</h3>
          <Link to="/contact" className="btn-quote font-sub">견적 문의하기</Link>
        </div>
        <div className="inquiry-col">
          <h3 className="font-body inquiry-sub">바로 구매</h3>
          <div className="online-btns">
            {ONLINE_STORES.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                className="btn-outline font-body">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
