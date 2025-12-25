'use client'

import { useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/timetable.module.css'
import mapStyles from '@/styles/admin/subject-mapping.module.css' // Reusing selector styles
import { getMappings } from '@/app/actions/subject-mapping-actions'
import { getTimeTable } from '@/app/actions/timetable-actions'
import TimeTableView from './TimeTableView'
import TimeSlotModal from './TimeSlotModal'

type TimeTableManagementProps = {
  courses: any[]
}

export default function TimeTableManagement({ courses }: TimeTableManagementProps) {
  // Selectors State
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [selectedSemesterId, setSelectedSemesterId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')

  // Data State
  const [slots, setSlots] = useState<any[]>([])
  const [mappings, setMappings] = useState<any[]>([]) // Needed for the modal
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Options Logic
  const selectedCourse = courses.find(c => c.id === selectedCourseId)
  const batches = selectedCourse?.batches || []
  const selectedBatch = batches.find((b: any) => b.id === selectedBatchId)
  const semesters = selectedBatch?.semesters || []
  const selectedSemester = semesters.find((s: any) => s.id === selectedSemesterId)
  const sections = selectedSemester?.sections || []

  // Cascading Reset
  useEffect(() => { setSelectedBatchId('') }, [selectedCourseId])
  useEffect(() => { setSelectedSemesterId('') }, [selectedBatchId])
  useEffect(() => { setSelectedSectionId('') }, [selectedSemesterId])

  // Fetch Data on Section Change
  useEffect(() => {
    if (selectedSectionId) {
        fetchData()
    } else {
        setSlots([])
        setMappings([])
    }
  }, [selectedSectionId])

  const fetchData = async () => {
    if (!selectedSectionId) return
    setLoading(true)
    const [slotsRes, mapsRes] = await Promise.all([
        getTimeTable(selectedSectionId),
        getMappings(selectedSectionId)
    ])
    
    if (slotsRes.success) setSlots(slotsRes.data)
    if (mapsRes.success) setMappings(mapsRes.data)
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Time Table Management</h1>
        <p className="text-gray-500">Schedule classes for sections</p>
      </header>

      {/* Selectors */}
      <div className={mapStyles.selectorPanel}>
        <div className={mapStyles.selectorGrid}>
            <div className={mapStyles.fieldGroup}>
                <label className={mapStyles.label}>Course</label>
                <select 
                   className={mapStyles.select}
                   value={selectedCourseId}
                   onChange={e => setSelectedCourseId(e.target.value)}
                >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
             <div className={mapStyles.fieldGroup}>
                <label className={mapStyles.label}>Batch</label>
                <select 
                   className={mapStyles.select}
                   value={selectedBatchId}
                   onChange={e => setSelectedBatchId(e.target.value)}
                   disabled={!selectedCourseId}
                >
                    <option value="">Select Batch</option>
                    {batches.map((c: any) => <option key={c.id} value={c.id}>{c.startYear}-{c.endYear}</option>)}
                </select>
            </div>
             <div className={mapStyles.fieldGroup}>
                <label className={mapStyles.label}>Semester</label>
                <select 
                   className={mapStyles.select}
                   value={selectedSemesterId}
                   onChange={e => setSelectedSemesterId(e.target.value)}
                   disabled={!selectedBatchId}
                >
                    <option value="">Select Semester</option>
                    {semesters.map((c: any) => <option key={c.id} value={c.id}>Semester {c.semesterNumber}</option>)}
                </select>
            </div>
             <div className={mapStyles.fieldGroup}>
                <label className={mapStyles.label}>Section</label>
                <select 
                   className={mapStyles.select}
                   value={selectedSectionId}
                   onChange={e => setSelectedSectionId(e.target.value)}
                   disabled={!selectedSemesterId}
                >
                    <option value="">Select Section</option>
                    {sections.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
        </div>
      </div>

      {/* Content */}
      {selectedSectionId ? (
          <div>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold">
                    Schedule for Section {sections.find((s:any)=>s.id===selectedSectionId)?.name}
                 </h2>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className={mapStyles.addBtn}
                 >
                    <PlusIcon className="w-5 h-5" />
                    Add Class
                 </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <TimeTableView slots={slots} onRefresh={fetchData} />
            )}
          </div>
      ) : (
          <div className={mapStyles.emptyState}>
            Select a section to view the time table
          </div>
      )}

      {isModalOpen && (
        <TimeSlotModal 
            mappings={mappings}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
                setIsModalOpen(false)
                fetchData() // Refresh grid
            }}
        />
      )}
    </div>
  )
}
