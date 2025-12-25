'use client'

import { useState } from 'react'
import UserTable from './UserTable'
import UserForm from './UserForm'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/user-management.module.css'

type UserManagementProps = {
  users: any[]
  departments?: any[]
  batches?: any[]
  sections?: any[]
}

export default function UserManagement({ users, departments = [], batches = [], sections = [] }: UserManagementProps) {
  // ... state logic remains same ...
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('ALL') 

  const handleCreate = () => {
    setSelectedUser(null)
    setIsFormOpen(true)
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleClose = () => {
    setIsFormOpen(false)
    setSelectedUser(null)
  }

  const handleSuccess = () => {
    handleClose()
    window.location.reload()
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'ALL' || user.role === activeTab

    return matchesSearch && matchesTab
  })

  const tabs = [
    { id: 'ALL', label: 'All Users' },
    { id: 'ADMIN', label: 'Admins' },
    { id: 'TEACHER', label: 'Teachers' },
    { id: 'STUDENT', label: 'Students' },
  ]

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.title}>
           <h1>Users</h1>
           <p>Manage system access and roles</p>
        </div>
        <div className={styles.actions}>
             {/* Search Bar */}
            <div className={styles.searchContainer}>
                <MagnifyingGlassIcon className={styles.searchIcon} />
                <input 
                    type="text" 
                    placeholder="Search Users..." 
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <button 
                onClick={handleCreate}
                className={styles.addButton}
                title="Add User"
            >
                <PlusIcon className={styles.plusIcon} />
            </button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            >
                {tab.label}
            </button>
        ))}
      </div>

      {/* Table Card */}
      <div className={styles.tableContainer}>
        <UserTable users={filteredUsers} onEdit={handleEdit} />
      </div>

      {isFormOpen && (
        <UserForm 
          user={selectedUser} 
          onClose={handleClose} 
          onSuccess={handleSuccess}
          departments={departments}
          batches={batches}
          sections={sections}
        />
      )}
    </div>
  )
}
