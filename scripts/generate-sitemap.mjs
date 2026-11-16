// 빌드(vite build) 뒤에 GitHub Actions에서 실행된다. (package.json 의 build 스크립트)
// 공개 페이지 목록(scripts/site-pages.mjs)으로 dist/sitemap.xml 을 만든다. /admin 은 목록에 없으므로 들어가지 않는다.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildPages, canonicalUrl, escapeHtml } from './site-pages.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.join(root, 'dist')

// 주소 목록만 필요하므로 Supabase 는 읽지 않는다.
const pages = buildPages({ categoryPhoto: {}, firstProductPhoto: {}, description: {}, galleryPhoto: null })

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map((p) => `  <url><loc>${escapeHtml(canonicalUrl(p.path))}</loc></url>`),
  '</urlset>',
  '',
].join('\n')

fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml)
console.log(`[sitemap] sitemap.xml 생성 (주소 ${pages.length}개)`)
