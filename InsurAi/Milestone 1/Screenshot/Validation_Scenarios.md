# ❌ Validation (Invalid) Scenario Test Screenshots

This folder contains screenshots of **failed or invalid test cases** for Milestone 1: Authentication & Registration.  
Each test confirms that the system correctly handles errors, prevents invalid actions, and shows proper validation messages.

---

## TC008 – Admin Login (Invalid Password)
**Description:** Admin enters valid email but incorrect password.  
**Expected Result:** System denies access and shows "Invalid credentials" error.  
**Status:** Pass ✅ (Error displayed as expected)  

**Admin Login (Invalid Password) Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/15c1a2cc-b6f5-4c4f-9395-ee5d28346846" />

---

## TC009 – Admin Login (Invalid Email)
**Description:** Admin enters an unregistered email with any password.  
**Expected Result:** System denies access and shows "User not found" error.  
**Status:** Pass ✅ (Error displayed as expected)  

**Admin Login (Invalid Email) Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/86d70c7d-ed83-4e9a-b564-6d0217f3a801" />

---

## TC010 – Admin Registers HR (Missing Required Fields)
**Description:** Admin tries to register HR but leaves one or more mandatory fields empty (e.g., HR ID or Email).  
**Expected Result:** System prevents submission and shows validation error messages.  
**Status:** Pass ✅ (Validation triggered as expected)  

**HR Registration Missing Fields Screenshot**  

<img width="1910" height="981" alt="image" src="https://github.com/user-attachments/assets/5c737f03-7ae6-4a71-bc6c-f5d8bf30c260" />

---

## TC011 – Admin Registers Agent (Invalid Email Format)
**Description:** Admin tries to register an Agent with an invalid email format (e.g., `abc@123`).  
**Expected Result:** System rejects the email and shows "Invalid email format" error.  
**Status:** Pass ✅ (Validation triggered as expected)  

**Agent Registration Invalid Email Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/36d4c416-effa-46bc-a5c4-2cf97630cffc" />

---

## TC012 – HR Login (Invalid Email)
**Description:** HR enters unregistered email with any password.  
**Expected Result:** System denies access and shows "User not found" error.  
**Status:** Pass ✅  

**HR Login Invalid Email Screenshot**  
<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/3662b148-bf50-434d-ae55-987aba1df73d" />

---

## TC013 – HR Login (Invalid Password)
**Description:** HR enters correct email but wrong password.  
**Expected Result:** System denies access and shows "Invalid credentials" error.  
**Status:** Pass ✅  

**HR Login Invalid Password Screenshot**  
<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/6f566509-0318-4d9e-8ed2-598fc13393cc" />

---

## TC014 – Agent Login (Invalid Email)
**Description:** Agent enters unregistered email with any password.  
**Expected Result:** System denies access and shows "User not found" error.  
**Status:** Pass ✅  

**Agent Login Invalid Email Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/83a979b8-670c-49f9-9eec-d33c721a0569" />

---

## TC015 – Agent Login (Invalid Password)
**Description:** Agent enters correct email but wrong password.  
**Expected Result:** System denies access and shows "Invalid credentials" error.  
**Status:** Pass ✅  

**Agent Login Invalid Password Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/629c9fcc-0379-40dd-9a06-54d5c53e3bbc" />

---

## TC016 – Employee Registration (Duplicate Email)
**Description:** Employee tries to register with an email that already exists.  
**Expected Result:** System rejects the registration and shows "Email already registered" error.  
**Status:** Pass ✅  

**Employee Registration Duplicate Email Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/8d6bf71c-d59f-44b5-90be-b092abc37e19" />

---

## TC017 – Employee Registration (Missing Fields)
**Description:** Employee tries to register but leaves one or more required fields empty.  
**Expected Result:** System prevents submission and highlights missing fields.  
**Status:** Pass ✅  

**Employee Registration Missing Fields Screenshot**  

<img width="1910" height="981" alt="image" src="https://github.com/user-attachments/assets/be1ee2eb-e5ae-48dc-9c4b-0e9161060a69" />

---

## TC018 – Employee Login (Invalid Email)

**Description:** Employee enters unregistered email with any password.  
**Expected Result:** System denies access and shows "User not found" error.  
**Status:** Pass ✅  

**Employee Login Invalid Email Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/5f11b7af-cd82-44a1-9e05-41d687cc9a81" />

---

## TC019 – Employee Login (Invalid Password)
**Description:** Employee enters correct email but wrong password.  
**Expected Result:** System denies access and shows "Invalid credentials" error.  
**Status:** Pass ✅  

**Employee Login Invalid Password Screenshot**  

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/9d80ddc2-aea5-4ae5-b927-d4aa5fd06a23" />

---

## Summary
- Total Invalid Test Cases: **12**  
- All negative scenarios validated successfully.  
- System correctly prevents unauthorized/invalid actions and displays proper error messages.
