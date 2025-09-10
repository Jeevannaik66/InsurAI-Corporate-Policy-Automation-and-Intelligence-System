import React, { useState } from "react";
import axios from "axios";

export default function HrRegister({ onBack }) {
  const [newHr, setNewHr] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    hrId: "",
    password: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRegisterHr = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // ✅ get admin token

      const response = await axios.post(
        "http://localhost:8080/admin/hr/register",
        newHr,
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // ✅ send token for authentication
          },
          withCredentials: true,
        }
      );

      setSuccess(response.data || "HR staff registered successfully!");
      setError("");
      setNewHr({ name: "", email: "", phoneNumber: "", hrId: "", password: "" });
    } catch (err) {
      console.error("Register HR error:", err);
      setError(err.response?.data || "Failed to register HR");
      setSuccess("");
    }
  };

  return (
    <div>
      <h4 className="mb-4">Register HR Staff</h4>
      <div className="card">
        <div className="card-body">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleRegisterHr}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={newHr.name}
                onChange={(e) => setNewHr({ ...newHr, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={newHr.email}
                onChange={(e) => setNewHr({ ...newHr, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={newHr.phoneNumber}
                onChange={(e) => setNewHr({ ...newHr, phoneNumber: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">HR ID</label>
              <input
                type="text"
                className="form-control"
                value={newHr.hrId}
                onChange={(e) => setNewHr({ ...newHr, hrId: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={newHr.password}
                onChange={(e) => setNewHr({ ...newHr, password: e.target.value })}
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Register HR
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={onBack}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
