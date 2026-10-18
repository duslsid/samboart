import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// .env 가 없어도 사이트가 죽지 않도록 null 로 두고, api.js 가 빈 결과를 돌려준다.
export const supabase = url && key ? createClient(url, key) : null

export const BUCKET = 'samboart'
