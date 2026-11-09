import Placeholder from '../components/common/Placeholder.jsx'

export default function About() {
  return (
    <div className="about-page">
      <h1 className="font-title page-title">회사소개</h1>

      <section className="about-section">
        <h2 className="font-sub section-title">소개</h2>
        <Placeholder label="회사 소개글이 들어갈 자리" className="about-text-ph" />
      </section>
    </div>
  )
}
