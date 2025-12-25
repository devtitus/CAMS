'use client'

import { useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/subject-mapping.module.css'
import { getMappings } from '@/app/actions/subject-mapping-actions'
import MappingTable from './MappingTable'
import MappingForm from './MappingForm'

type SubjectMappingManagementProps = {
  courses: any[]
  subjects: any[]
  teachers: any[]
}

export default function SubjectMappingManagement({ courses, subjects, teachers }: SubjectMappingManagementProps) {
  // Selection State
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [selectedSemesterId, setSelectedSemesterId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')

  // Data State
  const [mappings, setMappings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Derived Options
  const selectedCourse = courses.find(c => c.id === selectedCourseId)
  const batches = selectedCourse?.batches || []
  
  const selectedBatch = batches.find((b: any) => b.id === selectedBatchId)
  const semesters = selectedBatch?.semesters || []

  const selectedSemester = semesters.find((s: any) => s.id === selectedSemesterId)
  const sections = selectedSemester?.sections || []

  // Reset downstream selections when parents change
  useEffect(() => { setSelectedBatchId('') }, [selectedCourseId])
  useEffect(() => { setSelectedSemesterId('') }, [selectedBatchId])
  useEffect(() => { setSelectedSectionId('') }, [selectedSemesterId])

  // Fetch mappings when section changes
  useEffect(() => {
    if (selectedSectionId) {
        fetchMappings()
    } else {
        setMappings([])
    }
  }, [selectedSectionId])

  const fetchMappings = async () => {
    if (!selectedSectionId) return
    setLoading(true)
    const res = await getMappings(selectedSectionId)
    if (res.success) {
        setMappings(res.data)
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Subject Allocation</h1>
        <p className={styles.subtitle}>Assign subjects and teachers to sections</p>
      </header>
      
      {/* Selector Panel */}
      <div className={styles.selectorPanel}>
        <div className={styles.selectorGrid}>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>Course</label>
                <select 
                    className={styles.select}
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Batch</label>
                <select 
                    className={styles.select}
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    disabled={!selectedCourseId}
                >
                    <option value="">Select Batch</option>
                    {batches.map((b: any) => (
                        <option key={b.id} value={b.id}>{b.startYear}-{b.endYear}</option>
                    ))}
                </select>
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Semester</label>
                <select 
                    className={styles.select}
                    value={selectedSemesterId}
                    onChange={(e) => setSelectedSemesterId(e.target.value)}
                    disabled={!selectedBatchId}
                >
                    <option value="">Select Semester</option>
                    {semesters.map((s: any) => (
                        <option key={s.id} value={s.id}>Semester {s.semesterNumber}</option>
                    ))}
                </select>
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Section</label>
                <select 
                    className={styles.select}
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                    disabled={!selectedSemesterId}
                >
                    <option value="">Select Section</option>
                    {sections.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* Content Area */}
      {selectedSectionId ? (
          <div>
            <div className={styles.contentHeader}>
                <h2 className={styles.sectionTitle}>
                    Allocations for Section {sections.find((s:any) => s.id === selectedSectionId)?.name}
                </h2>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className={styles.addBtn}
                >
                    <PlusIcon className="w-5 h-5" />
                    Assign Subject
                </button>
            </div>
            
            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <MappingTable mappings={mappings} onDelete={fetchMappings} />
            )}
          </div>
      ) : (
          <div className={styles.emptyState}>
            Please select a section to view and manage assignments.
          </div>
      )}

      {isFormOpen && (
        <MappingForm 
          sectionId={selectedSectionId}
          subjects={subjects}
          teachers={teachers}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false)
            fetchMappings()
          }}
        />
      )}
    </div>
  )
}
