export default function Notice({ notice }) {
  if (!notice) return null
  return (
    <div className={`adm-notice ${notice.type}`} role="status">
      <p>{notice.text}</p>
      {notice.files?.length > 0 && (
        <ul>
          {notice.files.map((name) => <li key={name}>{name}</li>)}
        </ul>
      )}
    </div>
  )
}
