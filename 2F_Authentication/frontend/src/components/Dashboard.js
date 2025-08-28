import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // ✅ Remove token on logout
    setUser(null);
    navigate("/login"); // ✅ Redirect to login after logout
  };

  return (
    <Container className="dashboard-container d-flex justify-content-center align-items-center">
      <Card className="dashboard-card p-4 text-center">
        <h2 className="dashboard-title">Welcome, {user ? user : "Guest"}! 👋</h2>
        <p className="dashboard-subtitle">You're logged into your account.</p>

        <Button className="logout-btn mt-3 w-100" onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </Container>
  );
};

export default Dashboard;
