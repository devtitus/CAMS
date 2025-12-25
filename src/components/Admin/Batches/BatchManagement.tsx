'use client'

import { useState } from 'react'
import BatchTable from './BatchTable'
import BatchForm from './BatchForm'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/batch-management.module.css'

type BatchManagementProps = {
  batches: any[]
  courses: any[]
}

export default function BatchManagement({ batches, courses }: BatchManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCreate = () => {
    setSelectedBatch(null)
    setIsFormOpen(true)
  }

  const handleEdit = (batch: any) => {
    setSelectedBatch(batch)
    setIsFormOpen(true)
  }

  const handleClose = () => {
    setIsFormOpen(false)
    setSelectedBatch(null)
  }

  const handleSuccess = () => {
    handleClose()
    window.location.reload()
  }

  const filteredBatches = batches.filter(batch => {
    const searchLower = searchQuery.toLowerCase()
    return (batch.course && batch.course.name.toLowerCase().includes(searchLower)) ||
           batch.startYear.toString().includes(searchLower) ||
           batch.endYear.toString().includes(searchLower)
  })

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.title}>
           <h1>Batches</h1>
           <p>Manage academic batches and sessions</p>
        </div>
        <div className={styles.actions}>
             {/* Search Bar */}
            <div className={styles.searchContainer}>
                <MagnifyingGlassIcon className={styles.searchIcon} />
                <input 
                    type="text" 
                    placeholder="Search Batches..." 
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <button 
                onClick={handleCreate}
                className={styles.addButton}
                title="Add Batch"
            >
                <PlusIcon className={styles.plusIcon} />
            </button>
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.tableContainer}>
        <BatchTable batches={filteredBatches} onEdit={handleEdit} />
      </div>

      {isFormOpen && (
        <BatchForm 
          batch={selectedBatch} 
          onClose={handleClose} 
          onSuccess={handleSuccess}
          courses={courses}
        />
      )}
    </div>
  )
}
