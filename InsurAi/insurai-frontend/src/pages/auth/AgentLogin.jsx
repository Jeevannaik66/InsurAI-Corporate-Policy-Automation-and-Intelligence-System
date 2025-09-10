import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AgentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/agent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Store agent details in localStorage
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("role", data.role || "agent");
        localStorage.setItem("agentId", data.agentId);
        localStorage.setItem("agentName", data.name);

        navigate("/agent/dashboard");
      } else if (response.status === 401) {
        setError("Invalid password");
      } else if (response.status === 404) {
        setError("Agent not found");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #c1f0c1 0%, #a8e6a3 100%)",
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
              background: "linear-gradient(135deg, #2ecc71, #27ae60)",
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
            AG
          </div>
          <h3 className="fw-bold text-dark">Agent Login</h3>
          <p className="text-muted mb-0">Access your dashboard</p>
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
              placeholder="agent@example.com"
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
              placeholder="Enter your password"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold shadow-sm"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2ecc71, #27ae60)",
              border: "none",
              color: "white",
            }}
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p style={{ fontSize: "0.85rem" }}>Forgot password? Contact admin.</p>
        </div>
      </div>
    </div>
  );
}
