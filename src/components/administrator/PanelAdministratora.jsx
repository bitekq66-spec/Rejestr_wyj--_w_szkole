export function PanelAdministratora({ classes, students, exits, session }) {
  const totalClasses = classes?.length || 0
  const totalStudents = students?.length || 0
  const activeExits = (exits || []).filter((exit) => exit.exit_time && !exit.return_time).length

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayExits = (exits || []).filter((exit) => {
    if (!exit.exit_time) return false
    const date = new Date(exit.exit_time)
    return date >= today
  }).length

  const reasonCounts = (exits || []).reduce((acc, exit) => {
    const reason = (exit.reason || exit.lesson_name || 'Brak powodu').trim()
    acc[reason] = (acc[reason] || 0) + 1
    return acc
  }, {})

  const mostCommonReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0]
  const studentNameMap = Object.fromEntries((students || []).map((student) => [student.id, `${student.name} ${student.surname}`]))

  const recentExits = [...(exits || [])]
    .sort((first, second) => new Date(second.exit_time || 0) - new Date(first.exit_time || 0))
    .slice(0, 5)

  return (
    <section className="admin-panel" aria-labelledby="admin-title">
      <header className="homeroom-heading d-flex align-items-center justify-content-between">
        <div>
          <span className="homeroom-eyebrow">Panel administratora</span>
          <h2 id="admin-title">Wyjścia uczniów</h2>
          <p>{session?.user?.email || 'Administrator'} · przegląd rejestracji wyjść</p>
        </div>
        <span className="homeroom-class-badge">Admin</span>
      </header>

      <div className="homeroom-metrics">
        <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
          <span>Klasy</span>
          <strong>{totalClasses}</strong>
          <small>w systemie</small>
        </article>
        <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
          <span>Uczniowie</span>
          <strong>{totalStudents}</strong>
          <small>w bazie</small>
        </article>
        <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
          <span>Wyjścia dzisiaj</span>
          <strong>{todayExits}</strong>
          <small>zarejestrowane dziś</small>
        </article>
        <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
          <span>Aktywne wyjścia</span>
          <strong>{activeExits}</strong>
          <small>jeszcze nie zakończone</small>
        </article>
      </div>

      <div className="homeroom-insights">
        <section className="homeroom-activity">
          <h3>Ostatnie wyjścia</h3>
          {recentExits.length === 0 ? (
            <p className="homeroom-message">Brak zarejestrowanych wyjść.</p>
          ) : (
            <div className="history-table-wrap">
              <table className="history-table w-100">
                <thead>
                  <tr>
                    <th>Uczeń</th>
                    <th>Przedmiot</th>
                    <th>Powód</th>
                    <th>Wyjście</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExits.map((exit) => (
                    <tr key={exit.id}>
                      <td>{studentNameMap[exit.student_id] || 'Uczeń'}</td>
                      <td>{exit.lesson_name || '-'}</td>
                      <td>{exit.reason || '-'}</td>
                      <td>{exit.exit_time ? new Date(exit.exit_time).toLocaleString('pl-PL') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="homeroom-highlights">
          <article className="d-flex flex-column justify-content-center">
            <span>Najczęstszy powód</span>
            <strong>{mostCommonReason ? mostCommonReason[0] : 'Brak danych'}</strong>
            <small>{mostCommonReason ? `${mostCommonReason[1]} zarejestrowanych` : 'Brak wyjść'}</small>
          </article>
          <article className="d-flex flex-column justify-content-center">
            <span>Do podglądu</span>
            <strong>Wyjścia i powroty</strong>
            <small>dla wszystkich uczniów</small>
          </article>
        </div>
      </div>

      <div className="admin-links">
        <span className="admin-chip">Wyjścia</span>
        <span className="admin-chip">Powroty</span>
        <span className="admin-chip">Raporty</span>
        <span className="admin-chip">Uczniowie</span>
      </div>
    </section>
  )
}
