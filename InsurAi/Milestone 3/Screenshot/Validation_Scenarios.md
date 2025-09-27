# ❌ Validation Scenarios – Milestone 3

This folder contains screenshots of **failed or invalid test cases** for Milestone 3: Claim Management, Policy Document Upload, Query Handling, and Reports.  
Each test confirms that the system correctly handles errors, prevents invalid actions, and shows proper validation messages.

---

## TC321 – Employee Submits Claim Without Required Fields
**Description:** Employee tries to submit a claim without filling mandatory details.  
**Expected Result:** Submission is blocked and an error message is displayed.  
**Status:** Pass ✅ (Error displayed as expected)  

**Screenshot:** ./screenshots/TC321_EmployeeMissingFields.png

---

## TC322 – Employee Uploads Unsupported File Type
**Description:** Employee uploads a document with an unsupported format.  
**Expected Result:** Upload fails with a validation message.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC322_UnsupportedFile.png

---

## TC323 – Employee Edits Claim After Approval
**Description:** Employee tries to edit a claim already approved by HR.  
**Expected Result:** Editing is blocked.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC323_EditApprovedClaim.png

---

## TC324 – HR Approves Claim Without Remarks
**Description:** HR tries to approve a claim without entering remarks.  
**Expected Result:** System prompts for mandatory remarks.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC324_HRApproveNoRemarks.png

---

## TC325 – HR Rejects Claim Without Selecting Claim
**Description:** HR clicks reject without selecting any claim.  
**Expected Result:** Action blocked with an error message.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC325_HRRejectNoSelection.png

---

## TC326 – Agent Responds Without Message
**Description:** Agent submits a query response with empty message field.  
**Expected Result:** Response not allowed; error displayed.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC326_AgentEmptyResponse.png

---

## TC327 – Agent Responds to Offline Employee Query
**Description:** Agent tries to respond to a query assigned to an offline employee.  
**Expected Result:** System prevents response.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC327_AgentOfflineQuery.png

---

## TC328 – Employee Submits Claim for Inactive Policy
**Description:** Employee selects a policy marked inactive.  
**Expected Result:** Submission blocked.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC328_InactivePolicy.png

---

## TC329 – Admin Creates Policy Without Document
**Description:** Admin attempts to create a policy without uploading required document.  
**Expected Result:** Creation blocked; error displayed.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC329_AdminPolicyNoDoc.png

---

## TC330 – Employee Asks Query Without Selecting Agent
**Description:** Employee sends query without selecting an agent.  
**Expected Result:** Submission blocked; validation message shown.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC330_QueryNoAgent.png

---

## TC331 – Employee Views Claims When None Submitted
**Description:** Employee opens "My Claims" with no claims submitted yet.  
**Expected Result:** Displays "No claims submitted" message.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC331_NoClaims.png

---

## TC332 – HR Filters Claims with Invalid Date Range
**Description:** HR applies a filter with start date after end date.  
**Expected Result:** Filter blocked; validation error displayed.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC332_HRInvalidDate.png

---

## TC333 – HR Downloads Report With No Data
**Description:** HR tries to export CSV/PDF when no claims exist.  
**Expected Result:** Export blocked; message displayed.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC333_HRExportNoData.png

---

## TC334 – Admin Deletes Policy With Active Claims
**Description:** Admin attempts to delete a policy that has employee claims.  
**Expected Result:** Deletion blocked; error message shown.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC334_DeletePolicyActiveClaims.png

---

## TC335 – Employee Uploads Document Exceeding Size Limit
**Description:** Employee uploads a file exceeding maximum allowed size.  
**Expected Result:** Upload fails; error message shown.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC335_FileSizeExceed.png

---

## TC336 – Agent Updates Query Status Without Selecting Query
**Description:** Agent clicks update status without selecting a query.  
**Expected Result:** Update blocked; error message displayed.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC336_AgentUpdateNoQuery.png

---

## TC337 – HR Approves Already Rejected Claim
**Description:** HR tries to approve a claim that was previously rejected.  
**Expected Result:** Action blocked; error displayed.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC337_HRApproveRejected.png

---

## TC338 – Employee Downloads Policy PDF When Not Assigned
**Description:** Employee tries to download a PDF for a policy not assigned to them.  
**Expected Result:** Download blocked.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC338_EmployeeDownloadBlocked.png

---

## TC339 – Admin Creates Policy With Invalid Coverage Amount
**Description:** Admin enters negative or non-numeric coverage amount.  
**Expected Result:** Creation blocked; validation error displayed.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC339_AdminInvalidCoverage.png

---

## TC340 – Employee Submits Claim Exceeding Policy Coverage
**Description:** Employee submits claim with amount greater than policy coverage.  
**Expected Result:** Submission blocked; error message shown.  
**Status:** Pass ✅  

**Screenshot:** ./screenshots/TC340_ClaimExceedCoverage.png
