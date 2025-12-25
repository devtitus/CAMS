'use client'

import { deleteUser } from '@/app/actions/user-actions'
import { useState } from 'react'
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/user-table.module.css'

type UserTableProps = {
  users: any[]
  onEdit: (user: any) => void
}

export default function UserTable({ users, onEdit }: UserTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setIsDeleting(id)
      await deleteUser(id)
      setIsDeleting(null)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className={`${styles.badge} ${styles.badgeAdmin}`}>Admin</span>
      case 'TEACHER':
        return <span className={`${styles.badge} ${styles.badgeTeacher}`}>Teacher</span>
      case 'STUDENT':
        return <span className={`${styles.badge} ${styles.badgeStudent}`}>Student</span>
      default:
        return <span className={`${styles.badge} ${styles.badgeUnknown}`}>Unknown</span>
    }
  }

  // Helper to format date
  const formatDate = (date: any) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-GB')
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={`${styles.th} w-10`}>
                <input type="checkbox" className={styles.checkbox} />
            </th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Role</th>
            <th className={styles.th}>Department / Course</th>
            <th className={styles.th}>Date Added</th>
            <th className={`${styles.th} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.emptyRow}>
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className={styles.td}>
                    <input type="checkbox" className={styles.checkbox} />
                </td>
                <td className={styles.td}>
                    <div className={styles.userName}>{user.name}</div>
                </td>
                <td className={styles.td}>{user.email}</td>
                <td className={styles.td}>
                  {getRoleBadge(user.role)}
                </td>
                <td className={styles.td}>
                  {user.role === 'STUDENT' && user.batch ? (
                      <div>
                        <span className={styles.detailsMain}>{user.batch.course?.code || 'Unknown Course'}</span>
                        <span className={styles.detailsSub}> • {user.batch.startYear}-{user.batch.endYear} (Sec {user.section?.name})</span>
                      </div>
                  ) : user.role === 'TEACHER' && user.department ? (
                      <span className={styles.detailsMain}>{user.department.name}</span>
                  ) : (
                      <span>-</span>
                  )}
                </td>
                <td className={styles.td}>
                    {formatDate(user.createdAt)}
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button 
                        onClick={() => onEdit(user)}
                        title="Edit User"
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                    >
                        <PencilSquareIcon className={styles.icon} />
                    </button>
                    <button 
                         onClick={() => handleDelete(user.id)}
                         disabled={isDeleting === user.id}
                         title="Delete User"
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
