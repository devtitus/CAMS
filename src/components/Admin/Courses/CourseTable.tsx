'use client'

import { deleteCourse } from '@/app/actions/course-actions'
import { useState } from 'react'
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/course-table.module.css'

type CourseTableProps = {
  courses: any[]
  onEdit: (course: any) => void
}

export default function CourseTable({ courses, onEdit }: CourseTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this course? This might delete related batches and academic records.')) {
      setIsDeleting(id)
      await deleteCourse(id)
      setIsDeleting(null)
    }
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Code</th>
            <th className={styles.th}>Department</th>
            <th className={styles.th}>Batches</th>
            <th className={`${styles.th} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {courses.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.emptyRow}>
                No courses found.
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.id}>
                <td className={styles.td}>
                    <div className={styles.courseName}>{course.name}</div>
                </td>
                <td className={styles.td}>
                    <span className={styles.codeBadge}>{course.code}</span>
                </td>
                <td className={styles.td}>
                    <span className={styles.deptName}>{course.department?.name || '-'}</span>
                </td>
                <td className={styles.td}>
                    <span className={styles.stat}>{course._count?.batches || 0}</span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button 
                        onClick={() => onEdit(course)}
                        title="Edit Course"
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                    >
                        <PencilSquareIcon className={styles.icon} />
                    </button>
                    <button 
                         onClick={() => handleDelete(course.id)}
                         disabled={isDeleting === course.id}
                         title="Delete Course"
                         className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    >
                        <TrashIcon className={styles.icon} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
