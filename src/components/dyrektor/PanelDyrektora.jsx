export function PanelDyrektora({ classes, students, exits, session }) {
  const totalClasses = classes?.length || 0
  const totalStudents = students?.length || 0
  const activeExits = (exits || []).filter((exit) => exit.exit_time && !exit.return_time).length

  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0, 0, 0, 0)

  const monthExits = (exits || []).filter((exit) => {
    if (!exit.exit_time) return false
    return new Date(exit.exit_time) >= currentMonth
  }).length

  const completedExits = (exits || []).filter((exit) => exit.exit_time && exit.return_time).length

  const reasonCounts = (exits || []).reduce((acc, exit) => {
    const reason = (exit.reason || exit.lesson_name || 'Brak powodu').trim()
    acc[reason] = (acc[reason] || 0) + 1
    return acc
  }, {})

  const mostCommonReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <section className="director-panel" aria-labelledby="director-title">
      <header className="homeroom-heading d-flex align-items-center justify-content-between">
        <div>
          <span className="homeroom-eyebrow">Panel dyrektora</span>
          <h2 id="director-title">Raport wyjść uczniów</h2>
          <p>{session?.user?.email || 'Dyrektor'} · podsumowanie wyjść w szkole</p>
        </div>
        <span className="homeroom-class-badge">Dyrektor</span>
      </header>

      <div className="homeroom-metrics">
        <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
          <span>Klasy</span>
          <strong>{totalClasses}</strong>
          <small>w szkole</small>
        </article>
        <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
          <span>Uczniowie</span>
          <strong>{totalStudents}</strong>
          <small>w systemie</small>
        </article>
        <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
          <span>Wyjścia w miesiącu</span>
          <strong>{monthExits}</strong>
          <small>zarejestrowane od początku miesiąca</small>
        </article>
        <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
          <span>Aktywne wyjścia</span>
          <strong>{activeExits}</strong>
          <small>na ten moment</small>
        </article>
      </div>

      <div className="homeroom-insights">
        <section className="homeroom-activity">
          <h3>Najważniejsze dane</h3>
          <ul className="director-list">
            <li>Łącznie zakończonych wyjść: {completedExits}</li>
            <li>Najczęstszy powód: {mostCommonReason ? mostCommonReason[0] : 'brak danych'}</li>
            <li>Wyjścia bieżącego miesiąca: {monthExits}</li>
            <li>Aktualnie poza salą: {activeExits}</li>
          </ul>
        </section>

        <div className="homeroom-highlights">
          <article className="d-flex flex-column justify-content-center">
            <span>Najczęstszy powód</span>
            <strong>{mostCommonReason ? mostCommonReason[0] : 'Brak danych'}</strong>
            <small>{mostCommonReason ? `${mostCommonReason[1]} wyjść` : 'Brak raportów'}</small>
          </article>
          <article className="d-flex flex-column justify-content-center">
            <span>Priorytet</span>
            <strong>Wyjścia uczniów</strong>
            <small>zarejestrowane w rejestrze</small>
          </article>
        </div>
      </div>

      <div className="director-links">
        <span className="director-chip">Raport miesięczny</span>
        <span className="director-chip">Wyjścia</span>
        <span className="director-chip">Powody</span>
        <span className="director-chip">Zakończone</span>
      </div>
    </section>
  )
}
