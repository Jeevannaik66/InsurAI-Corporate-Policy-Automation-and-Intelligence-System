import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const data = res.data;

      // Store token and user info
      let token;
      if (data?.token && typeof data.token === "string") {
        token = data.token;
        localStorage.setItem("role", data.role?.toLowerCase() || "employee");
        localStorage.setItem("name", data.name || "");
      } else if (typeof data === "string") {
        token = data;
        localStorage.setItem("role", "employee");
        localStorage.setItem("name", "");
      } else {
        throw new Error("Invalid login response: no token string found");
      }

      // ✅ Store token as string only
      localStorage.setItem("token", token);
      console.log("[Login] Stored token:", token);

      navigate("/employee/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again later.");
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

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-envelope me-2 text-primary"></i> Email
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

          <div className="mb-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-lock me-2 text-primary"></i> Password
            </label>
            <input
              type="password"
              className="form-control shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
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
