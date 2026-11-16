// 검색엔진용 페이지 목록과 페이지별 메타 정보를 만드는 곳.
// 빌드할 때 GitHub Actions에서 scripts/generate-pages.mjs, scripts/generate-sitemap.mjs 가 가져다 쓴다.
//
// 새 공개 페이지를 만들면 아래 STATIC_PAGES 에도 추가한다. (분류 페이지는 src/data/categories.js 에서 자동으로 만들어진다)
import { CATEGORIES } from '../src/data/categories.js'

export const SITE_URL = 'https://samboart.com'
export const SITE_NAME = '삼보아트'
export const DEFAULT_TITLE = '삼보아트 | 인천 앵글·진열대 전문'
export const DEFAULT_DESCRIPTION =
  '인천에서 40여 년 영업해온 앵글·진열대 전문 업체 삼보아트. 곤도라, 렉, 앵글, 찬넬, 제작진열대 견적 문의.'
export const DEFAULT_IMAGE = `${SITE_URL}/og/samboart_og_image.png`

const DESCRIPTION_MAX = 110

// Supabase 에 올라간 사진(Storage 공개 주소)
const STORAGE_BUCKET = 'samboart'

// src/App.jsx 의 고정 페이지 (path 는 슬래시로 시작, 메인은 '/')
const STATIC_PAGES = [
  { path: '/', title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  {
    path: '/about',
    title: '회사소개 | 삼보아트',
    description: '삼보상사로 시작해 40여 년, 인천 앵글·진열대 전문 업체 삼보아트를 소개합니다.',
  },
  {
    path: '/about/location',
    title: '오시는 길 | 삼보아트',
    description: '인천시 남동구 인주대로 725, 1층 삼보아트 오시는 길과 연락처(010-4439-4306, 032-465-1933).',
  },
  {
    path: '/gallery',
    title: '시공사례 | 삼보아트',
    description: '삼보아트의 앵글·진열대 시공사례 사진을 확인하세요.',
    image: 'gallery',
  },
  {
    path: '/contact',
    title: '견적문의 | 삼보아트',
    description: '앵글·진열대 견적 문의. 전화 010-4439-4306 또는 온라인으로 문의하세요.',
  },
  {
    path: '/privacy',
    title: '개인정보처리방침 | 삼보아트',
    description: '삼보아트의 개인정보 처리 목적, 항목, 보유 기간, 국외 이전 안내입니다.',
  },
]

// 글자를 HTML 속성값에 안전하게 넣기 위한 처리
export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// 줄바꿈·연속 공백을 한 칸으로 줄이고, 길면 자른다.
export function shorten(text, max = DESCRIPTION_MAX) {
  const flat = String(text || '').replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat
  return flat.slice(0, max - 1).trimEnd() + '…'
}

// 주소 → 대표 주소(끝 슬래시). GitHub Pages 가 폴더의 index.html 을 /경로/ 로 서비스하므로 이 형태로 통일한다.
export function canonicalUrl(path) {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}/`
}

// Supabase 에서 사진·설명을 읽는다. 실패하거나 키가 없으면 빈 값을 돌려주고 빌드는 계속된다.
export async function loadSupabaseData(env = process.env) {
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  const empty = { categoryPhoto: {}, firstProductPhoto: {}, description: {}, galleryPhoto: null, ok: false }
  if (!url || !key) {
    console.warn('[pages] Supabase 주소/키가 없어 기본 이미지·기본 설명으로 만듭니다.')
    return empty
  }

  const get = async (table, query) => {
    const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) throw new Error(`${table} ${res.status}`)
    return res.json()
  }

  try {
    const [cats, products, infos, gallery] = await Promise.all([
      get('category_photos', 'select=category,file_path'),
      get('product_photos', 'select=subcategory,file_path,sort_order&order=sort_order.asc'),
      get('subcategory_info', 'select=subcategory,description'),
      get('gallery_photos', 'select=file_path&order=sort_order.asc&limit=1'),
    ])
    const toUrl = (path) => `${url}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`
    const data = { categoryPhoto: {}, firstProductPhoto: {}, description: {}, galleryPhoto: null, ok: true }
    for (const r of cats) data.categoryPhoto[r.category] = toUrl(r.file_path)
    for (const r of products) if (!(r.subcategory in data.firstProductPhoto)) data.firstProductPhoto[r.subcategory] = toUrl(r.file_path)
    for (const r of infos) if (r.description && r.description.trim()) data.description[r.subcategory] = r.description
    if (gallery[0]) data.galleryPhoto = toUrl(gallery[0].file_path)
    return data
  } catch (err) {
    console.warn(`[pages] Supabase 조회에 실패해 기본 이미지·기본 설명으로 만듭니다. (${err.message})`)
    return empty
  }
}

// 공개 페이지 전체 목록 (sitemap 과 페이지 사본이 같은 목록을 쓴다)
export function buildPages(data) {
  const pages = STATIC_PAGES.map((p) => ({
    path: p.path,
    title: p.title,
    description: p.description,
    image: p.image === 'gallery' ? data.galleryPhoto || DEFAULT_IMAGE : DEFAULT_IMAGE,
    links: [],
  }))

  for (const c of CATEGORIES) {
    pages.push({
      path: `/products/${c.slug}`,
      title: `${c.name} | ${SITE_NAME}`,
      description: `삼보아트의 ${c.name} 제품: ${c.subs.map((s) => s.name).join(', ')}.`,
      image: data.categoryPhoto[c.name] || DEFAULT_IMAGE,
      links: c.subs.map((s) => ({ href: `/products/${c.slug}/${s.slug}`, label: s.name })),
    })
    for (const s of c.subs) {
      pages.push({
        path: `/products/${c.slug}/${s.slug}`,
        title: `${s.name} | ${SITE_NAME}`,
        description: shorten(data.description[s.name]) || `삼보아트의 ${c.name} ${s.name} 제품 사진과 견적 문의.`,
        image: data.firstProductPhoto[s.name] || DEFAULT_IMAGE,
        links: [{ href: `/products/${c.slug}`, label: c.name }],
      })
    }
  }
  return pages
}

// 메인 페이지에는 분류 목록 링크를 같이 넣는다 (자바스크립트를 못 읽는 검색엔진이 따라갈 수 있게)
export function mainLinks() {
  return CATEGORIES.map((c) => ({ href: `/products/${c.slug}`, label: c.name }))
}
