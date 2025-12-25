import { getBatches } from '@/app/actions/batch-actions'
import { getCourses } from '@/app/actions/course-actions'
import BatchManagement from '@/components/Admin/Batches/BatchManagement'

export default async function BatchesPage() {
  const [batchesRes, coursesRes] = await Promise.all([
    getBatches(),
    getCourses()
  ])

  const batches = batchesRes.success ? batchesRes.data : []
  const courses = coursesRes.success ? coursesRes.data : []

  return (
    <BatchManagement 
        batches={batches || []} 
        courses={courses || []}
    />
  )
}
