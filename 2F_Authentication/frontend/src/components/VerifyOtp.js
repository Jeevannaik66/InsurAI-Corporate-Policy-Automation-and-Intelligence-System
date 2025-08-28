import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Card, Alert, Row, Col } from "react-bootstrap";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Added success message state
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const inputRefs = useRef([]);

  // ⏳ Countdown Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // 🔹 Handle OTP Input Change
  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 🔹 Handle Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // 🔹 Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Clear success messages
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: otp.join(""),
      });

      alert(response.data.message);
      navigate("/dashboard"); // ✅ Redirect to dashboard
    } catch (error) {
      setError(error.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    setSuccessMessage(""); // Clear previous messages

    try {
      const response = await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      setSuccessMessage(response.data.message || "A new OTP has been sent to your email."); // ✅ Show success message
      setTimer(30);
      setCanResend(false);
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container className="verify-container d-flex justify-content-center align-items-center">
      <Card className="verify-card glassmorphism p-4">
        <h2 className="mb-3 text-center text-white">Verify OTP</h2>
        <p className="text-center text-light">
          Enter the 6-digit OTP sent to: <strong>{email}</strong>
        </p>

        {/* ✅ Display Success or Error Messages */}
        {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3 justify-content-center">
            {otp.map((_, index) => (
              <Col key={index} xs={2} className="text-center">
                <Form.Control
                  type="text"
                  maxLength="1"
                  className="text-center otp-box"
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  required
                />
              </Col>
            ))}
          </Row>

          <Button variant="primary" type="submit" className="w-100 login-btn mt-3" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </Form>

        {/* 🔁 Resend OTP Button */}
        <Row className="mt-3">
          <Col className="text-center">
            <Button
              variant="outline-light"
              className="resend-otp-btn"
              onClick={handleResendOtp}
              disabled={!canResend || resendLoading}
            >
              {resendLoading ? "Resending..." : `Resend OTP ${timer > 0 ? `(${timer}s)` : ""}`}
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="text-center">
            <a href="/login" className="text-light">Back to Login</a>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default VerifyOtp;
