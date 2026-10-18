import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import './admin.css'

export default function AdminApp() {
  const [session, setSession] = useState(undefined) // undefined = 확인 중

  // 검색에 노출되지 않도록
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!supabase) {
    return <p className="adm-hint adm-center">Supabase 연결 설정(.env)이 없습니다.</p>
  }
  if (session === undefined) return <p className="adm-hint adm-center">확인 중…</p>
  if (!session) return <Login />
  return <Dashboard email={session.user.email} />
}
