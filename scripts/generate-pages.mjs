// 빌드(vite build) 뒤에 GitHub Actions에서 실행된다. (package.json 의 build 스크립트)
// dist/index.html 을 틀로 삼아 공개 페이지마다 dist/<주소>/index.html 사본을 만든다.
//  - 주소로 직접 열어도 404가 아니라 200으로 응답한다.
//  - 사본마다 제목·설명·og·canonical 을 그 페이지에 맞게 바꾸고, 자바스크립트 없이도 읽히는 <noscript> 안내를 넣는다.
//  - /admin 은 검색에서 제외(noindex)하는 사본을 따로 만든다.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  DEFAULT_IMAGE,
  SITE_NAME,
  buildPages,
  canonicalUrl,
  escapeHtml,
  loadSupabaseData,
  mainLinks,
} from './site-pages.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.join(root, 'dist')

const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/
const ROOT_DIV = '<div id="root"></div>'

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error('dist/index.html 에서 seo 구간 또는 root 요소를 찾지 못했습니다. index.html 을 확인하세요.')
}

// 모든 페이지의 <noscript> 에 넣는 공통 안내 링크
const COMMON_LINKS = [
  { href: '/', label: '메인' },
  { href: '/about', label: '회사소개' },
  { href: '/about/location', label: '오시는 길' },
  ...mainLinks(),
  { href: '/gallery', label: '시공사례' },
  { href: '/contact', label: '견적문의' },
  { href: '/privacy', label: '개인정보처리방침' },
]

const hrefOf = (p) => (p === '/' ? '/' : `${p}/`)

function seoBlock(page) {
  const url = canonicalUrl(page.path)
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const lines = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${escapeHtml(page.image)}" />`,
  ]
  // 가로·세로 크기는 기본 이미지일 때만 알고 있다
  if (page.image === DEFAULT_IMAGE) {
    lines.push('<meta property="og:image:width" content="1200" />', '<meta property="og:image:height" content="630" />')
  }
  return lines.join('\n    ')
}

function noscriptBlock(page) {
  const seen = new Set()
  const items = [...page.links, ...COMMON_LINKS]
    .filter((l) => (seen.has(l.href) ? false : seen.add(l.href)))
    .map((l) => `<li><a href="${hrefOf(l.href)}">${escapeHtml(l.label)}</a></li>`)
    .join('')
  return [
    '<noscript>',
    `<h1>${escapeHtml(page.title)}</h1>`,
    `<p>${escapeHtml(page.description)}</p>`,
    `<ul>${items}</ul>`,
    '<p>삼보아트 · 인천시 남동구 인주대로 725, 1층 삼보아트 · 전화 010-4439-4306, 032-465-1933</p>',
    '</noscript>',
  ].join('')
}

function render(page) {
  return template
    .replace(SEO_BLOCK, () => seoBlock(page))
    .replace(ROOT_DIV, () => `${ROOT_DIV}${noscriptBlock(page)}`)
}

function writePage(urlPath, html) {
  const file = urlPath === '/' ? path.join(DIST, 'index.html') : path.join(DIST, urlPath, 'index.html')
  const dir = path.dirname(file)
  if (fs.existsSync(dir) && !fs.statSync(dir).isDirectory()) throw new Error(`${dir} 가 폴더가 아닙니다.`)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(file, html)
}

const data = await loadSupabaseData()
const pages = buildPages(data)

for (const page of pages) writePage(page.path, render(page))

// /admin : 검색 제외 사본 (응답 코드도 200)
writePage(
  '/admin',
  template.replace(
    SEO_BLOCK,
    () => `<title>관리자 | ${SITE_NAME}</title>\n    <meta name="robots" content="noindex, nofollow" />`
  )
)

const withPhoto = pages.filter((p) => p.image !== DEFAULT_IMAGE).length
console.log(
  `[pages] 페이지 사본 ${pages.length}개 + admin 1개 생성 (대표 사진 사용 ${withPhoto}개, Supabase ${data.ok ? '연결됨' : '기본값 사용'})`
)
