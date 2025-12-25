'use client'

import { useState } from 'react'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/subject-management.module.css'
import SubjectTable from './SubjectTable'
import SubjectForm from './SubjectForm'

type SubjectManagementProps = {
  subjects: any[]
  departments: any[]
}

export default function SubjectManagement({ subjects, departments }: SubjectManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState('')

  const filteredSubjects = subjects.filter(subject => {
     const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           subject.code.toLowerCase().includes(searchQuery.toLowerCase())
     const matchesDept = selectedDept ? subject.departmentId === selectedDept : true
     return matchesSearch && matchesDept
  })

  const handleEdit = (subject: any) => {
    setEditingSubject(subject)
    setIsFormOpen(true)
  }

  const handleSuccess = () => {
    setIsFormOpen(false)
    setEditingSubject(null)
    window.location.reload()
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Subjects</h1>
          <p className={styles.subtitle}>Manage academic subjects and credits</p>
        </div>
        <div className={styles.actions}>
           <div className={styles.stats}>
             <div className={styles.statItem}>
               <span className={styles.statLabel}>Total Subjects</span>
               <span className={styles.statValue}>{filteredSubjects.length}</span>
             </div>
           </div>
          <button onClick={() => setIsFormOpen(true)} className={styles.addBtn}>
            <PlusIcon className="w-5 h-5" />
            Add Subject
          </button>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name or code..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select 
            className={styles.select}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
        >
            <option value="">All Departments</option>
            {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
            ))}
        </select>
      </div>

      <SubjectTable subjects={filteredSubjects} onEdit={handleEdit} />

      {isFormOpen && (
        <SubjectForm 
          subject={editingSubject} 
          onClose={() => {
            setIsFormOpen(false)
            setEditingSubject(null)
          }}
          onSuccess={handleSuccess}
          departments={departments}
        />
      )}
    </div>
  )
}
