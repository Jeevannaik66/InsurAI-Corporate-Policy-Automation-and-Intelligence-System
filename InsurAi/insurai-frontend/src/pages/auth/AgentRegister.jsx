import React, { useState } from "react";
import axios from "axios";

export default function AgentRegister({ onBack }) {
  const [newAgent, setNewAgent] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    // Strict email regex: domain must start with a letter
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z][a-zA-Z0-9-]*(\.[a-zA-Z]{2,})+$/;
    return re.test(email);
  };

  const handleRegisterAgent = async (e) => {
    e.preventDefault();

    // Validate email only
    if (!validateEmail(newAgent.email)) {
      setError("⚠️ Please enter a valid email address (e.g., user@example.com).");
      setSuccess("");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("⚠️ Please login as Admin first.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/admin/agent/register",
        newAgent,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data);
      setError("");
      setNewAgent({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data || "Failed to register agent");
      setSuccess("");
    }
  };

  return (
    <div>
      <h4 className="mb-4">Register Insurance Agent</h4>
      <div className="card">
        <div className="card-body">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleRegisterAgent}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={newAgent.password}
                onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                required
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Register Agent
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onBack}
              >
                Back to Users
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
