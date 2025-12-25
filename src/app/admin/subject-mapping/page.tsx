import { getHierarchy } from '@/app/actions/subject-mapping-actions'
import { getSubjects } from '@/app/actions/subject-actions'
import { getUsers } from '@/app/actions/user-actions'
import SubjectMappingManagement from '@/components/Admin/SubjectMapping/SubjectMappingManagement'
import { UserRole } from '@prisma/client'

export default async function SubjectMappingPage() {
  const [hierarchyRes, subjectsRes, teachersRes] = await Promise.all([
    getHierarchy(),
    getSubjects(),
    getUsers(UserRole.TEACHER)
  ])

  const courses = hierarchyRes.success ? hierarchyRes.data : []
  const subjects = subjectsRes.success ? subjectsRes.data : []
  const teachers = teachersRes.success ? teachersRes.data : []

  return (
    <SubjectMappingManagement 
        courses={courses} 
        subjects={subjects} 
        teachers={teachers} 
    />
  )
}
