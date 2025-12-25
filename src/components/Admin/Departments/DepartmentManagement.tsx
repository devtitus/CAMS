'use client'

import { useState } from 'react'
import DepartmentTable from './DepartmentTable'
import DepartmentForm from './DepartmentForm'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/department-management.module.css'

type DepartmentManagementProps = {
  departments: any[]
}

export default function DepartmentManagement({ departments }: DepartmentManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCreate = () => {
    setSelectedDept(null)
    setIsFormOpen(true)
  }

  const handleEdit = (dept: any) => {
    setSelectedDept(dept)
    setIsFormOpen(true)
  }

  const handleClose = () => {
    setIsFormOpen(false)
    setSelectedDept(null)
  }

  const handleSuccess = () => {
    handleClose()
    window.location.reload()
  }

  const filteredDepts = departments.filter(dept => {
    return dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.title}>
           <h1>Departments</h1>
           <p>Manage academic departments</p>
        </div>
        <div className={styles.actions}>
             {/* Search Bar */}
            <div className={styles.searchContainer}>
                <MagnifyingGlassIcon className={styles.searchIcon} />
                <input 
                    type="text" 
                    placeholder="Search Departments..." 
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <button 
                onClick={handleCreate}
                className={styles.addButton}
                title="Add Department"
            >
                <PlusIcon className={styles.plusIcon} />
            </button>
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.tableContainer}>
        <DepartmentTable departments={filteredDepts} onEdit={handleEdit} />
      </div>

      {isFormOpen && (
        <DepartmentForm 
          department={selectedDept} 
          onClose={handleClose} 
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
