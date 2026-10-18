import { supabase, BUCKET } from './supabase.js'

// Storage 경로 -> 공개 URL. 코드에 사진 경로를 직접 적지 않고 DB 의 file_path 만 사용한다.
export function storageUrl(path) {
  if (!supabase || !path) return null
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// public/image 아래 로컬 이미지 (로고, 가게 외관)
export const localImage = (path) => `${import.meta.env.BASE_URL}image/${path}`
