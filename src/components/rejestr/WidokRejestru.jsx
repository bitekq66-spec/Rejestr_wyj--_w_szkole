import { calculateDuration, formatDuration, isExitActive } from '../../utils/dateUtils'

export function WidokRejestru({
  classes,
  students,
  selectedClass,
  selectedStudent,
  studentSearch,
  dataLoading,
  exits,
  exitsLoading,
  showAddExit,
  lessonName,
  reason,
  addingExit,
  onSelectClass,
  onStudentSearch,
  onStudentClick,
  onToggleAddExit,
  onResetExitForm,
  onAddExit,
  onReturnExit,
  onDeleteExit,
  onLessonChange,
  onReasonChange,
}) {
  const filteredStudents = students.filter((student) =>
    `${student.name || ''} ${student.surname || ''}`
      .toLocaleLowerCase('pl-PL')
      .includes(studentSearch.trim().toLocaleLowerCase('pl-PL'))
  )

  const completedExits = exits.filter((exit) => exit.exit_time && exit.return_time)
  const totalStudentCompletedDurationMs = completedExits.reduce(
    (total, exit) => total + (new Date(exit.return_time).getTime() - new Date(exit.exit_time).getTime() || 0),
    0
  )
  const averageExitDurationMs = completedExits.length ? totalStudentCompletedDurationMs / completedExits.length : 0

  const quickReasons = [
    'Toaleta',
    'Sekretariat',
    'Gabinet pedagoga',
    'Pielęgniarka',
  ]

  function handleQuickReasonClick(value) {
    onReasonChange(value)
  }

  return (
    <>
      <section className="class-section class-toolbar">
        <label className="class-picker d-flex flex-column justify-content-center">
          <span>Wybierz klasę</span>
          <select value={selectedClass} onChange={(event) => onSelectClass(event.target.value)} className="class-select">
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </label>

        <div className="school-year d-flex flex-column justify-content-center">
          <span>Rok szkolny</span>
          <strong>
            {new Date().getMonth() >= 8
              ? `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
              : `${new Date().getFullYear() - 1}/${new Date().getFullYear()}`}
          </strong>
        </div>

        <label className="student-search d-flex align-items-center">
          <span className="search-icon" aria-hidden="true" />
          <input
            type="search"
            value={studentSearch}
            onChange={(event) => onStudentSearch(event.target.value)}
            placeholder="Szukaj ucznia..."
            aria-label="Szukaj ucznia"
          />
        </label>
      </section>

      <div className="dashboard-grid">
        <section className="students-card">
          <div className="student-table-head">
            <span>Nr</span>
            <span>Imię i nazwisko</span>
            <span>Klasa</span>
          </div>

          {dataLoading ? (
            <div className="empty-state"><p>Ładowanie uczniów...</p></div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state">
              <p>{students.length ? 'Nie znaleziono ucznia.' : 'Brak uczniów w tej klasie.'}</p>
            </div>
          ) : (
            <div className="students-list">
              {filteredStudents.map((student, index) => (
                <button
                  type="button"
                  key={student.id}
                  onClick={() => onStudentClick(student)}
                  className={`student-item w-100 m-0 ${selectedStudent?.id === student.id ? 'student-item-active' : ''}`}
                  aria-pressed={selectedStudent?.id === student.id}
                >
                  <span className="student-number">{index + 1}</span>
                  <strong className="student-name text-truncate">
                    {student.name} {student.surname}
                  </strong>
                  <span className="student-class-name">
                    {classes.find((classItem) => classItem.id === student.class_id)?.name || ''}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="exits-card">
          {selectedStudent ? (
            <div className="student-detail">
              <header className="selected-student-header d-flex align-items-end justify-content-between">
                <div className="selected-student-info">
                  <span className="student-class-tag">
                    Uczeń klasy {classes.find((classItem) => classItem.id === selectedStudent.class_id)?.name}
                  </span>
                  <h2>
                    {selectedStudent.name} {selectedStudent.surname}
                  </h2>
                </div>

                <button
                  type="button"
                  className="add-exit-button"
                  onClick={() => {
                    if (showAddExit) onResetExitForm()
                    onToggleAddExit()
                  }}
                >
                  {showAddExit ? 'Anuluj' : '+ Dodaj wyjście'}
                </button>
              </header>

              <div className="student-stats">
                <div className="stat-card d-flex flex-column justify-content-center">
                  <span>Łączna liczba wyjść</span>
                  <strong>{exits.length}</strong>
                </div>
                <div className="stat-card d-flex flex-column justify-content-center">
                  <span>Średni czas wyjścia</span>
                  <strong>{completedExits.length ? formatDuration(averageExitDurationMs) : '0 s'}</strong>
                </div>
                <div className="stat-card d-flex flex-column justify-content-center">
                  <span>Łączny czas wyjść</span>
                  <strong>{completedExits.length ? formatDuration(totalStudentCompletedDurationMs) : '0 s'}</strong>
                </div>
              </div>

              <section className="history-section">
                <h3>Ostatnia historia wyjść</h3>

                {exitsLoading ? (
                  <div className="empty-state"><p>Ładowanie historii...</p></div>
                ) : exits.length === 0 ? (
                  <div className="empty-state"><p>Brak zarejestrowanych wyjść.</p></div>
                ) : (
                  <div className="history-table-wrap">
                    <table className="history-table w-100">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Wyjście</th>
                          <th>Powrót</th>
                          <th>Czas</th>
                          <th>Powód</th>
                          <th aria-label="Akcje" />
                        </tr>
                      </thead>
                      <tbody>
                        {exits.map((exit) => {
                          const active = isExitActive(exit)
                          const exitDate = exit.exit_time ? new Date(exit.exit_time) : null
                          const durationMs =
                            exit.return_time && exitDate
                              ? Math.max(0, new Date(exit.return_time).getTime() - exitDate.getTime())
                              : null

                          return (
                            <tr key={exit.id}>
                              <td>{exitDate ? exitDate.toLocaleDateString('pl-PL') : '-'}</td>
                              <td>
                                {exitDate
                                  ? exitDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
                                  : '-'}
                              </td>
                              <td className={active ? 'not-returned' : ''}>
                                {exit.return_time
                                  ? new Date(exit.return_time).toLocaleTimeString('pl-PL', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'W trakcie'}
                              </td>
                              <td className={active ? 'not-returned' : ''}>
                                {durationMs === null ? calculateDuration(exit.exit_time, null) : formatDuration(durationMs)}
                              </td>
                              <td>{exit.reason || exit.lesson_name || '-'}</td>
                              <td className="history-actions d-flex">
                                {active && (
                                  <button type="button" className="return-button" onClick={() => onReturnExit(exit.id)}>
                                    Powrót
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="delete-exit-button"
                                  onClick={() => onDeleteExit(exit.id)}
                                  aria-label="Usuń wyjście"
                                >
                                  Usuń
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {showAddExit && (
                <form className="add-exit-form" onSubmit={onAddExit}>
                  <h3>Dodaj nowe wyjście</h3>
                  <div className="exit-form-fields">
                    <label className="form-field d-flex flex-column">
                      <span>Przedmiot / lekcja</span>
                      <select className="w-100" value={lessonName} onChange={(event) => onLessonChange(event.target.value)} required>
                        <option value="">Wybierz lekcję</option>
                        <option value="Polski">Polski</option>
                        <option value="Matematyka">Matematyka</option>
                        <option value="Angielski">Angielski</option>
                        <option value="Historia">Historia</option>
                      </select>
                    </label>

                    <label className="form-field d-flex flex-column">
                      <span>Powód wyjścia</span>
                      <div className="reason-picker-block">
                        <div className="reason-quick-list">
                          {quickReasons.map((quickReason) => (
                            <button
                              key={quickReason}
                              type="button"
                              className={`reason-chip ${reason === quickReason ? 'reason-chip-active' : ''}`}
                              onClick={() => handleQuickReasonClick(quickReason)}
                            >
                              {quickReason}
                            </button>
                          ))}
                        </div>
                        <input
                          className="w-100"
                          type="text"
                          value={reason}
                          onChange={(event) => onReasonChange(event.target.value)}
                          placeholder="Lub wpisz inny powód..."
                        />
                      </div>
                    </label>

                    <button type="submit" className="save-exit-button" disabled={addingExit}>
                      {addingExit ? 'Dodawanie...' : '+ Dodaj'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="no-student d-flex flex-column justify-content-center align-items-center">
              <h2>Wybierz ucznia</h2>
              <p>Wybierz osobę z listy, aby zobaczyć historię jej wyjść.</p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
