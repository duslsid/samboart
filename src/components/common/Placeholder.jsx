// 사진이 없는 자리에 표시하는 "준비 중" 박스. label 에 들어갈 사진 설명을 적는다.
export default function Placeholder({ label, ratio, className = '' }) {
  return (
    <div className={`ph ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      <strong>준비 중</strong>
      {label && <span>{label}</span>}
    </div>
  )
}
