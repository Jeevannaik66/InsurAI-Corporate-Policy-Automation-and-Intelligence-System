import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Dashboard.css";
import AgentRegister from "../../auth/AgentRegister";
import HrRegister from "../../auth/HRRegister";
import AdminPolicy from "./AdminPolicy";
import AdminAllClaims from './AdminAllClaims';
import AdminReportsAnalytics from "./AdminReportsAnalytics"; // adjust path as needed
import AdminUserManagement from "./AdminUserManagement";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  const [users, setUsers] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [newHR, setNewHR] = useState({ name: "", email: "", password: "" });
  const [newAgent, setNewAgent] = useState({ name: "", email: "", password: "" });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  // ---------------- fetchUsers ----------------
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch agents
      const agentsRes = await axios.get("http://localhost:8080/agent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const agentsData = Array.isArray(agentsRes.data) ? agentsRes.data : [];
      const mappedAgents = agentsData.map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        role: "Agent",
        status: "Active",
      }));

      // Fetch employees
      const employeesRes = await axios.get("http://localhost:8080/auth/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const employeesData = Array.isArray(employeesRes.data) ? employeesRes.data : [];
      const mappedEmployees = employeesData.map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        role: "Employee",
        status: e.active ? "Active" : "Inactive",
      }));

      // Fetch HRs
      const hrsRes = await axios.get("http://localhost:8080/hr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const hrsData = Array.isArray(hrsRes.data) ? hrsRes.data : [];
      const mappedHRs = hrsData.map((h) => ({
        id: h.id,
        name: h.name,
        email: h.email,
        role: "HR",
        status: "Active",
      }));

      // Combine agents + employees + HRs
      const allUsers = [...mappedAgents, ...mappedEmployees, ...mappedHRs];
      setUsers(allUsers);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ---------------- Register HR ----------------
  const handleRegisterHR = async (hrData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/admin/hr/register", hrData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewHR({ name: "", email: "", password: "" });
      setActiveTab("users");
      fetchUsers();
    } catch (err) {
      console.error("Failed to register HR", err);
      alert("Error registering HR");
    }
  };

  // ---------------- Register Agent ----------------
  const handleRegisterAgent = async (agentData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/admin/agent/register", agentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewAgent({ name: "", email: "", password: "" });
      setActiveTab("users");
      fetchUsers();
    } catch (err) {
      console.error("Failed to register Agent", err);
      alert("Error registering Agent");
    }
  };

  // ---------------- Fetch all claims with policies, employee & HR mapping ----------------
  const fetchAllClaims = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch claims
      const claimsRes = await fetch("http://localhost:8080/admin/claims", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!claimsRes.ok) {
        console.error("Failed to fetch claims");
        return;
      }
      const claimsData = await claimsRes.json();

      // Fetch employees
      const empRes = await fetch("http://localhost:8080/auth/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const employees = await empRes.json();

      // Fetch HRs
      const hrRes = await fetch("http://localhost:8080/hr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const hrs = await hrRes.json();

      // Fetch policies
      const policyRes = await fetch("http://localhost:8080/admin/policies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const policiesData = await policyRes.json();
      setPolicies(policiesData);

      // Map claims with employee, HR, and policy details
      const mappedClaims = claimsData.map((claim) => {
        const employee = employees.find(
          (emp) => emp.id === claim.employeeId || emp.id === claim.employee_id
        );
        const hr = hrs.find(
          (hr) => hr.id === claim.assignedHrId || hr.id === claim.assigned_hr_id
        );
        const policy = policiesData.find(
          (p) => p.id === claim.policyId || p.id === claim.policy_id
        );

        return {
          ...claim,
          employeeName: employee?.name || "Unknown",
          employeeIdDisplay: employee?.employeeId || "N/A",
          documents: claim.documents || [],
          assignedHrName: hr?.name || "Not Assigned",
          policyName: policy?.policyName || "N/A",
          remarks: claim.remarks || "",
        };
      });

      setClaims(mappedClaims);
    } catch (err) {
      console.error("Error fetching claims:", err);
    }
  };

  useEffect(() => {
    fetchAllClaims();
  }, []);



  // ---------------- Render content ----------------
 const renderContent = () => {
  switch (activeTab) {
    case "home":
      // --- Users ---
      const totalUsers = users.length;
      const totalHR = users.filter(u => u.role === "HR").length;
      const totalAgents = users.filter(u => u.role === "Agent").length;
      const totalEmployees = users.filter(u => u.role === "Employee").length;
      const activeUsers = users.filter(u => u.status === "Active").length;
      const inactiveUsers = users.filter(u => u.status === "Inactive").length;

      // --- Claims ---
      const totalClaims = claims.length;
      const pendingClaims = claims.filter(c => c.status === "Pending").length;
      const resolvedClaims = claims.filter(c => c.status === "Resolved").length;
      const highPriorityAlerts = claims.filter(c => c.priority === "High").length;

      // --- Time-based stats ---
      const today = new Date().toDateString();
      const newUsersToday = users.filter(u => new Date(u.createdAt).toDateString() === today).length;
      const resolvedToday = claims.filter(c => c.status === "Resolved" && new Date(c.updatedAt).toDateString() === today).length;

      // --- Recent Activity ---
      const recentActivities = claims
        .slice(-5)
        .reverse()
        .map(c => ({
          id: c.id,
          action: `Claim by ${c.employeeName}`,
          user: `Policy: ${c.policyName}`,
          time: new Date(c.createdAt).toLocaleString(),
          type: c.status === "Pending" ? "warning" : c.status === "Resolved" ? "success" : "info",
        }));

      // --- Chart Data ---
      const claimChartData = [
        { name: "Pending", value: pendingClaims },
        { name: "Resolved", value: resolvedClaims },
        { name: "High Priority", value: highPriorityAlerts },
      ];

      return (
        <div className="admin-dashboard">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold text-gray-800 mb-1">Admin Dashboard</h4>
              <p className="text-gray-600 mb-0">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="text-end">
              <small className="text-gray-500">Last updated: {new Date().toLocaleTimeString()}</small>
              <div className="badge bg-success ms-2">
                <i className="bi bi-circle-fill me-1" style={{ fontSize: "6px" }}></i>
                System Online
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="row mb-4">
            {/* Users */}
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-primary text-uppercase mb-1">Total Users</h6>
                  <h2 className="fw-bold">{totalUsers}</h2>
                  <p className="mb-0 small text-muted">
                    {totalHR} HR • {totalAgents} Agents • {totalEmployees} Employees
                  </p>
                </div>
              </div>
            </div>
            {/* User Status */}
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-success text-uppercase mb-1">User Status</h6>
                  <h2 className="fw-bold">
                    {activeUsers}
                    <small className="text-muted"> / {totalUsers}</small>
                  </h2>
                  <div className="progress progress-sm">
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${(activeUsers / totalUsers) * 100 || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Claims */}
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-warning text-uppercase mb-1">Claims</h6>
                  <h2 className="fw-bold">{totalClaims}</h2>
                  <p className="small mb-1">
                    <span className="badge bg-warning">{pendingClaims}</span> Pending
                  </p>
                  <p className="small mb-1">
                    <span className="badge bg-success">{resolvedClaims}</span> Resolved
                  </p>
                  <p className="small mb-0">
                    <span className="badge bg-danger">{highPriorityAlerts}</span> High Priority
                  </p>
                </div>
              </div>
            </div>
            {/* System */}
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-info text-uppercase mb-1">System Health</h6>
                  <h2 className="fw-bold">100%</h2>
                  <p className="small text-muted mb-0">All systems operational</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts & Info */}
          <div className="row mb-4">
            {/* Quick Stats */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 fw-bold text-gray-800">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Quick Stats
                  </h6>
                </div>
                <div className="card-body">
                  <p className="mb-2">New Users Today: <b>{newUsersToday}</b></p>
                  <p className="mb-2">Pending Claims: <b>{pendingClaims}</b></p>
                  <p className="mb-0">Resolved Today: <b>{resolvedToday}</b></p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="col-lg-8 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 fw-bold text-gray-800">
                    <i className="bi bi-bar-chart-line me-2"></i>
                    Claims Overview
                  </h6>
                </div>
                <div className="card-body" style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={claimChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#ffc107" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white">
              <h6 className="m-0 fw-bold text-gray-800">
                <i className="bi bi-clock-history me-2"></i> Recent Activity
              </h6>
            </div>
            <div className="card-body">
              {recentActivities.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {recentActivities.map(a => (
                    <li key={a.id} className="list-group-item border-0 px-0">
                      <b>{a.action}</b> — <span className="text-muted">{a.user}</span>
                      <div className="small text-gray-500">{a.time}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No recent activity</p>
              )}
            </div>
          </div>

          {/* Alerts */}
          {highPriorityAlerts > 0 && (
            <div className="card border-left-danger shadow-sm">
              <div className="card-body">
                <h6 className="text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i> Action Required
                </h6>
                <p>You have {highPriorityAlerts} high-priority claims.</p>
                <button className="btn btn-danger btn-sm" onClick={() => setActiveTab("claims")}>
                  Review Claims
                </button>
              </div>
            </div>
          )}
        </div>
      );

case "users":
  return <AdminUserManagement users={users} setActiveTab={setActiveTab} />;

      case "registerHR":
        return (
          <HrRegister
            onBack={() => setActiveTab("users")}
            onRegister={handleRegisterHR}
            newHR={newHR}
            setNewHR={setNewHR}
          />
        );

      case "registerAgent":
        return (
          <AgentRegister
            onBack={() => setActiveTab("users")}
            onRegister={handleRegisterAgent}
            newAgent={newAgent}
            setNewAgent={setNewAgent}
          />
        );

        case "createPolicy":
        return <AdminPolicy />;

case "claims":
      return <AdminAllClaims claims={claims} />;

 case "reports":
  return <AdminReportsAnalytics />;

      
      case "fraud":
        return (
          <div>
            <h4 className="mb-4">Fraud Detection Alerts</h4>
            <div className="card">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Active Alerts</h5>
                <span className="badge bg-warning">{fraudAlerts.filter(a => a.status !== 'Resolved').length} Active</span>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fraudAlerts.map(alert => (
                        <tr key={alert.id}>
                          <td>{alert.type}</td>
                          <td>{alert.employee}</td>
                          <td>{alert.date}</td>
                          <td>
                            <span className={`badge ${alert.status === 'Pending' ? 'bg-warning' : alert.status === 'Resolved' ? 'bg-success' : 'bg-info'}`}>
                              {alert.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="bi bi-eye"></i> Details
                            </button>
                            <button className="btn btn-sm btn-outline-success me-1">
                              <i className="bi bi-check"></i> Resolve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="card mt-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Fraud Detection Statistics</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3 mb-3">
                    <div className="border rounded p-3">
                      <h3 className="text-primary">12</h3>
                      <p>Total Detected This Month</p>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="border rounded p-3">
                      <h3 className="text-success">$8,542</h3>
                      <p>Potential Savings</p>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="border rounded p-3">
                      <h3 className="text-warning">3</h3>
                      <p>Pending Investigation</p>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="border rounded p-3">
                      <h3 className="text-info">94%</h3>
                      <p>Detection Accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "config":
        return (
          <div>
            <h4 className="mb-4">System Configuration</h4>
            
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Tax Rules</h5>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Tax Percentage</label>
                        <input type="number" className="form-control" defaultValue="15" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Fiscal Year Start</label>
                        <input type="date" className="form-control" defaultValue="2023-04-01" />
                      </div>
                      <button type="submit" className="btn btn-primary">Save Tax Settings</button>
                    </form>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Company Policies</h5>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Max Claim Amount</label>
                        <input type="number" className="form-control" defaultValue="5000" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Auto-Approval Limit</label>
                        <input type="number" className="form-control" defaultValue="1000" />
                      </div>
                      <button type="submit" className="btn btn-primary">Save Policy Settings</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Automation Settings</h5>
              </div>
              <div className="card-body">
                <div className="mb-3 form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="autoRenewal" defaultChecked />
                  <label className="form-check-label" htmlFor="autoRenewal">Auto Policy Renewals</label>
                </div>
                <div className="mb-3 form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                  <label className="form-check-label" htmlFor="emailNotifications">Email Notifications</label>
                </div>
                <div className="mb-3 form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="smsAlerts" />
                  <label className="form-check-label" htmlFor="smsAlerts">SMS Alerts</label>
                </div>
                <button type="submit" className="btn btn-primary">Save Automation Settings</button>
              </div>
            </div>
          </div>
        );
      
      case "audit":
        return (
          <div>
            <h4 className="mb-4">Audit Logs & Activity Tracking</h4>
            
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Filter Logs</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">User Role</label>
                    <select className="form-select">
                      <option value="">All Roles</option>
                      <option value="Admin">Admin</option>
                      <option value="HR">HR</option>
                      <option value="Agent">Agent</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Date Range</label>
                    <select className="form-select">
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 90 days</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Action Type</label>
                    <select className="form-select">
                      <option value="">All Actions</option>
                      <option value="login">Login</option>
                      <option value="claim">Claim Actions</option>
                      <option value="user">User Management</option>
                      <option value="system">System Changes</option>
                    </select>
                  </div>
                </div>
                <button className="btn btn-primary">Apply Filters</button>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">System Activity Log</h5>
                <button className="btn btn-sm btn-outline-light">
                  <i className="bi bi-download me-1"></i> Export Logs
                </button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Action</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {systemLogs.map(log => (
                        <tr key={log.id}>
                          <td>{log.time}</td>
                          <td>{log.user}</td>
                          <td>
                            <span className={`badge ${log.user === 'Admin' ? 'bg-danger' : log.user.includes('HR') ? 'bg-primary' : 'bg-secondary'}`}>
                              {log.user === 'Admin' ? 'Admin' : log.user.includes('HR') ? 'HR' : 'User'}
                            </span>
                          </td>
                          <td>{log.action}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-list"></i> Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <nav aria-label="Log navigation">
                  <ul className="pagination justify-content-center mt-4">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" tabIndex="-1">Previous</a>
                    </li>
                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                      <a className="page-link" href="#">Next</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        );
      
      default:
        return <h4>Welcome to Admin Dashboard</h4>;
    }
  };

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <header className="bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-shield-check fs-2"></i>
          <h2 className="mb-0">InsurAI Admin Portal</h2>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span>Welcome, <strong>Admin</strong></span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </header>

{/* Main Layout */}
<div className="dashboard-main">
  {/* Sidebar */}
  <aside className="dashboard-sidebar">
    <nav className="nav flex-column p-3">
      <a
        href="#"
        className={`nav-link ${activeTab === "home" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("home"); }}
      >
        <i className="bi bi-speedometer2 me-2"></i> Dashboard
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "users" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("users"); }}
      >
        <i className="bi bi-people me-2"></i> User Management
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "registerHR" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("registerHR"); }}
      >
        <i className="bi bi-person-plus me-2"></i> Register HR
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "registerAgent" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("registerAgent"); }}
      >
        <i className="bi bi-person-plus me-2"></i> Register Agent
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "createPolicy" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("createPolicy"); }}
      >
        <i className="bi bi-file-medical me-2"></i> Create Policy
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "claims" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("claims"); }}
      >
        <i className="bi bi-card-list me-2"></i> All Claims
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("reports"); }}
      >
        <i className="bi bi-graph-up me-2"></i> Reports & Analytics
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "fraud" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("fraud"); }}
      >
        <i className="bi bi-shield-exclamation me-2"></i> Fraud Detection
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "config" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("config"); }}
      >
        <i className="bi bi-gear me-2"></i> System Configuration
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "audit" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("audit"); }}
      >
        <i className="bi bi-list-check me-2"></i> Audit Logs
      </a>
    </nav>
  </aside>

  {/* Content Area */}
  <main className="dashboard-content">
    <div className="dashboard-content-wrapper p-4">
      {renderContent()}
    </div>
  </main>
</div>

    </div>
  );
}