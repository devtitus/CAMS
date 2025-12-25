import { getSubjects } from '@/app/actions/subject-actions'
import { getDepartments } from '@/app/actions/department-actions'
import SubjectManagement from '@/components/Admin/Subjects/SubjectManagement'

export default async function SubjectsPage() {
  const [subjectsRes, departmentsRes] = await Promise.all([
    getSubjects(),
    getDepartments()
  ])

  const subjects = subjectsRes.success ? subjectsRes.data : []
  const departments = departmentsRes.success ? departmentsRes.data : []

  return <SubjectManagement subjects={subjects} departments={departments} />
}
