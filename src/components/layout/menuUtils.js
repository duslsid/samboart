import { useEffect, useRef, useState } from 'react'

// 하위 창이 화면 오른쪽 밖으로 넘칠 것 같으면 왼쪽으로 펼치도록 표시
export function flipOnEnter(e) {
  const li = e.currentTarget
  const r = li.getBoundingClientRect()
  li.dataset.flip = r.right + 180 > window.innerWidth ? '1' : '0'
}

// 한 번에 하나의 창만 열리는 hover 메뉴 상태.
// - 다른 항목에 들어가면 이전 창은 즉시 닫히고 새 창이 열림
// - 항목과 창을 모두 벗어나면 delay 뒤에 닫힘
export function useHoverOpen(delay = 200) {
  const [open, setOpen] = useState(null)
  const timer = useRef(null)
  const clear = () => clearTimeout(timer.current)
  useEffect(() => clear, [])

  return {
    open,
    enter: (key) => { clear(); setOpen(key) },
    leave: () => { clear(); timer.current = setTimeout(() => setOpen(null), delay) },
    close: () => { clear(); setOpen(null) },
  }
}
