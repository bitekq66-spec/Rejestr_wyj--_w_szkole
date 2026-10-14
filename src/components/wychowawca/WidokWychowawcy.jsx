import { formatDuration } from '../../utils/dateUtils'

export function WidokWychowawcy({
  homeroomTeacher,
  homeroomClass,
  homeroomStudents,
  homeroomExits,
  homeroomLoading,
  homeroomError,
}) {
  const currentMonthStart = new Date()
  currentMonthStart.setDate(1)
  currentMonthStart.setHours(0, 0, 0, 0)

  const homeroomMonthExits = homeroomExits.filter(
    (exit) => exit.exit_time && new Date(exit.exit_time) >= currentMonthStart
  )
  const homeroomActiveExits = homeroomExits.filter((exit) => exit.exit_time && !exit.return_time)
  const homeroomActiveDurationMs = homeroomActiveExits.reduce((total, exit) => {
    const start = new Date(exit.exit_time).getTime()
    const end = Date.now()
    return total + (end - start > 0 ? end - start : 0)
  }, 0)

  const homeroomCompletedExits = homeroomExits.filter((exit) => exit.exit_time && exit.return_time)
  const homeroomTotalDurationMs = homeroomCompletedExits.reduce((total, exit) => {
    const start = new Date(exit.exit_time).getTime()
    const end = new Date(exit.return_time).getTime()
    return total + (end > start ? end - start : 0)
  }, 0)
  const homeroomAverageDurationMs = homeroomCompletedExits.length ? homeroomTotalDurationMs / homeroomCompletedExits.length : 0

  const homeroomReasonCounts = homeroomExits.reduce((counts, exit) => {
    const reasonName = exit.reason?.trim() || exit.lesson_name?.trim()
    if (reasonName) {
      counts[reasonName] = (counts[reasonName] || 0) + 1
    }
    return counts
  }, {})
  const mostCommonHomeroomReason = Object.entries(homeroomReasonCounts).sort((first, second) => second[1] - first[1])[0]

  const homeroomStudentExitCounts = homeroomStudents.map((student) => {
    const studentExits = homeroomExits.filter((exit) => exit.student_id === student.id)
    const studentCompletedExits = studentExits.filter((exit) => exit.exit_time && exit.return_time)
    const studentTotalDurationMs = studentCompletedExits.reduce((total, exit) => {
      const start = new Date(exit.exit_time).getTime()
      const end = new Date(exit.return_time).getTime()
      return total + (end > start ? end - start : 0)
    }, 0)
    const studentAverageDurationMs = studentCompletedExits.length ? studentTotalDurationMs / studentCompletedExits.length : null

    return {
      ...student,
      exitCount: studentExits.length,
      monthExitCount: studentExits.filter((exit) => exit.exit_time && new Date(exit.exit_time) >= currentMonthStart).length,
      activeExitCount: studentExits.filter((exit) => exit.exit_time && !exit.return_time).length,
      averageDurationMs: studentAverageDurationMs,
    }
  })

  const mostFrequentHomeroomStudent = [...homeroomStudentExitCounts].sort((first, second) => second.exitCount - first.exitCount)[0]

  const homeroomWeeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() - (6 - index))
    const nextDay = new Date(day)
    nextDay.setDate(nextDay.getDate() + 1)

    const count = homeroomExits.filter((exit) => {
      const exitDate = new Date(exit.exit_time)
      return exitDate >= day && exitDate < nextDay
    }).length

    return {
      label: day.toLocaleDateString('pl-PL', { weekday: 'short' }).replace('.', ''),
      count,
    }
  })

  const maxHomeroomDailyExits = Math.max(1, ...homeroomWeeklyActivity.map((day) => day.count))

  return (
    <section className="homeroom-panel" aria-labelledby="homeroom-title">
      <header className="homeroom-heading d-flex align-items-center justify-content-between">
        <div>
          <span className="homeroom-eyebrow">Panel wychowawcy</span>
          <h2 id="homeroom-title">{homeroomClass ? `Klasa ${homeroomClass.name}` : 'Statystyki klasy'}</h2>
          <p>
            {homeroomTeacher
              ? `${homeroomTeacher.name} ${homeroomTeacher.surname} · podsumowanie wyjść uczniów`
              : 'Statystyki przypisanej klasy'}
          </p>
        </div>
        {homeroomClass && <span className="homeroom-class-badge">{homeroomClass.name}</span>}
      </header>

      {homeroomLoading ? (
        <p className="homeroom-message">Wczytywanie statystyk klasy...</p>
      ) : homeroomError ? (
        <p className="homeroom-message homeroom-message-error">{homeroomError}</p>
      ) : (
        <>
          <div className="homeroom-metrics">
            <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
              <span>Uczniowie w klasie</span>
              <strong>{homeroomStudents.length}</strong>
              <small>łącznie</small>
            </article>
            <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
              <span>Wyjścia w tym miesiącu</span>
              <strong>{homeroomMonthExits.length}</strong>
              <small>od {currentMonthStart.toLocaleDateString('pl-PL')}</small>
            </article>
            <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
              <span>Aktywne wyjścia</span>
              <strong>{homeroomActiveExits.length}</strong>
              <small>rozpoczęte i jeszcze nie zakończone</small>
            </article>
            <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
              <span>Średni czas</span>
              <strong>{homeroomCompletedExits.length ? formatDuration(homeroomAverageDurationMs) : '0 s'}</strong>
              <small>średnia z dokładnością do sekundy</small>
            </article>
            <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
              <span>Łączny czas wyjść</span>
              <strong>{homeroomCompletedExits.length ? formatDuration(homeroomTotalDurationMs) : '0 s'}</strong>
              <small>wszystkie zakończone wyjścia</small>
            </article>
            <article className="homeroom-metric d-flex flex-column align-items-start justify-content-center">
              <span>Łączny czas aktywnych wyjść</span>
              <strong>{homeroomActiveExits.length ? formatDuration(homeroomActiveDurationMs) : '0 s'}</strong>
              <small>obecnie w trakcie realizacji</small>
            </article>
          </div>

          <div className="homeroom-insights">
            <section className="homeroom-activity">
              <h3>Aktywność · ostatnie 7 dni</h3>
              <div className="activity-chart">
                {homeroomWeeklyActivity.map((day) => (
                  <div className="activity-column" key={day.label}>
                    <span className="activity-count">{day.count || ''}</span>
                    <div className="activity-bar-track">
                      <span
                        className="activity-bar"
                        style={{
                          height: `${day.count ? Math.max(12, (day.count / maxHomeroomDailyExits) * 100) : 4}%`,
                        }}
                      />
                    </div>
                    <span className="activity-day">{day.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="homeroom-highlights">
              <article className="d-flex flex-column justify-content-center">
                <span>Najczęstszy powód</span>
                <strong>{mostCommonHomeroomReason?.[0] || 'Brak danych'}</strong>
                <small>
                  {mostCommonHomeroomReason
                    ? `${mostCommonHomeroomReason[1]} ${mostCommonHomeroomReason[1] === 1 ? 'wyjście' : 'wyjścia'}`
                    : 'Nie zarejestrowano wyjść'}
                </small>
              </article>
              <article className="d-flex flex-column justify-content-center">
                <span>Najwięcej wyjść</span>
                <strong>
                  {mostFrequentHomeroomStudent?.exitCount
                    ? `${mostFrequentHomeroomStudent.name} ${mostFrequentHomeroomStudent.surname}`
                    : 'Brak danych'}
                </strong>
                <small>
                  {mostFrequentHomeroomStudent?.exitCount
                    ? `${mostFrequentHomeroomStudent.exitCount} zarejestrowanych wyjść`
                    : 'Nie zarejestrowano wyjść'}
                </small>
              </article>
            </div>
          </div>

          <section className="homeroom-roster" aria-labelledby="homeroom-roster-title">
            <header className="homeroom-roster-heading d-flex align-items-center justify-content-between">
              <div>
                <h3 id="homeroom-roster-title">Uczniowie klasy {homeroomClass?.name}</h3>
                <p>Statystyki wyjść dla każdego ucznia</p>
              </div>
              <span>{homeroomStudents.length} uczniów</span>
            </header>

            {homeroomStudentExitCounts.length === 0 ? (
              <p className="homeroom-message">W tej klasie nie ma jeszcze uczniów.</p>
            ) : (
              <div className="homeroom-roster-table-wrap">
                <table className="homeroom-roster-table w-100">
                  <thead>
                    <tr>
                      <th>Nr</th>
                      <th>Uczeń</th>
                      <th>Wyjścia w tym miesiącu</th>
                      <th>Łącznie</th>
                      <th>Status wyjścia</th>
                      <th>Średni czas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeroomStudentExitCounts.map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td className="homeroom-roster-name">
                          {student.name} {student.surname}
                        </td>
                        <td>{student.monthExitCount}</td>
                        <td>{student.exitCount}</td>
                        <td>
                          <span className={`roster-status ${student.activeExitCount ? 'roster-status-away' : ''}`}>
                            {student.activeExitCount ? `Aktywne (${student.activeExitCount})` : 'Brak aktywnych'}
                          </span>
                        </td>
                        <td>{student.averageDurationMs === null ? '-' : formatDuration(student.averageDurationMs)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  )
}
