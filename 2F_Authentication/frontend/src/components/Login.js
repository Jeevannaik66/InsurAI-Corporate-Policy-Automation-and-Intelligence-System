import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import "../App.css"; // Import global styles

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            alert(response.data.message); // OTP sent alert
            navigate("/verify-otp", { state: { email } }); // Redirect to OTP verification
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="login-container d-flex justify-content-center align-items-center">
            <Card className="login-card glassmorphism p-4">
                <h2 className="mb-3 text-center text-white">Login to Your Account</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-white">Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-white">Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="login-btn w-100" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </Form>

                <Row className="mt-3">
                    <Col className="text-center">
                        <a href="/register" className="text-light">Don't have an account? Register here</a>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col className="text-center">
                        <a href="/forgot-password" className="text-danger">Forgot Password?</a>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default Login;