'use client'

import { useState } from 'react'
import CourseTable from './CourseTable'
import CourseForm from './CourseForm'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/course-management.module.css'

type CourseManagementProps = {
  courses: any[]
  departments: any[]
}

export default function CourseManagement({ courses, departments }: CourseManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCreate = () => {
    setSelectedCourse(null)
    setIsFormOpen(true)
  }

  const handleEdit = (course: any) => {
    setSelectedCourse(course)
    setIsFormOpen(true)
  }

  const handleClose = () => {
    setIsFormOpen(false)
    setSelectedCourse(null)
  }

  const handleSuccess = () => {
    handleClose()
    window.location.reload()
  }

  const filteredCourses = courses.filter(course => {
    return course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (course.department && course.department.name.toLowerCase().includes(searchQuery.toLowerCase()))
  })

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.title}>
           <h1>Courses</h1>
           <p>Manage academic courses</p>
        </div>
        <div className={styles.actions}>
             {/* Search Bar */}
            <div className={styles.searchContainer}>
                <MagnifyingGlassIcon className={styles.searchIcon} />
                <input 
                    type="text" 
                    placeholder="Search Courses..." 
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <button 
                onClick={handleCreate}
                className={styles.addButton}
                title="Add Course"
            >
                <PlusIcon className={styles.plusIcon} />
            </button>
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.tableContainer}>
        <CourseTable courses={filteredCourses} onEdit={handleEdit} />
      </div>

      {isFormOpen && (
        <CourseForm 
          course={selectedCourse} 
          onClose={handleClose} 
          onSuccess={handleSuccess}
          departments={departments}
        />
      )}
    </div>
  )
}
