import { getHierarchy } from '@/app/actions/subject-mapping-actions' // reusing mapping actions helper
import TimeTableManagement from '@/components/Admin/TimeTable/TimeTableManagement'

export default async function TimeTablePage() {
    const hierarchy = await getHierarchy()
    const courses = hierarchy.success ? hierarchy.data : []
    
    return <TimeTableManagement courses={courses} />
}
