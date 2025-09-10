import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("name", data.name);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
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
            AD
          </div>
          <h3 className="fw-bold text-dark">Admin Login</h3>
          <p className="text-muted mb-0">Enter your credentials to access the dashboard</p>
        </div>

        {/* Error Alert */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@insurai.com"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold shadow-sm"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              border: "none",
              color: "white",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p style={{ fontSize: "0.85rem" }}>
            Forgot password? Contact system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
