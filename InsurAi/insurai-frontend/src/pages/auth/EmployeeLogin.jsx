import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z][a-zA-Z0-9-]*(\.[a-zA-Z]{2,})+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorEmail("");
    setErrorPassword("");

    if (!validateEmail(email)) {
      setErrorEmail("⚠️ Please enter a valid email address (e.g., user@example.com).");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const data = res.data;

      if (!data || !data.token) {
        throw new Error("Invalid login response: no token found");
      }

      // Store user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role?.toLowerCase() || "employee");
      localStorage.setItem("name", data.name || "");
      localStorage.setItem("employeeId", data.employeeId || ""); // ✅ store employeeId

      navigate("/employee/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        const status = err.response.status;

        if (status === 404) {
          setErrorEmail("⚠️ User not found. Please check your email or register.");
        } else if (status === 401) {
          setErrorPassword("⚠️ Incorrect password. Please try again.");
        } else {
          setErrorPassword("⚠️ Login failed. Please try again later.");
        }
      } else {
        setErrorPassword("⚠️ Login failed. Please try again later.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #6dd5fa 0%, #2980b9 50%, #ffffff 100%)",
        padding: "0",
        margin: "0",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "15px",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        <div className="text-center mb-4">
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #3498db, #2ecc71)",
              borderRadius: "50%",
              margin: "0 auto 15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            AI
          </div>
          <h3 className="fw-bold text-dark">Welcome Back</h3>
          <p className="text-muted mb-0">Login to your InsurAI account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-envelope me-2 text-primary"></i> Email
            </label>
            <input
              type="email"
              className={`form-control shadow-sm ${errorEmail ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{ borderRadius: "10px" }}
            />
            {errorEmail && <div className="invalid-feedback">{errorEmail}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-lock me-2 text-primary"></i> Password
            </label>
            <input
              type="password"
              className={`form-control shadow-sm ${errorPassword ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{ borderRadius: "10px" }}
            />
            {errorPassword && <div className="invalid-feedback">{errorPassword}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold shadow-sm"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3498db, #2980b9)",
              border: "none",
            }}
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-1 text-muted">Don’t have an account?</p>
          <Link
            to="/employee/register"
            className="fw-semibold"
            style={{
              color: "#2980b9",
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
