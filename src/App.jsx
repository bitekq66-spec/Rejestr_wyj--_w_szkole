import { useEffect, useRef, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabaseClient'
import { EkranLogowania } from './components/logowanie/EkranLogowania'
import { PasekNawigacji } from './components/nawigacja/PasekNawigacji'
import { WidokRejestru } from './components/rejestr/WidokRejestru'
import { WidokWychowawcy } from './components/wychowawca/WidokWychowawcy'
import { PanelAdministratora } from './components/administrator/PanelAdministratora'
import { PanelDyrektora } from './components/dyrektor/PanelDyrektora'
import {
  addStudentExitRecord,
  deleteStudentExitRecord,
  getClassesFromSupabase,
  getHomeroomDataByEmail,
  getStudentExitsByStudent,
  getStudentsByClass,
  getTeacherProfileByEmail,
  returnStudentExitRecord,
} from './services/appService'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem('rememberedEmail')))
  const [activeView, setActiveView] = useState('register')
  const [userRole, setUserRole] = useState('teacher')

  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [allSchoolStudents, setAllSchoolStudents] = useState([])
  const [allSchoolExits, setAllSchoolExits] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [dataLoading, setDataLoading] = useState(false)
  const [studentSearch, setStudentSearch] = useState('')

  const [homeroomTeacher, setHomeroomTeacher] = useState(null)
  const [homeroomClass, setHomeroomClass] = useState(null)
  const [homeroomStudents, setHomeroomStudents] = useState([])
  const [homeroomExits, setHomeroomExits] = useState([])
  const [homeroomLoading, setHomeroomLoading] = useState(false)
  const [homeroomError, setHomeroomError] = useState('')

  const selectedStudentRef = useRef(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [exits, setExits] = useState([])
  const [exitsLoading, setExitsLoading] = useState(false)
  const [showAddExit, setShowAddExit] = useState(false)
  const [lessonName, setLessonName] = useState('')
  const [reason, setReason] = useState('')
  const [addingExit, setAddingExit] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function handleLogin(event) {
    event.preventDefault()

    setError('')
    setAuthNotice('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError('Nieprawidłowy email lub hasło.')
      return
    }

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email)
    } else {
      localStorage.removeItem('rememberedEmail')
    }
  }

  async function handlePasswordReset() {
    setError('')
    setAuthNotice('')

    if (!email.trim()) {
      setError('Wpisz adres e-mail, aby otrzymać link do zmiany hasła.')
      return
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })

    if (resetError) {
      setError('Nie udało się wysłać linku. Skontaktuj się z administratorem szkoły.')
      return
    }

    setAuthNotice('Jeśli konto istnieje, otrzymasz wiadomość z linkiem do zmiany hasła.')
  }

  async function loadClasses() {
    const { data, error } = await getClassesFromSupabase()

    if (error) {
      console.error('Błąd pobierania klas:', error)
      return
    }

    setClasses(data || [])

    if (data?.length) {
      setSelectedClass(String(data[0].id))
    }
  }

  async function loadUserRole(userEmail) {
    if (!userEmail) {
      setUserRole('teacher')
      return
    }

    const { data, error } = await getTeacherProfileByEmail(userEmail)

    if (error || !data) {
      console.error('Nie udało się pobrać roli użytkownika:', error)
      setUserRole('teacher')
      return
    }

    const nextRole = data.role || 'teacher'
    setUserRole(nextRole)

    if (nextRole === 'administrator') {
      setActiveView('admin')
      return
    }

    if (nextRole === 'director') {
      setActiveView('director')
      return
    }

    if (nextRole === 'homeroom_teacher') {
      setActiveView('homeroom')
      return
    }

    setActiveView('register')
  }

  async function loadSchoolWideData() {
    const { data: schoolStudents, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .order('surname')

    if (studentsError) {
      console.error('Błąd pobierania wszystkich uczniów:', studentsError)
    } else {
      setAllSchoolStudents(schoolStudents || [])
    }

    const { data: schoolExits, error: exitsError } = await supabase
      .from('students_exits')
      .select('*')
      .order('exit_time', { ascending: false })

    if (exitsError) {
      console.error('Błąd pobierania wszystkich wyjść:', exitsError)
    } else {
      setAllSchoolExits(schoolExits || [])
    }
  }

  async function loadHomeroomData(userEmail, { silent = false } = {}) {
    if (!silent) {
      setHomeroomLoading(true)
      setHomeroomError('')
      setHomeroomTeacher(null)
      setHomeroomClass(null)
      setHomeroomStudents([])
      setHomeroomExits([])
    }

    const { teacher, homeroomClass, homeroomStudents, homeroomExits, error } = await getHomeroomDataByEmail(userEmail)

    if (error) {
      setHomeroomError(error)
      setHomeroomLoading(false)
      return
    }

    setHomeroomTeacher(teacher)
    setHomeroomClass(homeroomClass)
    setHomeroomStudents(homeroomStudents)
    setHomeroomExits(homeroomExits)
    setHomeroomLoading(false)
  }

  async function loadStudents(classId) {
    if (!classId) {
      setStudents([])
      return
    }

    setDataLoading(true)

    const { data, error } = await getStudentsByClass(classId)

    if (error) {
      console.error('Błąd pobierania uczniów:', error)
      setStudents([])
    } else {
      setStudents(data || [])
    }

    setDataLoading(false)
  }

  async function loadStudentExits(studentId) {
    if (!studentId) {
      setExits([])
      return
    }

    setExitsLoading(true)

    const { data, error } = await getStudentExitsByStudent(studentId)

    if (error) {
      console.error('Błąd pobierania wyjść:', error)
      setExits([])
    } else {
      setExits(data || [])
    }

    setExitsLoading(false)
  }

  function resetExitForm() {
    setLessonName('')
    setReason('')
  }

  function handleStudentClick(student) {
    selectedStudentRef.current = student
    setSelectedStudent(student)
    setShowAddExit(true)
    resetExitForm()
    loadStudentExits(student.id)
  }

  async function handleAddExit(event) {
    event.preventDefault()

    if (!selectedStudent) {
      return
    }

    if (!lessonName) {
      alert('Wybierz lekcję.')
      return
    }

    setAddingExit(true)

    const { error } = await addStudentExitRecord(selectedStudent.id, lessonName, reason)

    if (error) {
      console.error('Błąd dodawania wyjścia:', error)
      alert(`Nie udało się rozpocząć wyjścia.\n\n${error.message}`)
      setAddingExit(false)
      return
    }

    resetExitForm()
    setShowAddExit(false)
    await loadStudentExits(selectedStudent.id)
    setAddingExit(false)
  }

  async function handleReturnExit(exitId) {
    const { error } = await returnStudentExitRecord(exitId)

    if (error) {
      console.error('Błąd zapisywania powrotu:', error)
      alert(`Nie udało się zapisać powrotu ucznia.\n\n${error.message}`)
      return
    }

    if (selectedStudent) {
      await loadStudentExits(selectedStudent.id)
    }
  }

  async function handleDeleteExit(exitId) {
    if (!exitId) {
      alert('Nie znaleziono ID wyjścia.')
      return
    }

    const confirmed = window.confirm('Czy na pewno chcesz usunąć to wyjście?')

    if (!confirmed) {
      return
    }

    const { error } = await deleteStudentExitRecord(exitId)

    if (error) {
      console.error('Błąd usuwania wyjścia:', error)
      alert(`Nie udało się usunąć wyjścia.\n\n${error.message}`)
      return
    }

    if (selectedStudent) {
      await loadStudentExits(selectedStudent.id)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()

    selectedStudentRef.current = null
    setSelectedStudent(null)
    setStudents([])
    setClasses([])
    setExits([])
    setSelectedClass('')
    setShowAddExit(false)
    setHomeroomTeacher(null)
    setHomeroomClass(null)
    setHomeroomStudents([])
    setHomeroomExits([])
    setHomeroomError('')
    setUserRole('teacher')
    setActiveView('register')
  }

  useEffect(() => {
    if (session) {
      loadClasses()
      loadSchoolWideData()
      loadHomeroomData(session.user.email)
      loadUserRole(session.user.email)
    }
  }, [session])

  useEffect(() => {
    if (!session) {
      return undefined
    }

    const channel = supabase
      .channel(`students-exits-realtime-${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students_exits',
        },
        async () => {
          await loadSchoolWideData()
          await loadHomeroomData(session.user.email, { silent: true })

          if (selectedStudentRef.current?.id) {
            await loadStudentExits(selectedStudentRef.current.id)
          }
        }
      )
      .subscribe((status) => {
        console.log('Status Realtime students_exits:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  useEffect(() => {
    if (selectedClass) {
      loadStudents(selectedClass)
      selectedStudentRef.current = null
      setSelectedStudent(null)
      setExits([])
      setShowAddExit(false)
    }
  }, [selectedClass])

  if (loading) {
    return (
      <div className="loading-screen d-flex align-items-center justify-content-center min-vh-100">
        <div className="loading-content">
          <div className="loading-logo">S</div>
          <h1>Ładowanie...</h1>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <EkranLogowania
        email={email}
        password={password}
        rememberMe={rememberMe}
        showPassword={showPassword}
        error={error}
        authNotice={authNotice}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={() => setShowPassword((value) => !value)}
        onToggleRememberMe={setRememberMe}
        onSubmit={handleLogin}
        onPasswordReset={handlePasswordReset}
      />
    )
  }

  return (
    <div className="app">
      <PasekNawigacji
        session={session}
        activeView={activeView}
        onSetView={setActiveView}
        homeroomClass={homeroomClass}
        onLogout={handleLogout}
        userRole={userRole}
      />

      <main className="workspace">
        {activeView === 'register' && (
          <WidokRejestru
            classes={classes}
            students={students}
            selectedClass={selectedClass}
            selectedStudent={selectedStudent}
            studentSearch={studentSearch}
            dataLoading={dataLoading}
            exits={exits}
            exitsLoading={exitsLoading}
            showAddExit={showAddExit}
            lessonName={lessonName}
            reason={reason}
            addingExit={addingExit}
            onSelectClass={setSelectedClass}
            onStudentSearch={setStudentSearch}
            onStudentClick={handleStudentClick}
            onToggleAddExit={() => {
              if (showAddExit) resetExitForm()
              setShowAddExit((current) => !current)
            }}
            onResetExitForm={resetExitForm}
            onAddExit={handleAddExit}
            onReturnExit={handleReturnExit}
            onDeleteExit={handleDeleteExit}
            onLessonChange={setLessonName}
            onReasonChange={setReason}
          />
        )}

        {activeView === 'homeroom' && (
          <WidokWychowawcy
            homeroomTeacher={homeroomTeacher}
            homeroomClass={homeroomClass}
            homeroomStudents={homeroomStudents}
            homeroomExits={homeroomExits}
            homeroomLoading={homeroomLoading}
            homeroomError={homeroomError}
          />
        )}

        {activeView === 'admin' && (
          <PanelAdministratora classes={classes} students={allSchoolStudents} exits={allSchoolExits} session={session} />
        )}
        {activeView === 'director' && (
          <PanelDyrektora classes={classes} students={allSchoolStudents} exits={allSchoolExits} session={session} />
        )}
      </main>
    </div>
  )
}

export default App