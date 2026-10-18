import { supabase } from './supabase.js'

// 모든 조회는 실패하거나 데이터가 비어 있어도 빈 값을 돌려준다 (자리표시자로 표시하기 위함).
async function select(build, fallback) {
  if (!supabase) return fallback
  const { data, error } = await build(supabase)
  if (error) {
    console.error(error)
    return fallback
  }
  return data ?? fallback
}

export const getMainPhotos = () =>
  select((s) => s.from('main_photos').select('*').order('sort_order'), [])

// { 곤도라: 'categories/...', ... }
export async function getCategoryPhotos() {
  const rows = await select((s) => s.from('category_photos').select('category, file_path'), [])
  return Object.fromEntries(rows.map((r) => [r.category, r.file_path]))
}

export const getProductPhotos = (subcategory) =>
  select(
    (s) => s.from('product_photos').select('*').eq('subcategory', subcategory).order('sort_order'),
    []
  )

// 대분류 페이지용: 중분류별 sort_order 가장 앞 사진 1장 { 일반곤도라: 'products/...' }
export async function getFirstProductPhotos(subcategories) {
  const rows = await select(
    (s) =>
      s.from('product_photos').select('subcategory, file_path, sort_order')
        .in('subcategory', subcategories).order('sort_order'),
    []
  )
  const first = {}
  for (const r of rows) if (!(r.subcategory in first)) first[r.subcategory] = r.file_path
  return first
}

export const getGalleryPhotos = () =>
  select((s) => s.from('gallery_photos').select('*').order('sort_order'), [])

export async function getSubcategoryDescription(subcategory) {
  const row = await select(
    (s) => s.from('subcategory_info').select('description').eq('subcategory', subcategory).maybeSingle(),
    null
  )
  return row?.description?.trim() || ''
}

export const getPopupNotice = () =>
  select((s) => s.from('popup_notice').select('*').order('id').limit(1).maybeSingle(), null)
