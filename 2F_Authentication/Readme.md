# 🔐 Two-Factor Authentication (2FA) Project

This project implements a secure **authentication system** using **Node.js, Express, MongoDB, and JWT**.  
It includes **Email-based OTP (One-Time Password) verification** to add an extra layer of security.

---

## 📸 Screenshots

### 📝 Register Page
<img width="1755" height="902" alt="Register Page" src="https://github.com/user-attachments/assets/d6e307a9-a175-4ba5-88cf-4f8335fca9ca" />

### 🔑 Login Page
<img width="1755" height="902" alt="Login Page" src="https://github.com/user-attachments/assets/80f860bc-2738-46c7-b588-128fbeaec499" />

### 📧 OTP Verification
<img width="1755" height="902" alt="OTP Verification" src="https://github.com/user-attachments/assets/c8b26a9c-75ee-4f77-a28d-b0ddb0b91275" />

### 🔒 Reset Password
<img width="1755" height="902" alt="Reset Password" src="https://github.com/user-attachments/assets/75ef9f68-1241-46cc-a11b-1c5026e6b9f7" />

### OTP Page
<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/60561229-ac5e-4fe1-ab72-d1ed1432656e" />


---

## ⚙️ Requirements

- Node.js (>= 14)
- MongoDB (local or Atlas Cloud)
- A **valid Gmail account** (for sending OTPs and password reset emails)
- Postman or frontend client to test

⚠️ **Important:** You must enter a **real, valid email address** during registration and login. Otherwise, you will not receive OTPs or reset links.

---

## 🛠 Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=your_jwt_secret_key

# Gmail configuration (use app password for better security)
EMAIL=youremail@gmail.com
EMAIL_PASSWORD=yourapppassword
```

⚠️ **Note:**

* Use **Google App Passwords** instead of your actual Gmail password.
* OTPs and reset links will be sent to the **email you enter at login or registration**.

---

## ▶️ Running the Project

Start the development server:

```bash
npm start
```

or with nodemon:

```bash
npm run dev
```

Now open:

```
http://localhost:5000
```

---

## 🔑 Features

* User Registration with password hashing
* Login with email + password
* OTP sent to registered email (valid for 5 minutes)
* Verify OTP before login is complete
* Resend OTP if needed
* Forgot Password & Reset via email link
* JWT-based authentication for session management
* Secure logout (handled on frontend)

---

## 📌 Notes

* OTP expires in **5 minutes** — you must enter it within that time.
* Always provide a **valid email** to proceed. Otherwise, OTP emails will not be delivered.
* JWT tokens are valid for **1 hour**.
* On logout, simply remove the token on the client side.

---


Would you like me to also add a **`screenshots/README_PLACEHOLDER.md` file** in the repo with instructions on where to upload screenshots, so it’s easier for you to just drop images and push to GitHub?
```
