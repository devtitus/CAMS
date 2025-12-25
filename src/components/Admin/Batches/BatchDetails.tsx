'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import SemesterView from './SemesterView'
import styles from '@/styles/admin/batch-details.module.css'

type BatchDetailsProps = {
  batch: any
}

export default function BatchDetails({ batch }: BatchDetailsProps) {
  const [activeSemesterId, setActiveSemesterId] = useState<string>(
    batch.semesters?.[0]?.id || ''
  )

  const activeSemester = batch.semesters.find((s: any) => s.id === activeSemesterId)

  return (
    <div className={styles.container}>
      <Link href="/admin/batches" className={styles.backLink}>
        <ArrowLeftIcon className="w-4 h-4" /> Back to Batches
      </Link>

      <div className={styles.header}>
        <div className={styles.title}>
           <h1>Batch {batch.startYear}-{batch.endYear}</h1>
           <p>{batch.course.name} ({batch.course.code})</p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Sidebar Tabs */}
        <div className={styles.sidebar}>
            <div className={styles.semesterTabs}>
                {batch.semesters.map((sem: any) => (
                    <button
                        key={sem.id}
                        onClick={() => setActiveSemesterId(sem.id)}
                        className={`${styles.tab} ${activeSemesterId === sem.id ? styles.activeTab : ''}`}
                    >
                        Semester {sem.semesterNumber}
                    </button>
                ))}
            </div>
        </div>

        {/* Main Content */}
        {activeSemester ? (
            <SemesterView semester={activeSemester} />
        ) : (
            <div className={styles.mainPanel}>
                <p className="text-gray-500">No semesters found for this batch.</p>
            </div>
        )}
      </div>
    </div>
  )
}
