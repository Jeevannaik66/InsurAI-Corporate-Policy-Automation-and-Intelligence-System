# ❌ Validation Scenarios – Milestone 3

This folder contains screenshots of **failed or invalid test cases** for Milestone 3: Claim Management, Policy Document Upload, Query Handling, and Reports.  
Each test confirms that the system correctly handles errors, prevents invalid actions, and shows proper validation messages.

---

## TC321 – Employee Submits Claim Without Required Fields
**Description:** Employee tries to submit a claim without filling mandatory details.  
**Expected Result:** Submission is blocked and an error message is displayed.  
**Status:** Pass ✅ (Error displayed as expected)  

<img width="1910" height="1264" alt="image" src="https://github.com/user-attachments/assets/a628c48f-b032-4f6c-9af1-e87296d8ef9b" />

---

## TC322 – Employee Uploads Unsupported File Type
**Description:** Employee uploads a document with an unsupported format.  
**Expected Result:** Upload fails; system displays:  
*“Supported formats: PDF, JPG, PNG, DOC (Max 10MB each)”*  
**Status:** Pass ✅  

<img width="1910" height="1264" alt="image" src="https://github.com/user-attachments/assets/7c152e2d-c004-44bf-9309-567d7ef2a02e" />
 
---

## TC323 – Employee Edits Claim After Approval
**Description:** Employee tries to edit a claim already approved by HR.  
**Expected Result:** Editing is blocked.  
**Status:** Pass ✅  

<img width="1910" height="982" alt="image" src="https://github.com/user-attachments/assets/acec9270-c638-4675-9b6d-7a8a9f575b97" />

---

## TC324 – HR Approves Claim Without Remarks
**Description:** HR tries to approve a claim without entering remarks.  
**Expected Result:** System prompts for mandatory remarks.  
**Status:** Pass ✅  

<img width="1910" height="981" alt="image" src="https://github.com/user-attachments/assets/c2206328-9dbf-4e32-9bf2-f75f564ff390" />

---

## TC325 – HR Rejects Claim / Performs Action Without Required Input
**Description:** HR attempts an action (approve/reject) without filling mandatory fields or selecting relevant data.  
**Expected Result:** Action blocked; system prevents submission and displays proper validation.  
**Status:** Pass ✅  

<img width="1910" height="1016" alt="image" src="https://github.com/user-attachments/assets/0b9756fd-c67c-42e3-809b-8efdbd74c682" />


---

## TC326 – Employee Submits Query Without Selecting Agent
**Description:** Employee tries to submit a support query without selecting an agent or entering a query.  
**Expected Result:** Submission blocked; proper validation messages shown for empty query text or missing agent selection.  
**Status:** Pass ✅  

<img width="1910" height="1055" alt="image" src="https://github.com/user-attachments/assets/3d1466f7-2e02-43bd-9180-8b53b07d85be" />

---

## TC327 – Agent Responds Without Message
**Description:** Agent attempts to respond to a query with an empty message field.  
**Expected Result:** Response blocked; system displays validation message to enter a response.  
**Status:** Pass ✅  

<img width="1910" height="981" alt="image" src="https://github.com/user-attachments/assets/ca80b528-776c-4843-91e1-0a4a21fcd448" />

---

## TC328 – Employee Submits Query to Offline Agent
**Description:** Employee tries to submit a query to an agent who is currently offline.  
**Expected Result:** Submission prevented; system notifies that agent is offline.  
**Status:** Pass ✅  

<img width="1910" height="981" alt="image" src="https://github.com/user-attachments/assets/abdffe38-436f-409a-a5ad-e2de9f7b397b" />

---

## TC329 – Employee Views Queries When None Submitted
**Description:** Employee opens "My Queries" tab without having submitted any queries.  
**Expected Result:** Displays "No queries submitted yet" message and prompt to submit first query.  
**Status:** Pass ✅  

<img width="1910" height="1047" alt="image" src="https://github.com/user-attachments/assets/32bc310c-c99e-4334-9c10-d4e13134342b" />

---

## TC330 – Employee Searches Queries With No Matches
**Description:** Employee searches queries using a keyword that does not match any existing query.  
**Expected Result:** Displays "No queries match your search" message.  
**Status:** Pass ✅  

<img width="1910" height="982" alt="image" src="https://github.com/user-attachments/assets/dd456b61-61ec-4efc-bf15-a7770b47130a" />

---

## TC331 – Employee Filters Queries by Status With No Matching Queries
**Description:** Employee applies a status filter (answered/pending) when no queries match the filter.  
**Expected Result:** Displays "No queries match your search" message.  
**Status:** Pass ✅  

<img width="1910" height="982" alt="image" src="https://github.com/user-attachments/assets/11917bc4-4c0a-40f9-9670-e8ddbd7b2d3e" />

---

## TC332 – HR Filters Claims with Keyword. 
**Description:** HR applies a filter keyword.  
**Expected Result:** No claims found matching your criteria validation error displayed.  
**Status:** Pass ✅  

v<img width="1910" height="1087" alt="image" src="https://github.com/user-attachments/assets/135d51ca-a72d-42b8-92df-24662e4f538e" />

---

## TC333 – HR Downloads Report With No Data
**Description:** HR tries to export CSV/PDF when no claims exist.  
**Expected Result:** Export blocked; message displayed.  
**Status:** Pass ✅  

<img width="1910" height="1447" alt="image" src="https://github.com/user-attachments/assets/126c7810-e2a6-4d08-946b-9434fdb68a46" />

---

## TC334 – Employee Uploads Document Exceeding Size Limit
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

<img width="1910" height="1002" alt="image" src="https://github.com/user-attachments/assets/38423b93-15e2-43c9-a7ca-4aaec7b76683" />

---

## TC338 – Employee Downloads Policy PDF When Not Assigned
**Description:** Employee tries to download a PDF for a policy not assigned to them.  
**Expected Result:** Download blocked.  
**Status:** Pass ✅  

![Uploading image.png…]()

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

