import { useRef, useState } from 'react'

// 파일 선택 또는 끌어다 놓기. multiple 이면 여러 장 선택 가능.
export default function UploadZone({ onFiles, multiple = true, disabled = false, label }) {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)

  const pick = (list) => {
    const files = Array.from(list || []).filter((f) => f.type.startsWith('image/') || f.type === '')
    if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1))
  }

  return (
    <div
      className={`adm-drop${over ? ' over' : ''}${disabled ? ' disabled' : ''}`}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes('Files')) return
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        if (!e.dataTransfer.types.includes('Files')) return
        e.preventDefault()
        setOver(false)
        if (!disabled) pick(e.dataTransfer.files)
      }}
    >
      <p>{label || (multiple ? '사진을 여기로 끌어다 놓거나 클릭해서 선택하세요. (여러 장 선택 가능)' : '사진을 여기로 끌어다 놓거나 클릭해서 선택하세요.')}</p>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} hidden
        onChange={(e) => { pick(e.target.files); e.target.value = '' }} />
    </div>
  )
}
