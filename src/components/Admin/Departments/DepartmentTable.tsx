'use client'

import { deleteDepartment } from '@/app/actions/department-actions'
import { useState } from 'react'
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/department-table.module.css'

type DepartmentTableProps = {
  departments: any[]
  onEdit: (dept: any) => void
}

export default function DepartmentTable({ departments, onEdit }: DepartmentTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this department? This might delete related courses.')) {
      setIsDeleting(id)
      await deleteDepartment(id)
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
            <th className={styles.th}>Courses</th>
            <th className={styles.th}>Teachers</th>
            <th className={`${styles.th} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {departments.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.emptyRow}>
                No departments found.
              </td>
            </tr>
          ) : (
            departments.map((dept) => (
              <tr key={dept.id}>
                <td className={styles.td}>
                    <div className={styles.deptName}>{dept.name}</div>
                </td>
                <td className={styles.td}>
                    <span className={styles.codeBadge}>{dept.code}</span>
                </td>
                <td className={styles.td}>
                    <span className={styles.stat}>{dept._count?.courses || 0}</span>
                </td>
                <td className={styles.td}>
                    <span className={styles.stat}>{dept._count?.users || 0}</span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button 
                        onClick={() => onEdit(dept)}
                        title="Edit Department"
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                    >
                        <PencilSquareIcon className={styles.icon} />
                    </button>
                    <button 
                         onClick={() => handleDelete(dept.id)}
                         disabled={isDeleting === dept.id}
                         title="Delete Department"
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
