// 원본 비율 유지 + 중앙 기준 크롭. ratio 예: '310 / 230'
export default function CroppedImage({ src, alt = '', ratio, className = '', style }) {
  return (
    <div className={`crop ${className}`} style={{ aspectRatio: ratio, ...style }}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  )
}
