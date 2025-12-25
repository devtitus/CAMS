'use client'

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/subject-table.module.css'
import { deleteSubject } from '@/app/actions/subject-actions'

type SubjectTableProps = {
  subjects: any[]
  onEdit: (subject: any) => void
}

export default function SubjectTable({ subjects, onEdit }: SubjectTableProps) {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      await deleteSubject(id)
      window.location.reload()
    }
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Code</th>
            <th className={styles.th}>Department</th>
            <th className={styles.th}>Credits</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.name}>{subject.name}</div>
              </td>
              <td className={styles.td}>
                <span className={styles.codeBadge}>{subject.code}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.deptBadge}>{subject.department?.name || 'N/A'}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.credits}>{subject.credits}</span>
              </td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <button 
                    onClick={() => onEdit(subject)}
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    title="Edit"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(subject.id)}
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {subjects.length === 0 && (
            <tr>
              <td colSpan={5} className={`${styles.td} text-center text-gray-500 py-8`}>
                No subjects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
