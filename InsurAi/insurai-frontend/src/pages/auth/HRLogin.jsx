import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HrLogin() {
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
      const res = await fetch("http://localhost:8080/hr/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        let serverError = text;

        try {
          const parsed = JSON.parse(text);
          if (parsed?.email) setErrorEmail(parsed.email);
          if (parsed?.password) setErrorPassword(parsed.password);
          serverError = parsed?.message || parsed || text;
        } catch (err) {
          serverError = text || "Login failed";
        }

        throw new Error(serverError);
      }

      const data = await res.json();

      // ✅ Store HR info including ID
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "hr");
      localStorage.setItem("name", data.name);
      localStorage.setItem("id", data.id); // <--- this line ensures logged HR ID is saved

      navigate("/hr/dashboard");
    } catch (err) {
      console.error("HR Login error:", err);
      if (!errorEmail && !errorPassword) setErrorPassword(err.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #f6d365, #fda085)",
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
            HR
          </div>
          <h3 className="fw-bold text-dark">HR Login</h3>
          <p className="text-muted mb-0">Access your dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} autoComplete="on">
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="hr-email">
              Email
            </label>
            <input
              type="email"
              id="hr-email"
              name="username"
              autoComplete="username"
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
            <label className="form-label fw-semibold" htmlFor="hr-password">
              Password
            </label>
            <input
              type="password"
              id="hr-password"
              name="password"
              autoComplete="current-password"
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
            className="btn w-100 fw-semibold shadow-sm"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #f6d365, #fda085)",
              border: "none",
              color: "white",
            }}
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="fw-semibold text-decoration-none"
            style={{ color: "#f57c00" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
