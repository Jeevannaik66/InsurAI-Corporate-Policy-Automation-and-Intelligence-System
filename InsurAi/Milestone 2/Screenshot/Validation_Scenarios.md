# ❌ Validation Scenario Test Screenshots

This folder contains screenshots of **failed or invalid test cases** for Milestone 2: Policy Management, Dashboards & Queries.  
Each test confirms that the system correctly handles errors, prevents invalid actions, and shows proper validation messages.

---

## TC201 – Admin Creates Policy Without Mandatory Fields
**Description:** Admin tries to create a policy but leaves required fields blank.  
**Expected Result:** Form should not submit, validation error shown.  
**Status:** Pass ✅ (Validation message displayed)  

**Admin Policy Creation (Missing Fields) Screenshot** 

<img width="1910" height="981" alt="image" src="https://github.com/user-attachments/assets/0a58bb95-cc9c-4918-ad98-c96f97b89da3" />

---

## TC202 – Admin Sets Policy Status to Inactive
**Description:** Admin marks a policy as "Inactive".  
**Expected Result:** Policy should not be visible in HR/Employee dashboards.  
**Status:** Pass ✅ (Policy hidden as expected)  

**Inactive Policy Screenshot**  

<img width="1755" height="1618" alt="image" src="https://github.com/user-attachments/assets/2d847083-578f-4c19-9d45-842798555d3e" />

---

## TC203 – Employee Views Policies When None Exist
**Description:** Employee logs in but no active policies exist.  
**Expected Result:** Employee should see "No policies available".  
**Status:** Not Performed ⚠ (Requires DB reset, kept for simulation only)  

**Employee No Policies Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/5181f83d-9bfc-4b70-9aba-a0fe3e5cf854" />

---

## TC204 – Employee Downloads Policy PDF (Corrupted/Invalid Case)
**Description:** Employee attempts to download a policy PDF but file is invalid.  
**Expected Result:** System should show error or block download.  
**Status:** Not Implemented 🚧 (PDF generation tested only for valid policies)  

**Invalid Policy PDF Screenshot**  
<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/eec3e298-bcca-4451-b7e7-d5553e331f8e" />

<img width="1910" height="981" alt="image" src="https://github.com/user-attachments/assets/af575e2a-665d-47cd-a639-259516e4c522" />


---

## TC205 – Agent Sets Availability with Invalid Date Range
**Description:** Agent selects "From" date later than "To" date.  
**Expected Result:** Validation error should show.  
**Status:** Automatically Handled ✅ (System prevents invalid input at entry step)  

**Agent Invalid Availability Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/555b2016-0f67-41f4-900b-1c27058e268b" />

---

## TC206 – Employee Asks Query When Agent is Offline
**Description:** Employee tries to send query to an unavailable agent.  
**Expected Result:** Unavailable agents should not be selectable.  
**Status:** Pass ✅ (System blocks offline agents)  

**Employee Offline Agent Query Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/06105d79-ef6c-4d7c-b67c-9cbe4ba45a3c" />

---

## TC207 – Employee Submits Empty Query
**Description:** Employee submits query text as blank.  
**Expected Result:** System should show "Please enter query".  
**Status:** Pass ✅ (Error shown)  

**Empty Query Screenshot**  

<img width="1910" height="981" alt="image" src="https://github.com/user-attachments/assets/4d0bc6c5-2372-42d7-938b-25312529c419" />

---

## TC208 – Employee Dashboard Shows No Queries
**Description:** Employee dashboard has no queries submitted.  
**Expected Result:** Message "No queries submitted yet, ask your first query" should be shown.  
**Status:** Pass ✅ (Message displayed correctly)  

**Employee No Queries Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/244d5957-f110-4910-9172-f4c2b0285801" />

---

## TC209 – HR Searches for Invalid Employee
**Description:** HR searches for a non-existent employee name.  
**Expected Result:** System should show "No employees found".  
**Status:** Pass ✅ (Message displayed)  

**HR No Employee Found Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/322e8afd-acb6-4812-8330-4054aa03da94" />

---

## TC210 – Agent Responds to Query Without Message
**Description:** Agent tries to respond to query without entering a reply.  
**Expected Result:** Reply should not submit.  
**Status:** Not Implemented 🚧 (Feature not developed yet)  

**Agent Empty Response Screenshot** 

<img width="1910" height="981" alt="image" src="https://github.com/user-attachments/assets/b4a2dfad-433c-4efb-aa49-77e5feb1b7e8" />

---

## TC211 – Employee Views Agent Response Delay
**Description:** Agent doesn’t respond immediately.  
**Expected Result:** Employee should still see query with "Pending response".  
**Status:** Not Implemented 🚧 (Feature not developed yet)  


