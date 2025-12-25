'use client'

import { TrashIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/subject-mapping.module.css'
import { deleteMapping } from '@/app/actions/subject-mapping-actions'

type MappingTableProps = {
  mappings: any[]
  onDelete: () => void
}

export default function MappingTable({ mappings, onDelete }: MappingTableProps) {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this assignment?')) {
      await deleteMapping(id)
      onDelete() // callback to refresh
    }
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Subject Code</th>
            <th className={styles.th}>Subject Name</th>
            <th className={styles.th}>Assigned Teacher</th>
            <th className={styles.th}>Credits</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((mapping) => (
            <tr key={mapping.id} className={styles.tr}>
              <td className={styles.td}>
                <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {mapping.subject.code}
                </span>
              </td>
              <td className={styles.td}>{mapping.subject.name}</td>
              <td className={styles.td}>{mapping.teacher.name}</td>
              <td className={styles.td}>{mapping.subject.credits}</td>
              <td className={styles.td}>
                <button 
                  onClick={() => handleDelete(mapping.id)}
                  className={styles.deleteBtn}
                  title="Remove Assignment"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {mappings.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-500">
                No subjects assigned to this section yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
