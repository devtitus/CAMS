'use client'

import { deleteBatch } from '@/app/actions/batch-actions'
import { useState } from 'react'
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/batch-table.module.css'
import Link from 'next/link'

type BatchTableProps = {
  batches: any[]
  onEdit: (batch: any) => void
}

export default function BatchTable({ batches, onEdit }: BatchTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this batch? This will delete all associated semesters and user links.')) {
      setIsDeleting(id)
      await deleteBatch(id)
      setIsDeleting(null)
    }
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Course</th>
            <th className={styles.th}>Batch / Year</th>
            <th className={styles.th}>Semesters</th>
             <th className={styles.th}>Students</th>
            <th className={`${styles.th} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {batches.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.emptyRow}>
                No batches found.
              </td>
            </tr>
          ) : (
            batches.map((batch) => (
              <tr key={batch.id}>
                <td className={styles.td}>
                    <div className={styles.courseName}>{batch.course?.name || '-'}</div>
                </td>
                <td className={styles.td}>
                    <Link href={`/admin/batches/${batch.id}`} className="hover:underline">
                        <span className={styles.yearBadge}>{batch.startYear} - {batch.endYear}</span>
                    </Link>
                </td>
                <td className={styles.td}>
                    <span className={styles.stat}>{batch._count?.semesters || 0}</span>
                </td>
                <td className={styles.td}>
                    <span className={styles.stat}>{batch._count?.users || 0}</span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button 
                        onClick={() => onEdit(batch)}
                        title="Edit Batch"
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                    >
                        <PencilSquareIcon className={styles.icon} />
                    </button>
                    <button 
                         onClick={() => handleDelete(batch.id)}
                         disabled={isDeleting === batch.id}
                         title="Delete Batch"
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
