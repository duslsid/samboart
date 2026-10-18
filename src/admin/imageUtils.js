const MAX_WIDTH = 1600
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }

// 가로 1600px 를 넘으면 1600px 로 줄이고(비율 유지), 넘지 않으면 원본 그대로 사용한다.
export async function prepareImage(file) {
  const ext = EXT[file.type]
  if (!ext) throw new Error('지원하지 않는 이미지 형식')

  const bitmap = await createImageBitmap(file)
  if (bitmap.width <= MAX_WIDTH || file.type === 'image/gif') {
    bitmap.close?.()
    return { blob: file, ext, contentType: file.type }
  }

  const width = MAX_WIDTH
  const height = Math.round((bitmap.height * MAX_WIDTH) / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  const contentType = file.type === 'image/png' || file.type === 'image/webp' ? file.type : 'image/jpeg'
  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('변환 실패'))), contentType, 0.9)
  )
  return { blob, ext: EXT[contentType], contentType }
}
