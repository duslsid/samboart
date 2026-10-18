import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (err) setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    setBusy(false)
  }

  return (
    <div className="adm-login">
      <form onSubmit={submit}>
        <h1>관리자 로그인</h1>
        <label>이메일
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </label>
        <label>비밀번호
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" required />
        </label>
        {error && <p className="adm-error">{error}</p>}
        <button type="submit" className="adm-btn primary" disabled={busy}>로그인</button>
      </form>
    </div>
  )
}
