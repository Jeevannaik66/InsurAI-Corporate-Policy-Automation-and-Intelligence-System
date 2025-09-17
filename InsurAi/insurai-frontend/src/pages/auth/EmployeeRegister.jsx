import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EmployeeRegister() {
  const [employeeId, setEmployeeId] = useState(""); // NEW
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, name, email, password }), // include employeeId
      });

      const text = await res.text();
      setMessage(text);

      if (res.ok) {
        setTimeout(() => {
          navigate("/employee/login");
        }, 1000);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #2980b9 0%, #6dd5fa 50%, #ffffff 100%)",
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
        {/* Header */}
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
          <h3 className="fw-bold text-dark">Create Your Account</h3>
          <p className="text-muted mb-0">Join InsurAI and start your journey 🚀</p>
        </div>

        {/* Alert Messages */}
        {message && (
          <div
            className={`alert ${
              message.includes("Error") ? "alert-danger" : "alert-success"
            } text-center`}
          >
            {message}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-card-text me-2 text-primary"></i> Employee ID
            </label>
            <input
              type="text"
              className="form-control shadow-sm"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              placeholder="Enter your corporate employee ID"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-person me-2 text-primary"></i> Full Name
            </label>
            <input
              type="text"
              className="form-control shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-envelope me-2 text-primary"></i> Email Address
            </label>
            <input
              type="email"
              className="form-control shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-lock me-2 text-primary"></i> Password
            </label>
            <input
              type="password"
              className="form-control shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a strong password"
              style={{ borderRadius: "10px" }}
            />
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
            Create Account
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="mb-1 text-muted">Already have an account?</p>
          <Link
            to="/employee/login"
            className="fw-semibold"
            style={{
              color: "#2980b9",
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
