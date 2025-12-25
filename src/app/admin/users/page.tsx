import { getUsers } from '@/app/actions/user-actions'
import { getDepartments, getBatches, getSections } from '@/app/actions/metadata-actions'
import UserManagement from '@/components/Admin/UserManagement'

export default async function UsersPage() {
  const [usersRes, deptsRes, batchesRes, sectionsRes] = await Promise.all([
    getUsers(),
    getDepartments(),
    getBatches(),
    getSections()
  ])

  const users = usersRes.success ? usersRes.data : []
  const departments = deptsRes.success ? deptsRes.data : []
  const batches = batchesRes.success ? batchesRes.data : []
  const sections = sectionsRes.success ? sectionsRes.data : []

  return (
    <UserManagement 
        users={users || []} 
        departments={departments}
        batches={batches}
        sections={sections}
    />
  )
}
