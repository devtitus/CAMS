import { getDepartments } from '@/app/actions/department-actions'
import DepartmentManagement from '@/components/Admin/Departments/DepartmentManagement'

export default async function DepartmentsPage() {
  const result = await getDepartments()
  const departments = result.success ? result.data : []

  return (
    <DepartmentManagement departments={departments || []} />
  )
}
