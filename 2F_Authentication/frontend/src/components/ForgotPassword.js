import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
            setMessage(response.data.message);

            // ✅ Navigate to login after 3 seconds
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset link.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card className="p-4 shadow-lg" style={{ width: "400px", borderRadius: "10px" }}>
                <h2 className="text-center text-primary">Forgot Password</h2>
                
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleForgotPassword}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <a href="/login" className="text-decoration-none">🔙 Back to Login</a>
                </div>
            </Card>
        </Container>
    );
};

export default ForgotPassword;
