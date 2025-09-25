import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Dashboard.css";
import AgentRegister from "../../auth/AgentRegister";
import HrRegister from "../../auth/HRRegister";
import AdminPolicy from "./AdminPolicy";

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

  // ---------------- Fetch all claims with policies mapping ----------------
  const fetchAllClaims = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch claims
      const claimsRes = await fetch("http://localhost:8080/claims/all", {
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
        return (
          <div>
            <h4 className="mb-4">Admin Dashboard Overview</h4>
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Users</h5>
                    <h2 className="card-text">{users.length}</h2>
                    <p>
                      <i className="bi bi-people-fill"></i>{" "}
                      {users.filter((u) => u.role === "HR").length} HR,{" "}
                      {users.filter((u) => u.role === "Agent").length} Agents,{" "}
                      {users.filter((u) => u.role === "Employee").length} Employees
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">Claims This Month</h5>
                    <h2 className="card-text">{fraudAlerts.length}</h2>
                    <p>
                      <i className="bi bi-check-circle-fill"></i> Claims logged
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <h5 className="card-title">Fraud Alerts</h5>
                    <h2 className="card-text">{fraudAlerts.length}</h2>
                    <p>
                      <i className="bi bi-exclamation-triangle-fill"></i> Alerts
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <h5 className="card-title">System Health</h5>
                    <h2 className="card-text">100%</h2>
                    <p>
                      <i className="bi bi-heart-fill"></i> All Systems Operational
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>User Management</h4>
              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => setActiveTab("registerHR")}
                >
                  <i className="bi bi-person-plus me-1"></i> Add HR
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setActiveTab("registerAgent")}
                >
                  <i className="bi bi-person-plus me-1"></i> Add Agent
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">All Users</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span
                              className={`badge ${
                                user.role === "HR"
                                  ? "bg-primary"
                                  : user.role === "Agent"
                                  ? "bg-info"
                                  : "bg-secondary"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                user.status === "Active"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

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
  return (
    <div>
      <h4 className="mb-4">All Claims</h4>

      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Claims List</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Policy Name</th>
                  <th>Assigned HR</th>
                  <th>Status</th>
                  <th>Documents</th>
                  <th>Remarks</th>
                  <th>Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {allClaims.length > 0 ? (
                  allClaims.map((claim) => (
                    <tr key={claim.id}>
                      <td>{claim.id}</td>
                      <td>{claim.employeeName || "Unknown"}</td>
                      <td>{claim.employeeIdDisplay || "N/A"}</td>
                      <td>{claim.policyName || "N/A"}</td>
                      <td>{claim.assignedHrName || "Not Assigned"}</td>
                      <td>
                        <span
                          className={`badge ${
                            claim.status === "Approved"
                              ? "bg-success"
                              : claim.status === "Rejected"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td>
                        {claim.documents && claim.documents.length > 0 ? (
                          claim.documents.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-block"
                            >
                              {doc.name}
                            </a>
                          ))
                        ) : (
                          "No Documents"
                        )}
                      </td>
                      <td>{claim.remarks || "-"}</td>
                      <td>{new Date(claim.submittedOn).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No claims found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );


      case "reports":
        return (
          <div>
            <h4 className="mb-4">Reports & Analytics</h4>
            <div className="row mb-4">
              <div className="col-md-4 mb-3">   
                <div className="card">
                  <div className="card-body text-center">
                    <i className="bi bi-file-earmark-text fs-1 text-primary mb-3"></i>
                    <h5>Monthly Claims Report</h5>
                    <p>Summary of all claims processed this month</p>
                    <button className="btn btn-outline-primary">Generate PDF</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="bi bi-graph-up fs-1 text-success mb-3"></i>
                    <h5>Financial Analytics</h5>
                    <p>Revenue, payouts, and financial trends</p>
                    <button className="btn btn-outline-success">View Analytics</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="bi bi-people fs-1 text-info mb-3"></i>
                    <h5>User Activity Report</h5>
                    <p>Usage patterns and system activity</p>
                    <button className="btn btn-outline-info">Generate Report</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Report History</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Report Name</th>
                        <th>Generated On</th>
                        <th>Type</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>October 2023 Claims Report</td>
                        <td>2023-11-01</td>
                        <td><span className="badge bg-primary">PDF</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="bi bi-download"></i> Download
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>Q3 2023 Financial Analytics</td>
                        <td>2023-10-15</td>
                        <td><span className="badge bg-success">Excel</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="bi bi-download"></i> Download
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>User Activity September 2023</td>
                        <td>2023-10-05</td>
                        <td><span className="badge bg-info">CSV</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="bi bi-download"></i> Download
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      
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
        className={`nav-link ${activeTab === "allClaims" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("allClaims"); }}
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