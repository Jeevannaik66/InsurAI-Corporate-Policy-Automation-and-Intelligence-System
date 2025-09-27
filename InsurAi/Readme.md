# 🏢 InsurAI – Corporate Policy Automation and Intelligence System

## 📌 Project Overview
InsurAI is a corporate insurance management system built using **React (frontend)** and **Spring Boot (backend)** with **MySQL database**.  
The project is organized into multiple modules and milestones as per internship requirements.

---

## 📂 Repository Folders

### 📁 insurai-backend
- Contains the **Spring Boot backend** code.  
- Handles APIs for authentication, user management, policies, claims, and queries.  

### 📁 insurai-frontend
- Contains the **React frontend** code.  
- Includes interfaces for Admin, HR, Agent, and Employee.  

### 📁 Milestone 1 – Authentication & Registration
- Admin login with fixed credentials.  
- Admin registers HR and Agent accounts.  
- HR login with email/password.  
- Agent login with email/password.  
- Employee self-registration & login.  
- Includes:  
  - **Valid_Scenarios.md** – Positive test screenshots.  
  - **Validation_Scenarios.md** – Invalid/failed test screenshots.  
  - **TestCases_M1.pdf** – Positive & negative test case documentation.  

### 📁 Milestone 2 – Policy Management & Dashboards
- Admin can create, edit, delete, and manage insurance policies.  
- HR and Employees can view active policies.  
- Employees can download policies in PDF format.  
- Admin → User management (roles & statuses).  
- HR → Employee management with search.  
- Agent → Availability settings (toggle available/unavailable).  
- Employee → Ask a Question feature (queries to agents).  
- Includes:  
  - **Valid_Scenarios.md** – Positive test screenshots.  
  - **Validation_Scenarios.md** – Invalid/failed test screenshots.  
  - **TestCases_M2.pdf** – Positive & negative test case documentation.  

### 📁 Milestone 3 – Claim Management & Enhancements
- **Employee Features**
  - Submit new claims with policy auto-listed for selection.
  - Upload supporting documents for each claim.
  - Edit submitted claims if required.
  - View all claims with status (Pending, Approved, Rejected) and total amounts with filtering.
  - Employee Support: contact insurance agents via messages.
  - FAQ section: claim submission, processing time, required documents, and general queries.
  - Enhanced UI and dashboard functionality.

- **HR Features**
  - View all claims submitted by employees.
  - Access claim details, supporting documents, and related policies.
  - Approve or reject claims with remarks; updates reflected in employee view.
  - Filter claims by status (Pending, Approved, Rejected).
  - Download reports in CSV and PDF formats.
  - Advanced analytics: claim overview, quick actions, status tracking, monthly trend charts, policy analytics, report generation history.

- **Admin Features**
  - Enhanced policy creation with supporting document upload.
  - Integrated Supabase Cloud Storage for secure document storage.
  - Access to all claims list.
  - Advanced reports and analytics: total employees, HR users, agents, policies, total claims, claim distribution, policy usage analytics, recent claim activity.
  - Export reports: PDF, Employee CSV, Claims CSV, Policy CSV.

- **Agent Features**
  - View queries raised by employees.
  - Respond to employee queries with messages.
  - Update query status (Pending → Resolved).
  - Edit or update responses if needed.

- **Automation / Flow Enhancements**
  - Policy list auto-fetched in employee claim submission form.
  - Claims automatically linked with assigned HR.
  - Status updates (Approve/Reject/Resolved) reflected across all roles.
  - Real-time updates across Employee, HR, Admin, and Agent interfaces.

- Includes:  
  - **Valid_Scenarios.md** – Positive test screenshots.  
  - **Validation_Scenarios.md** – Invalid/failed test screenshots.  
  - **TestCases_M3.pdf** – Positive & negative test case documentation.  

---

## 🚧 Project Status
This project is **under development**. More milestones and features will be added soon.
