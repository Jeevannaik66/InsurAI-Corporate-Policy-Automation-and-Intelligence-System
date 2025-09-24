import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Dashboard.css";

export default function HRDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  // Claims from backend
  const [pendingClaims, setPendingClaims] = useState([]);
  const [mappedClaims, setMappedClaims] = useState([]); // For employee names

  // Employees from backend (for reference/filter)
  const [employees, setEmployees] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [policyFilter, setPolicyFilter] = useState("");

  // Fraud alerts (optional)
  const [fraudAlerts, setFraudAlerts] = useState([]);

  // Modal state (for employee details/documents)
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ---------------- Fetch employees ----------------
  useEffect(() => {
    fetch("http://localhost:8080/auth/employees")
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("Error fetching employees:", err));
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchesName = emp.name?.toLowerCase().includes(searchName.toLowerCase());
    const matchesPolicy = policyFilter === "" || emp.role === policyFilter;
    return matchesName && matchesPolicy;
  });

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleEdit = (employee) => {
    alert(`Edit feature coming soon for: ${employee.name}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/hr/login");
  };

  // ---------------- Fetch claims ----------------
  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/hr/login");
        return;
      }

      const res = await fetch("http://localhost:8080/hr/claims", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setPendingClaims(data); // just store raw claims
      } else if (res.status === 403) {
        console.error("Forbidden: Invalid token or role");
        navigate("/hr/login");
      } else {
        console.error("Failed to fetch claims");
      }
    } catch (err) {
      console.error("Error fetching claims:", err);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // ---------------- Map employee names after both claims & employees are loaded ----------------
  useEffect(() => {
    if (pendingClaims.length > 0 && employees.length > 0) {
      const updatedClaims = pendingClaims.map(claim => {
        const employee = employees.find(emp => emp.id === claim.employeeId);
        return {
          ...claim,
          employeeName: employee?.name || "Unknown",
          employeeIdDisplay: employee?.employeeId || "N/A",
          documents: claim.documents || [],
        };
      });
      setMappedClaims(updatedClaims);
    }
  }, [pendingClaims, employees]);

  // ---------------- Approve a claim ----------------
  const approveClaim = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/hr/claims/approve/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updatedClaim = await res.json();
        setMappedClaims(prev =>
          prev.map(claim => (claim.id === id ? {
            ...updatedClaim,
            employeeName: employees.find(emp => emp.id === updatedClaim.employeeId)?.name || "Unknown",
            employeeIdDisplay: employees.find(emp => emp.id === updatedClaim.employeeId)?.employeeId || "N/A",
            documents: updatedClaim.documents || [],
          } : claim))
        );
        alert("Claim approved successfully");
      } else {
        alert("Failed to approve claim");
      }
    } catch (err) {
      console.error("Error approving claim:", err);
    }
  };

  // ---------------- Reject a claim ----------------
  const rejectClaim = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/hr/claims/reject/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updatedClaim = await res.json();
        setMappedClaims(prev =>
          prev.map(claim => (claim.id === id ? {
            ...updatedClaim,
            employeeName: employees.find(emp => emp.id === updatedClaim.employeeId)?.name || "Unknown",
            employeeIdDisplay: employees.find(emp => emp.id === updatedClaim.employeeId)?.employeeId || "N/A",
            documents: updatedClaim.documents || [],
          } : claim))
        );
        alert("Claim rejected");
      } else {
        alert("Failed to reject claim");
      }
    } catch (err) {
      console.error("Error rejecting claim:", err);
    }
  };

  // ---------------- Resolve fraud alert (optional) ----------------
  const resolveFraudAlert = (id) => {
    setFraudAlerts(alerts =>
      alerts.map(alert =>
        alert.id === id ? { ...alert, status: "Resolved" } : alert
      )
    );
    alert("Fraud alert resolved");
  }

  // ---------------- Policies state ----------------
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/employee/policies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const formattedPolicies = data.map(policy => ({
            id: policy.id,
            policyName: policy.policyName,
            policyType: policy.policyType,
            providerName: policy.providerName,
            coverageAmount: policy.coverageAmount,
            monthlyPremium: policy.monthlyPremium,
            renewalDate: policy.renewalDate,
            policyStatus: policy.policyStatus,
            policyDescription: policy.policyDescription,
            contractUrl: policy.contractUrl,
            termsUrl: policy.termsUrl,
            claimFormUrl: policy.claimFormUrl,
            annexureUrl: policy.annexureUrl,
          }));
          setPolicies(formattedPolicies);
        } else {
          console.error("Failed to fetch policies");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchPolicies();
  }, []);


// Render content based on active tab
const renderContent = () => {
  switch (activeTab) {
    case "home":
      return (
        <div>
          <h4 className="mb-4">HR Dashboard Overview</h4>

          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Pending Claims</h5>
                  <h2 className="card-text">{pendingClaims.filter(c => c.status === "Pending").length}</h2>
                  <p><i className="bi bi-clock-history"></i> Require review</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Active Employees</h5>
                  <h2 className="card-text">{employees.length}</h2>
                  <p><i className="bi bi-people-fill"></i> With active policies</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <h5 className="card-title">Fraud Alerts</h5>
                  <h2 className="card-text">{fraudAlerts.filter(a => a.status !== "Resolved").length}</h2>
                  <p><i className="bi bi-exclamation-triangle"></i> Need attention</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">Policies Expiring</h5>
                  <h2 className="card-text">3</h2>
                  <p><i className="bi bi-calendar-x"></i> In next 30 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Claims preview */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Pending Claims</h5>
                </div>
                <div className="card-body">
                  {pendingClaims.slice(0, 3).map(claim => (
                    <div key={claim.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                      <div>
                        <h6 className="mb-0">{claim.employeeName}</h6>
                        <small className="text-muted">{claim.title} • ${claim.amount}</small>
                      </div>
                      <span className={`badge ${claim.status === 'Pending' ? 'bg-warning' : claim.status === 'Approved' ? 'bg-success' : 'bg-danger'}`}>
                        {claim.status}
                      </span>
                    </div>
                  ))}
                  <button className="btn btn-outline-primary mt-3 btn-sm" onClick={() => setActiveTab("claims")}>
                    View All Claims
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "claims":
      return (
        <div>
          <h4 className="mb-4">Claim Approval Management</h4>

          {/* All Claims Table */}
          <div className="card">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">All Claims</h5>
              <span className="badge bg-light text-dark">{pendingClaims.filter(c => c.status === "Pending").length} Pending</span>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Employee ID</th>
                      <th>Claim Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                      <th>Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappedClaims.map(claim => (
                      <tr key={claim.id}>
                        <td>{claim.employeeName}</td>
                        <td>{claim.employeeIdDisplay}</td>
                        <td>{claim.title}</td>
                        <td>${claim.amount}</td>
                        <td>{claim.claimDate?.split("T")[0]}</td>
                        <td>
                          <span className={`badge ${claim.status === 'Pending' ? 'bg-warning' : claim.status === 'Approved' ? 'bg-success' : 'bg-danger'}`}>
                            {claim.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => alert("View feature coming soon")}>
                            <i className="bi bi-eye"></i> View
                          </button>
                          {claim.status === "Pending" && (
                            <>
                              <button className="btn btn-sm btn-outline-success me-1" onClick={() => approveClaim(claim.id)}>
                                <i className="bi bi-check"></i> Approve
                              </button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => rejectClaim(claim.id)}>
                                <i className="bi bi-x"></i> Reject
                              </button>
                            </>
                          )}
                        </td>
                        <td>
                          {claim.documents?.length > 0 ? (
                            <ul className="mb-0">
                              {claim.documents.map((doc, idx) => (
                                <li key={idx}>
                                  <a href={`http://localhost:8080${doc}`} target="_blank" rel="noopener noreferrer">
                                    {doc.split("/").pop()}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span>No documents</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
  


  
      
case "viewPolicy":
  return (
    <div>
      <h4 className="mb-4">Available Policies</h4>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Policies List</h5>
          <i className="bi bi-shield-check"></i>
        </div>
        <div className="card-body">
          {policies.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Policy Name</th>
                    <th>Type</th>
                    <th>Provider</th>
                    <th>Coverage Amount</th>
                    <th>Monthly Premium</th>
                    <th>Renewal Date</th>
                    <th>Status</th>
                    <th style={{ minWidth: "250px" }}>Description</th>
                    <th>Documents</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((policy) => (
                    <tr key={policy.id}>
                      <td className="fw-bold">{policy.policyName}</td>
                      <td>{policy.policyType}</td>
                      <td>{policy.providerName}</td>
                      <td>${policy.coverageAmount.toLocaleString()}</td>
                      <td>${policy.monthlyPremium}</td>
                      <td>{new Date(policy.renewalDate).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            policy.policyStatus === "Active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {policy.policyStatus}
                        </span>
                      </td>
                      <td>
                        <div
                          style={{
                            whiteSpace: "pre-line",
                            wordWrap: "break-word",
                            maxHeight: "150px",
                            overflowY: "auto",
                          }}
                        >
                          {policy.policyDescription}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          {policy.contractUrl && (
                            <a
                              href={policy.contractUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              Contract
                            </a>
                          )}
                          {policy.termsUrl && (
                            <a
                              href={policy.termsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              Terms
                            </a>
                          )}
                          {policy.claimFormUrl && (
                            <a
                              href={policy.claimFormUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              Claim Form
                            </a>
                          )}
                          {policy.annexureUrl && (
                            <a
                              href={policy.annexureUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              Annexure
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No policies found.</p>
          )}
        </div>
      </div>
    </div>
  );



case "employees":
  return (
    <div>
      <h4 className="mb-4">Employee Management</h4>

      {/* Search Employees */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Search Employees</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Employee Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={policyFilter}
                onChange={(e) => setPolicyFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR</option>
                <option value="AGENT">Agent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* All Employees */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">All Employees</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td>{employee.employeeId}</td> {/* ✅ Added Employee ID */}
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>
                        <span className="badge bg-info">{employee.role}</span>
                      </td>
                      <td>
                        <span className={`badge ${employee.active ? 'bg-success' : 'bg-secondary'}`}>
                          {employee.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleView(employee)}
                        >
                          <i className="bi bi-eye"></i> View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleEdit(employee)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No employees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

   {/* ✅ Bootstrap Modal for Employee Details */}
{showModal && selectedEmployee && (
  <>
    {/* Backdrop */}
    <div
      className="modal-backdrop fade show"
      onClick={handleCloseModal}
    ></div>

    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Employee Details</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <p><strong>Employee ID:</strong> {selectedEmployee.employeeId}</p> {/* ✅ Added Employee ID */}
            <p><strong>Name:</strong> {selectedEmployee.name}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>Role:</strong> {selectedEmployee.role}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`badge ${selectedEmployee.active ? 'bg-success' : 'bg-secondary'}`}>
                {selectedEmployee.active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}
    </div>
  );



      
      case "fraud":
        return (
          <div>
            <h4 className="mb-4">Fraud Detection Alerts</h4>
            
            <div className="card">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">AI-Detected Fraud Alerts</h5>
                <span className="badge bg-warning">{fraudAlerts.filter(a => a.status !== "Resolved").length} Active Alerts</span>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Priority</th>
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
                            <span className={`badge ${alert.priority === 'High' ? 'bg-danger' : 'bg-warning'}`}>
                              {alert.priority}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${alert.status === 'Pending' ? 'bg-warning' : alert.status === 'Resolved' ? 'bg-success' : 'bg-info'}`}>
                              {alert.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="bi bi-eye"></i> Details
                            </button>
                            {alert.status !== "Resolved" && (
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => resolveFraudAlert(alert.id)}
                              >
                                <i className="bi bi-check"></i> Resolve
                              </button>
                            )}
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
                      <p>Alerts This Month</p>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="border rounded p-3">
                      <h3 className="text-success">$5,200</h3>
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
                      <h3 className="text-info">92%</h3>
                      <p>Detection Accuracy</p>
                    </div>
                  </div>
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
                    <h5>Policy Usage Report</h5>
                    <p>Usage trends across different policy types</p>
                    <button className="btn btn-outline-success">Generate Excel</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="bi bi-currency-dollar fs-1 text-warning mb-3"></i>
                    <h5>Financial Report</h5>
                    <p>Cost analysis and financial summaries</p>
                    <button className="btn btn-outline-warning">Generate Report</button>
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
                        <td>Q3 2023 Policy Usage</td>
                        <td>2023-10-15</td>
                        <td><span className="badge bg-success">Excel</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="bi bi-download"></i> Download
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>Fraud Detection Summary</td>
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
      
      case "notifications":
        return (
          <div>
            <h4 className="mb-4">Notifications & Reminders</h4>
            
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Policy Renewal Reminders</h5>
              </div>
              <div className="card-body">
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>3 policies expiring in next 30 days</strong> - Review and renew to avoid coverage gaps
                </div>
                
                <div className="list-group">
                  <div className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Gold Health Plan</h6>
                      <small className="text-muted">Expires: 2023-11-15</small>
                    </div>
                    <p className="mb-1">Covers 45 employees in Engineering department</p>
                    <small className="text-muted">Last renewed: 2022-11-15</small>
                    <div className="mt-2">
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-arrow-repeat me-1"></i> Renew Now
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-clock me-1"></i> Remind Later
                      </button>
                    </div>
                  </div>
                  <div className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Dental Care Plan</h6>
                      <small className="text-muted">Expires: 2023-11-22</small>
                    </div>
                    <p className="mb-1">Covers 32 employees across all departments</p>
                    <small className="text-muted">Last renewed: 2022-11-22</small>
                    <div className="mt-2">
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-arrow-repeat me-1"></i> Renew Now
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-clock me-1"></i> Remind Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card mt-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Notification Settings</h5>
              </div>
              <div className="card-body">
                <div className="mb-3 form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="policyRenewalNotifications" defaultChecked />
                  <label className="form-check-label" htmlFor="policyRenewalNotifications">Policy Renewal Reminders</label>
                </div>
                <div className="mb-3 form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="fraudAlertNotifications" defaultChecked />
                  <label className="form-check-label" htmlFor="fraudAlertNotifications">Fraud Alert Notifications</label>
                </div>
                <div className="mb-3 form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="claimApprovalNotifications" defaultChecked />
                  <label className="form-check-label" htmlFor="claimApprovalNotifications">Claim Approval Notifications</label>
                </div>
                <div className="mb-3 form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="reportReadyNotifications" defaultChecked />
                  <label className="form-check-label" htmlFor="reportReadyNotifications">Report Ready Notifications</label>
                </div>
                <button className="btn btn-primary">Save Notification Settings</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <h4>Welcome to HR Dashboard</h4>;
    }
  };

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <header className="bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-person-badge fs-2"></i>
          <h2 className="mb-0">InsurAI HR Portal</h2>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span>Welcome, <strong>{localStorage.getItem("hrName") || "HR Admin"}</strong></span>
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
        className={`nav-link ${activeTab === "claims" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("claims"); }}
      >
        <i className="bi bi-file-earmark-check me-2"></i> Claim Approval
      </a>

      {/* Added View Policy */}
      <a
        href="#"
        className={`nav-link ${activeTab === "viewPolicy" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("viewPolicy"); }}
      >
        <i className="bi bi-card-list me-2"></i> View Policy
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "employees" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("employees"); }}
      >
        <i className="bi bi-people me-2"></i> Employee Management
      </a>

      <a
        href="#"
        className={`nav-link ${activeTab === "fraud" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("fraud"); }}
      >
        <i className="bi bi-shield-exclamation me-2"></i> Fraud Alerts
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
        className={`nav-link ${activeTab === "notifications" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("notifications"); }}
      >
        <i className="bi bi-bell me-2"></i> Notifications
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