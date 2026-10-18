import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/categories.js'

const FORMSPREE_URL = 'https://formspree.io/f/mnpjgyew'
const PRODUCT_OPTIONS = [...CATEGORIES.map((c) => c.name), '기타']

const MESSAGES = {
  name: '이름을 입력해 주세요.',
  phone: '전화번호를 입력해 주세요.',
  phoneFormat: '전화번호를 정확히 입력해 주세요.',
  products: '제품을 하나 이상 선택해 주세요.',
  message: '문의 내용을 입력해 주세요.',
  agree: '개인정보 수집·이용에 동의해 주세요.',
}

const EMPTY = { name: '', phone: '', email: '', products: [], message: '', agree: false, _gotcha: '' }

// 숫자·하이픈·공백만 허용, 하이픈/공백을 뺀 숫자가 9~11자리
function isValidPhone(value) {
  if (!/^[0-9- ]+$/.test(value)) return false
  const digits = value.replace(/[- ]/g, '').length
  return digits >= 9 && digits <= 11
}

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = MESSAGES.name
  if (!v.phone.trim()) e.phone = MESSAGES.phone
  else if (!isValidPhone(v.phone)) e.phone = MESSAGES.phoneFormat
  if (v.products.length === 0) e.products = MESSAGES.products
  if (!v.message.trim()) e.message = MESSAGES.message
  if (!v.agree) e.agree = MESSAGES.agree
  return e
}

function FieldError({ text }) {
  return text ? <p className="field-error">{text}</p> : null
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | fail

  // 입력 중에는 오류를 새로 띄우지 않고, 고친 항목의 오류만 지운다
  const set = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => {
      if (!e[key]) return e
      const { [key]: _removed, ...rest } = e
      return rest
    })
  }

  const toggleProduct = (name) =>
    set('products', values.products.includes(name)
      ? values.products.filter((p) => p !== name)
      : [...values.products, name])

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (status === 'sending') return
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          이름: values.name,
          전화번호: values.phone,
          이메일: values.email,
          제품선택: values.products.join(', '),
          문의내용: values.message,
          개인정보동의: '동의',
          _gotcha: values._gotcha, // 스팸 방지용 숨김 항목 (Formspree 스팸 차단)
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setValues(EMPTY)
      setStatus('success')
      window.scrollTo({ top: 0, behavior: 'instant' })
    } catch {
      setStatus('fail')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-page">
        <div className="contact-success">
          <h1 className="font-title">문의가 접수되었습니다</h1>
          <p className="font-body success-sub">확인 후 연락드리겠습니다.</p>
          <Link to="/" className="btn-home font-body">메인으로</Link>
        </div>
      </div>
    )
  }

  const cls = (key) => `field-input${errors[key] ? ' has-error' : ''}`

  return (
    <div className="contact-page">
      <h1 className="font-title contact-title">견적문의</h1>
      <p className="font-body contact-guide">전화 주시면 더 빠르게 상담해 드립니다.</p>

      <form className="contact-form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="c-name" className="font-body field-label">이름 *</label>
          <input id="c-name" type="text" className={cls('name')} value={values.name}
            onChange={(e) => set('name', e.target.value)} autoComplete="name" />
          <FieldError text={errors.name} />
        </div>

        <div className="field">
          <label htmlFor="c-phone" className="font-body field-label">전화번호 *</label>
          <input id="c-phone" type="tel" className={cls('phone')} value={values.phone}
            onChange={(e) => set('phone', e.target.value)} autoComplete="tel"
            placeholder="010-1234-5678" />
          <FieldError text={errors.phone} />
        </div>

        <div className="field">
          <label htmlFor="c-email" className="font-body field-label">이메일</label>
          <input id="c-email" type="email" className="field-input" value={values.email}
            onChange={(e) => set('email', e.target.value)} autoComplete="email" />
        </div>

        <div className="field">
          <span className="font-body field-label">제품 선택 *</span>
          <div className={`product-options${errors.products ? ' has-error' : ''}`}>
            {PRODUCT_OPTIONS.map((name) => (
              <label key={name} className="check font-body">
                <input type="checkbox" checked={values.products.includes(name)}
                  onChange={() => toggleProduct(name)} />
                <span>{name}</span>
              </label>
            ))}
          </div>
          <FieldError text={errors.products} />
        </div>

        <div className="field">
          <label htmlFor="c-message" className="font-body field-label">문의 내용 *</label>
          <textarea id="c-message" className={`${cls('message')} field-textarea`} value={values.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="예) 매장에 진열대를 놓으려고 합니다. 공간은 가로 3m 정도이고 이번 달 안에 설치를 희망합니다. 사이즈는 XXX입니다." />
          <FieldError text={errors.message} />
        </div>

        <div className="field">
          <label className="check font-body">
            <input type="checkbox" checked={values.agree} onChange={(e) => set('agree', e.target.checked)} />
            <span>[필수] 개인정보 수집·이용에 동의합니다.</span>
          </label>
          <p className="privacy-note">
{`· 수집 항목 : 이름, 전화번호, 이메일(선택)
· 수집 목적 : 견적 문의 답변
· 보유 기간 : 문의 처리 완료 후 6개월`}
          </p>
          <FieldError text={errors.agree} />
        </div>

        {/* 스팸 방지용 숨김 항목: 사람은 비워 둔다 */}
        <input type="text" name="_gotcha" className="hp-field" tabIndex={-1} autoComplete="off"
          value={values._gotcha} onChange={(e) => set('_gotcha', e.target.value)} aria-hidden="true" />

        <button type="submit" className="btn-submit font-sub" disabled={status === 'sending'}>
          문의 남기기
        </button>

        {status === 'fail' && (
          <p className="font-body form-result fail" role="alert">
            전송에 실패했습니다. <a href="tel:01044394306" className="tel-link">010-4439-4306</a>
            으로 전화 주시면 바로 상담해 드리겠습니다.
          </p>
        )}
      </form>
    </div>
  )
}
