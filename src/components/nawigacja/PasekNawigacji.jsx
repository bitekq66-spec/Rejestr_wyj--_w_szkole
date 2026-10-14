export function PasekNawigacji({ session, activeView, onSetView, homeroomClass, onLogout, userRole }) {
  const normalizedRole = userRole || 'teacher'

  const primaryNavigation = []

  if (normalizedRole === 'administrator') {
    primaryNavigation.push({ key: 'admin', label: 'Panel administratora' })
  } else if (normalizedRole === 'director') {
    primaryNavigation.push({ key: 'director', label: 'Panel dyrektora' })
  } else {
    primaryNavigation.push({ key: 'register', label: 'Rejestr wyjść' })
    primaryNavigation.push({
      key: 'homeroom',
      label: 'Panel wychowawcy',
      badge: homeroomClass?.name,
    })
  }

  const roleLabel = {
    teacher: 'Nauczyciel',
    homeroom_teacher: 'Wychowawca',
    administrator: 'Administrator',
    director: 'Dyrektor',
  }[normalizedRole] || 'Użytkownik'

  return (
    <header className="topbar">
      <div className="topbar-brand d-flex align-items-center">
        <img src="/logo-szkoly.png" alt="Logo szkoły" className="school-logo d-block" />
        <h1>Rejestr Wyjść Uczniów</h1>
      </div>

      <nav className="main-navigation d-flex align-items-center" aria-label="Główna nawigacja">
        {primaryNavigation.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`main-nav-button ${activeView === item.key ? 'main-nav-button-active' : ''}`}
            onClick={() => onSetView(item.key)}
          >
            {item.label}
            {item.badge && <span className="main-nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="teacher-profile d-flex align-items-center">
        <div className="teacher-copy d-flex flex-column align-items-end">
          <strong>{session.user.email}</strong>
          <span>{roleLabel}</span>
        </div>
        <span className="teacher-avatar" aria-hidden="true">
          {session.user.email?.charAt(0).toUpperCase()}
        </span>
        <button onClick={onLogout} className="logout-button" type="button">
          Wyloguj
        </button>
      </div>
    </header>
  )
}
