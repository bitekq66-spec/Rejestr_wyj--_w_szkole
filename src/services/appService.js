import { supabase } from '../lib/supabaseClient'

export async function getClassesFromSupabase() {
  const { data, error } = await supabase.from('classes').select('*').order('name')

  return {
    data: data || [],
    error,
  }
}

export async function getStudentsByClass(classId) {
  if (!classId) {
    return { data: [], error: null }
  }

  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('class_id', Number(classId))
    .order('surname')

  return {
    data: data || [],
    error,
  }
}

export async function getStudentExitsByStudent(studentId) {
  if (!studentId) {
    return { data: [], error: null }
  }

  const { data, error } = await supabase
    .from('students_exits')
    .select('*')
    .eq('student_id', studentId)
    .order('exit_time', { ascending: false })

  return {
    data: data || [],
    error,
  }
}

export async function addStudentExitRecord(studentId, lessonName, reason) {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('students_exits')
    .insert([
      {
        student_id: studentId,
        lesson_name: lessonName,
        exit_time: now,
        return_time: null,
        reason: reason.trim() || null,
      },
    ])
    .select()

  return { data, error }
}

export async function returnStudentExitRecord(exitId) {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('students_exits')
    .update({ return_time: now })
    .eq('id', exitId)
    .select()

  return { data, error }
}

export async function deleteStudentExitRecord(exitId) {
  const { error } = await supabase.from('students_exits').delete().eq('id', exitId)

  return { error }
}

export async function getTeacherProfileByEmail(userEmail) {
  const { data, error } = await supabase
    .from('teachers')
    .select('id, name, surname, email, role, klasa_podopieczna')
    .eq('email', userEmail)
    .maybeSingle()

  return {
    data,
    error,
  }
}

export async function getHomeroomDataByEmail(userEmail) {
  const { data: teacher, error: teacherError } = await supabase
    .from('teachers')
    .select('id, name, surname, klasa_podopieczna, email')
    .eq('email', userEmail)
    .maybeSingle()

  if (teacherError || !teacher) {
    return {
      teacher: null,
      homeroomClass: null,
      homeroomStudents: [],
      homeroomExits: [],
      error: teacherError
        ? `Nie udało się odczytać nauczyciela. Sprawdź uprawnienia RLS tabeli teachers. ${teacherError.message}`
        : 'Nie znaleziono nauczyciela dla tego adresu e-mail. Sprawdź, czy email w tabeli teachers jest taki sam jak email użyty do logowania.',
    }
  }

  if (!teacher.klasa_podopieczna) {
    return {
      teacher,
      homeroomClass: null,
      homeroomStudents: [],
      homeroomExits: [],
      error: 'Nauczyciel nie ma przypisanej klasy podopiecznej.',
    }
  }

  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('id, name')
    .eq('name', teacher.klasa_podopieczna)
    .maybeSingle()

  if (classError || !classData) {
    return {
      teacher,
      homeroomClass: null,
      homeroomStudents: [],
      homeroomExits: [],
      error: classError
        ? `Nie udało się odczytać klasy. Sprawdź uprawnienia RLS tabeli classes. ${classError.message}`
        : `Nie znaleziono klasy "${teacher.klasa_podopieczna}" w kolumnie classes.name. Sprawdź, czy nazwa jest identyczna.`,
    }
  }

  const { data: classStudents, error: studentsError } = await supabase
    .from('students')
    .select('id, name, surname')
    .eq('class_id', classData.id)
    .order('surname')

  if (studentsError) {
    return {
      teacher,
      homeroomClass: classData,
      homeroomStudents: [],
      homeroomExits: [],
      error: `Nie udało się odczytać uczniów. Sprawdź uprawnienia RLS tabeli students. ${studentsError.message}`,
    }
  }

  const studentIds = (classStudents || []).map((student) => student.id)
  let classExits = []

  if (studentIds.length > 0) {
    const { data: exitData, error: exitsError } = await supabase
      .from('students_exits')
      .select('id, student_id, lesson_name, exit_time, return_time, reason')
      .in('student_id', studentIds)
      .order('exit_time', { ascending: false })

    if (exitsError) {
      return {
        teacher,
        homeroomClass: classData,
        homeroomStudents: classStudents || [],
        homeroomExits: [],
        error: `Nie udało się odczytać wyjść. Sprawdź uprawnienia RLS tabeli students_exits. ${exitsError.message}`,
      }
    }

    classExits = exitData || []
  }

  return {
    teacher,
    homeroomClass: classData,
    homeroomStudents: classStudents || [],
    homeroomExits: classExits,
    error: '',
  }
}
