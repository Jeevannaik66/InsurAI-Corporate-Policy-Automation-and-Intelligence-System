import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Submitting Data:", formData);
      await axios.post("http://localhost:5000/api/auth/register", formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="register-container d-flex justify-content-center align-items-center">
      <Card className="register-card glassmorphism p-4">
        <h2 className="mb-3 text-center text-white">Create an Account</h2>
        <p className="text-center text-light">Join us today and get started!</p>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
        {success && <Alert variant="success" className="text-center">✅ Registration successful! Redirecting...</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-white">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-white">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Form>

        <Row className="mt-3">
          <Col className="text-center">
            <a href="/login" className="text-light">Already have an account? Login here</a>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Register;
