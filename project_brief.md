# College Academic Management System (CAMS)

## 1. Project Overview
**Objective:** To build a secure, centralized web-based application that streamlines academic operations for a college institution. The system digitizes core processes such as attendance, scheduling, and examinations while ensuring strict data security.

**Security Model:** Closed-loop authentication.
- **No Public Sign-up:** Access is restricted to authorized users only.
- **Admin Control:** All User IDs and Passwords are generated and distributed effectively by the Administrator.

## 2. User Roles
The system caters to three distinct user types, each with specific permissions:

### Admin (Superuser)
- Full control over system configuration.
- Manages user accounts (create/update/delete).
- Oversees all data and generates reports.

### Teacher (Faculty)
- Manages academic activities (Attendance, Marks, Notes).
- View-only access to their specific schedule and student lists.

### Student (End-User)
- View-only access to their personal academic data (Attendance, Results, Timetable, Notes).

## 3. Module & Feature Breakdown

### 1. Authentication & User Management
- **Role-Based Login:** Secure login portal distinguishing between Admin, Teacher, and Student views.
- **Credential Management:** Admin interface to create bulk users and generate initial credentials.
- **Password Reset:** Admin capability to reset user passwords securely.

### 2. Academic Structure (Setup)
- **Department Manager:** Define departments (e.g., CS, Mechanical, Arts).
- **Course & Batch Manager:** Create courses (e.g., B.Tech, B.Sc) and batches (e.g., 2024-2028).
- **Semester & Sectioning:** Define semesters and divide batches into sections (A, B, C).
- **Subject Mapping:** Assign specific subjects to specific semesters/departments.

### 3. Time-Table Module
- **Master Scheduler (Admin):** Interface to map Teacher + Subject + Room + Time Slot.
- **Conflict Detection:** Automated alerts for double-booking teachers or rooms.
- **Dynamic Views:**
    - **Student:** View personal semester routine.
    - **Teacher:** View cross-semester teaching schedule.

### 4. Attendance Module
- **Subject-Wise Tracking:** Attendance is marked per subject/lecture, not just per day.
- **Time-Table Integration:** When a teacher logs in to mark attendance, the system auto-selects the current subject based on the Time-Table.
- **Reporting:** Auto-calculation of attendance percentage; "Defaulter List" generation for low attendance.

### 5. Assessment & Examination Module
- **Exam Scheduling:** Define exam dates and types (Internal, Mid-term, Semester).
- **Marks Entry:** Teachers input marks for their mapped subjects.
- **Result Processing:** Automated calculation of Totals, Grades, and GPA/CGPA based on credit logic.
- **Report Cards:** Digital grade card generation for students.

### 6. Notes & Resources Module
- **Digital Repository:** Upload interface for PDFs, PPTs, and Docs.
- **Categorization:** Resources tagged by Subject, Topic, and Date.
- **Access Control:** Students can only view notes for subjects in their current curriculum.

## 4. Technical Constraints & Requirements (Suggested)
- **Platform:** Web Application (Responsive for Desktop/Tablet).
- **Database:** Relational Database (SQL) recommended due to complex relationships between Students, Classes, and Subjects.
- **Access:** Intranet or Cloud-hosted (depending on college infrastructure).
