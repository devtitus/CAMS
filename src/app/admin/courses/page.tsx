import { getCourses } from '@/app/actions/course-actions'
import { getDepartments } from '@/app/actions/metadata-actions'
import CourseManagement from '@/components/Admin/Courses/CourseManagement'

export default async function CoursesPage() {
  const [coursesRes, deptsRes] = await Promise.all([
    getCourses(),
    getDepartments()
  ])

  const courses = coursesRes.success ? coursesRes.data : []
  const departments = deptsRes.success ? deptsRes.data : []

  return (
    <CourseManagement 
        courses={courses || []} 
        departments={departments}
    />
  )
}
