// 기획서 7. 제품 분류 (순서 고정). name 은 DB 에 저장된 한글 이름과 정확히 일치해야 한다.
// slug 는 주소·Storage 폴더용 영문 이름.
export const CATEGORIES = [
  {
    name: '곤도라', slug: 'gondola',
    subs: [
      { name: '일반곤도라', slug: 'general' },
      { name: '하이퍼곤도라', slug: 'hyper' },
      { name: '냉동고곤도라', slug: 'freezer' },
    ],
  },
  {
    name: '렉', slug: 'rack',
    subs: [
      { name: '파렛트렉', slug: 'pallet' },
      { name: '중량렉', slug: 'heavy' },
      { name: '슈퍼경량렉', slug: 'super-light' },
      { name: '창고경량렉', slug: 'warehouse-light' },
      { name: '메탈렉', slug: 'metal' },
      { name: '레귤러렉', slug: 'regular' },
    ],
  },
  {
    name: '앵글', slug: 'angle',
    subs: [
      { name: '무볼트앵글', slug: 'boltless' },
      { name: '볼트조립식앵글', slug: 'bolt' },
      { name: '코팅합판', slug: 'coated-plywood' },
      { name: '일반합판', slug: 'plywood' },
    ],
  },
  {
    name: '찬넬', slug: 'channel',
    subs: [
      { name: '25피치', slug: 'pitch-25' },
      { name: '35피치', slug: 'pitch-35' },
    ],
  },
  {
    name: '망/후크', slug: 'mesh-hook',
    subs: [
      { name: '메쉬망', slug: 'mesh' },
      { name: '타공판', slug: 'punched-board' },
      { name: 'EX망', slug: 'ex-mesh' },
      { name: '망후크', slug: 'mesh-hook' },
      { name: '타공판후크', slug: 'punched-hook' },
      { name: '각파이프후크', slug: 'square-pipe-hook' },
      { name: '월후크', slug: 'wall-hook' },
    ],
  },
  {
    name: '제작진열대', slug: 'custom-display',
    subs: [
      { name: '냉동고고정식', slug: 'fixed-freezer' },
      { name: '껌진열대', slug: 'gum' },
      { name: '빵진열대', slug: 'bread' },
      { name: '주문제작상품', slug: 'custom-order' },
    ],
  },
  {
    name: '시스템행거', slug: 'system-hanger',
    subs: [{ name: '시스템행거', slug: 'system-hanger' }],
  },
  {
    name: '액자걸이(화방걸이)', slug: 'frame-hanger',
    subs: [{ name: '액자걸이(화방걸이)', slug: 'frame-hanger' }],
  },
  {
    name: '부속및파이프류', slug: 'parts-pipe',
    subs: [
      { name: '원파이프', slug: 'round-pipe' },
      { name: '각파이프', slug: 'square-pipe' },
      { name: 'ㄱ자칸막이', slug: 'divider' },
      { name: '망바구니', slug: 'mesh-basket' },
    ],
  },
]

export const findCategory = (slug) => CATEGORIES.find((c) => c.slug === slug)

export const findSub = (catSlug, subSlug) => {
  const category = findCategory(catSlug)
  const sub = category?.subs.find((s) => s.slug === subSlug)
  return category && sub ? { category, sub } : null
}

export const categoryPath = (c) => `/products/${c.slug}`
export const subPath = (c, s) => `/products/${c.slug}/${s.slug}`
