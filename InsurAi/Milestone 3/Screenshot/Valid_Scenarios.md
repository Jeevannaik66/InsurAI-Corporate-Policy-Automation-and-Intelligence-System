# ✅ Valid Scenarios – Milestone 3

This folder contains screenshots of **successful (valid) test cases** for Milestone 3: Claim Management, Policy Document Upload, Query Handling, and Reports.  
Each test confirms that the system performs correctly when valid inputs are given.

---

## TC301 – Employee Submits New Claim
**Description:** Employee fills claim details with policy auto-listed and uploads supporting documents.  
**Expected Result:** Claim is submitted successfully and visible in "My Claims".  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC301_EmployeeSubmitClaim.png

---

## TC302 – Employee Edits Submitted Claim
**Description:** Employee edits details of a previously submitted claim.  
**Expected Result:** Changes are saved and updated in "My Claims".  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC302_EmployeeEditClaim.png

---

## TC303 – Employee Views All Claims
**Description:** Employee views all submitted claims with status and total amount.  
**Expected Result:** Claims are displayed correctly with filtering options.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC303_EmployeeViewClaims.png

---

## TC304 – Employee Uses Support / FAQ
**Description:** Employee accesses support tab and FAQ section for claim submission guidance.  
**Expected Result:** Messages can be sent to agents and FAQs are displayed.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC304_EmployeeSupport.png

---

## TC305 – Admin Creates Policy with Document Upload
**Description:** Admin creates new policy and uploads supporting document to Supabase Cloud Storage.  
**Expected Result:** Policy is created successfully, document is stored, and visible to HR & Employees.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC305_AdminPolicyUpload.png

---

## TC306 – HR Views All Claims
**Description:** HR views all employee-submitted claims with policy details and supporting documents.  
**Expected Result:** HR can approve/reject claims with remarks; updates reflected in Employee dashboard.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC306_HRViewClaims.png

---

## TC307 – HR Approves Claim
**Description:** HR approves a claim with remarks.  
**Expected Result:** Claim status updates to Approved across dashboards.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC307_HRApproveClaim.png

---

## TC308 – HR Rejects Claim
**Description:** HR rejects a claim with remarks.  
**Expected Result:** Claim status updates to Rejected across dashboards.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC308_HRRejectClaim.png

---

## TC309 – HR Downloads Claims Report (CSV)
**Description:** HR exports claim data in CSV format.  
**Expected Result:** CSV file contains correct claim data for all employees.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC309_HRDownloadCSV.png

---

## TC310 – HR Downloads Claims Report (PDF)
**Description:** HR generates a detailed PDF report with charts and summaries.  
**Expected Result:** PDF is generated correctly with all data.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC310_HRDownloadPDF.png

---

## TC311 – Agent Views Employee Queries
**Description:** Agent sees all queries submitted by employees.  
**Expected Result:** Queries are displayed correctly with statuses.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC311_AgentViewQueries.png

---

## TC312 – Agent Responds to Query
**Description:** Agent responds to a query from an employee.  
**Expected Result:** Response is saved and visible to the employee.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC312_AgentRespond.png

---

## TC313 – Agent Updates Response
**Description:** Agent edits or updates a previous response.  
**Expected Result:** Updated response is visible to the employee.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC313_AgentUpdateResponse.png

---

## TC314 – Employee Views Agent Response
**Description:** Employee views the agent's response to their query.  
**Expected Result:** Response is displayed correctly.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC314_EmployeeViewResponse.png

---

## TC315 – Policy List Auto-Fetched in Claim Form
**Description:** Employee claim submission form auto-lists available policies.  
**Expected Result:** Policies appear automatically without manual selection.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC315_PolicyAutoFetch.png

---

## TC316 – Claim Status Updates Across Dashboards
**Description:** Approve/Reject/Resolved status updates reflect across Employee, HR, Admin, and Agent dashboards.  
**Expected Result:** All dashboards show correct status immediately.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC316_StatusUpdate.png

---

## TC317 – Employee Views Total Claims and Amount
**Description:** Employee dashboard shows total claims, approved/pending amounts, and filters.  
**Expected Result:** Correct numbers are displayed.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC317_EmployeeClaimSummary.png

---

## TC318 – HR Filters Claims by Status
**Description:** HR filters claims by Pending, Approved, or Rejected.  
**Expected Result:** Only matching claims are displayed.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC318_HRFilterClaims.png

---

## TC319 – Admin Views Claims Overview
**Description:** Admin sees total claims, policy-wise usage, and claim distribution.  
**Expected Result:** All summary and metrics are displayed correctly.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC319_AdminClaimsOverview.png

---

## TC320 – Reports Include Analytics Charts
**Description:** Reports show pie charts, line charts, and bar charts for claims.  
**Expected Result:** All charts are generated correctly.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC320_ReportCharts.png
