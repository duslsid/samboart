import { supabase, BUCKET } from '../lib/supabase.js'
import { prepareImage } from './imageUtils.js'

const randomName = (ext) => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

// 이미지를 줄여서 folder 아래에 올리고 Storage 경로를 돌려준다.
export async function uploadImage(file, folder) {
  const { blob, ext, contentType } = await prepareImage(file)
  const path = `${folder}/${randomName(ext)}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType,
    cacheControl: '31536000',
  })
  if (error) throw error
  return path
}

export async function removeFile(path) {
  if (!path) return
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
