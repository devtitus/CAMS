'use client'

import { useState } from 'react'
import { createSection, deleteSection } from '@/app/actions/batch-actions'
import { TrashIcon } from '@heroicons/react/24/outline'
import styles from '@/styles/admin/batch-details.module.css'

type SemesterViewProps = {
  semester: any
}

export default function SemesterView({ semester }: SemesterViewProps) {
  const [newSectionName, setNewSectionName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSectionName.trim()) return

    setLoading(true)
    await createSection(semester.id, newSectionName)
    setNewSectionName('')
    setLoading(false)
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
        await deleteSection(sectionId)
    }
  }

  return (
    <div className={styles.mainPanel}>
      <div className={styles.panelHeader}>
        <h2>Semester {semester.semesterNumber}</h2>
      </div>

      <div className={styles.grid}>
        {semester.sections.map((section: any) => (
          <div key={section.id} className={styles.sectionCard}>
            <div className={styles.sectionInfo}>
              <span className={styles.sectionName}>{section.name}</span>
              <span className={styles.studentCount}>{section._count?.students || 0} Students</span>
            </div>
            <button 
                onClick={() => handleDeleteSection(section.id)}
                className={styles.deleteBtn}
                title="Delete Section"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        {semester.sections.length === 0 && (
            <p className="text-gray-500 text-sm col-span-full">No sections created yet.</p>
        )}
      </div>

      <div className={styles.addSection}>
        <form onSubmit={handleAddSection} className={styles.addForm}>
            <input 
                type="text" 
                placeholder="New Section Name (e.g. 'A')" 
                className={styles.input}
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
            />
            <button 
                type="submit" 
                disabled={loading || !newSectionName.trim()}
                className={styles.addBtn}
            >
                {loading ? 'Adding...' : 'Add Section'}
            </button>
        </form>
      </div>
    </div>
  )
}
