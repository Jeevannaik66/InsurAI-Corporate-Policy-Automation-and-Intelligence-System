import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Dashboard.css";
import jsPDF from "jspdf";
import "jspdf-autotable"; // just import it, no variable needed
import ReportsAnalytics from "./ReportsAnalytics"; // adjust path if needed


export default function HRDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  // Claims from backend
  const [pendingClaims, setPendingClaims] = useState([]);
  const [mappedClaims, setMappedClaims] = useState([]); // For employee names + assigned HR + policy

  // State to handle viewing claim
  const [viewingClaim, setViewingClaim] = useState(null);
  const openViewModal = (claim) => setViewingClaim(claim);
  const closeViewModal = () => setViewingClaim(null);

  // Employees from backend (for reference/filter)
  const [employees, setEmployees] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [policyFilter, setPolicyFilter] = useState("");

  // HR list for mapping assigned HR
  const [hrs, setHrs] = useState([]);

  // Fraud alerts (optional)
  const [fraudAlerts, setFraudAlerts] = useState([]);

  // Modal state (for employee details/documents)
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Policies
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Remarks input for claims
  const [remarksInput, setRemarksInput] = useState("");

  const loggedInHrId = parseInt(localStorage.getItem("id")); // Get HR ID from localStorage

  // ---------------- Status Filter ----------------
  const [statusFilter, setStatusFilter] = useState("All");


  // ---------------- Fetch employees ----------------
  useEffect(() => {
    fetch("http://localhost:8080/auth/employees")
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("Error fetching employees:", err));
  }, []);

  // ---------------- Fetch HR list ----------------
  useEffect(() => {
    fetch("http://localhost:8080/hr")
      .then(res => res.json())
      .then(data => setHrs(data))
      .catch(err => console.error("Error fetching HR list:", err));
  }, []);

  // ---------------- Fetch policies ----------------
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
        console.error("Error fetching policies:", err);
      }
    };
    fetchPolicies();
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

  // ---------------- Fetch claims assigned to logged-in HR ----------------
  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/hr/login");
        return;
      }

      const res = await fetch(`http://localhost:8080/hr/claims?hrId=${loggedInHrId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setPendingClaims(data);
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
  }, [loggedInHrId]);

  // ---------------- Map employee names, assigned HR, and policy ----------------
  useEffect(() => {
    if (pendingClaims.length > 0 && employees.length > 0 && hrs.length > 0 && policies.length > 0) {
      const updatedClaims = pendingClaims.map(claim => {
        const employee = employees.find(emp => emp.id === claim.employeeId || claim.employee_id);
        const hr = hrs.find(hr => hr.id === claim.assignedHrId || claim.assigned_hr_id);
        const policy = policies.find(p => p.id === claim.policyId || claim.policy_id);

        return {
          ...claim,
          employeeName: employee?.name || "Unknown",
          employeeIdDisplay: employee?.employeeId || "N/A",
          documents: claim.documents || [],
          assignedHrName: hr?.name || "Not Assigned",
          policyName: policy?.policyName || "N/A",
          canModify: claim.assignedHrId === loggedInHrId || claim.assigned_hr_id === loggedInHrId,
          remarks: claim.remarks || "" // Include remarks
        };
      });
      setMappedClaims(updatedClaims);
    }
  }, [pendingClaims, employees, hrs, policies, loggedInHrId]);

  // ---------------- Approve a claim ----------------
  const approveClaim = async (id, remarks) => {
    const claim = mappedClaims.find(c => c.id === id);
    if (!claim.canModify) {
      alert("You are not assigned to this claim");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/hr/claims/approve/${id}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ remarks })
      });
      if (res.ok) {
        const updatedClaim = await res.json();
        const hr = hrs.find(hr => hr.id === updatedClaim.assignedHrId);
        const policy = policies.find(p => p.id === updatedClaim.policyId);
        setMappedClaims(prev =>
          prev.map(c => (c.id === id ? {
            ...updatedClaim,
            employeeName: employees.find(emp => emp.id === updatedClaim.employeeId)?.name || "Unknown",
            employeeIdDisplay: employees.find(emp => emp.id === updatedClaim.employeeId)?.employeeId || "N/A",
            documents: updatedClaim.documents || [],
            assignedHrName: hr?.name || "Not Assigned",
            policyName: policy?.policyName || "N/A",
            canModify: updatedClaim.assignedHrId === loggedInHrId,
            remarks: updatedClaim.remarks || ""
          } : c))
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
  const rejectClaim = async (id, remarks) => {
    const claim = mappedClaims.find(c => c.id === id);
    if (!claim.canModify) {
      alert("You are not assigned to this claim");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/hr/claims/reject/${id}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ remarks })
      });
      if (res.ok) {
        const updatedClaim = await res.json();
        const hr = hrs.find(hr => hr.id === updatedClaim.assignedHrId);
        const policy = policies.find(p => p.id === updatedClaim.policyId);
        setMappedClaims(prev =>
          prev.map(c => (c.id === id ? {
            ...updatedClaim,
            employeeName: employees.find(emp => emp.id === updatedClaim.employeeId)?.name || "Unknown",
            employeeIdDisplay: employees.find(emp => emp.id === updatedClaim.employeeId)?.employeeId || "N/A",
            documents: updatedClaim.documents || [],
            assignedHrName: hr?.name || "Not Assigned",
            policyName: policy?.policyName || "N/A",
            canModify: updatedClaim.assignedHrId === loggedInHrId,
            remarks: updatedClaim.remarks || ""
          } : c))
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
  };

   // ---------------- Filtered Claims for Table ----------------
  const displayedClaims = mappedClaims.filter(claim =>
    statusFilter === "All" ? true : claim.status === statusFilter
  );


 // ---------------- Download CSV ----------------
const downloadCSV = () => {
  if (!displayedClaims.length) return alert("No claims to download");

  const headers = [
    "Employee Name",
    "Employee ID",
    "Claim Type",
    "Amount",
    "Date",
    "Status",
    "Policy Name",
    "Remarks",
    "Documents"
  ];

  const rows = displayedClaims.map(c => [
    c.employeeName,
    c.employeeIdDisplay,
    c.title,
    c.amount,
    c.claimDate?.split("T")[0],
    c.status,
    c.policyName,
    c.remarks || "",
    c.documents?.length > 0 ? c.documents.map(d => `http://localhost:8080${d}`).join(" | ") : "No documents"
  ]);

  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "claims.csv";
  a.click();
  URL.revokeObjectURL(url);
};


// ---------------- Download PDF ----------------
const downloadPDF = () => {
  if (!displayedClaims.length) return alert("No claims to download");

  const doc = new jsPDF();

  // Prepare rows
  const rows = displayedClaims.map(c => [
    c.employeeName,
    c.employeeIdDisplay,
    c.title,
    c.amount,
    c.claimDate?.split("T")[0],
    c.status,
    c.policyName,
    c.remarks || "-",
    // Same as CSV: full URLs concatenated with " | "
    c.documents?.length > 0
  ? c.documents
      .map(d => `http://localhost:8080/uploads/${encodeURIComponent(d.split('/').pop())}`)
      .join(" | ")
  : "No documents"

  ]);

  doc.autoTable({
    head: [[
      "Employee Name", "Employee ID", "Type", "Amount", "Date",
      "Status", "Policy", "Remarks", "Documents"
    ]],
    body: rows,
    startY: 20,
    theme: "striped",
    headStyles: { fillColor: [33, 150, 243], textColor: 255 },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'center',
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 20 },
      2: { cellWidth: 15 },
      3: { cellWidth: 15 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 30 },
      7: { cellWidth: 20 },
      8: { cellWidth: 25 }
    },
    margin: { left: 10, right: 5 }
  });

  doc.save("claims.pdf");
};



 

// Render content based on active tab
const renderContent = () => {
  switch (activeTab) {
    case "home":
      return (
        <div className="text-center">
          <h4 className="mb-4 fw-bold">HR Dashboard Overview</h4>

          {/* Dashboard Stats */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-primary text-white shadow-sm">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <h5 className="card-title">Pending Claims</h5>
                  <h2 className="fw-bold">
                    {pendingClaims.filter(c => c.status === "Pending").length}
                  </h2>
                  <p className="mb-0">
                    <i className="bi bi-clock-history"></i> Require review
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-success text-white shadow-sm">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <h5 className="card-title">Active Employees</h5>
                  <h2 className="fw-bold">{employees.length}</h2>
                  <p className="mb-0">
                    <i className="bi bi-people-fill"></i> With active policies
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-warning text-white shadow-sm">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <h5 className="card-title">Fraud Alerts</h5>
                  <h2 className="fw-bold">
                    {fraudAlerts.filter(a => a.status !== "Resolved").length}
                  </h2>
                  <p className="mb-0">
                    <i className="bi bi-exclamation-triangle"></i> Need attention
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-info text-white shadow-sm">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <h5 className="card-title">Policies Expiring</h5>
                  <h2 className="fw-bold">3</h2>
                  <p className="mb-0">
                    <i className="bi bi-calendar-x"></i> In next 30 days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Claims Preview */}
          <div className="row justify-content-center">
            <div className="col-md-8 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white text-center">
                  <h5 className="mb-0">Pending Claims Preview</h5>
                </div>
                <div className="card-body">
                  {pendingClaims.slice(0, 3).map(claim => (
                    <div
                      key={claim.id}
                      className="d-flex justify-content-between align-items-center border-bottom py-2 text-start"
                    >
                      <div>
                        <h6 className="mb-0">{claim.employeeName}</h6>
                        <small className="text-muted">
                          {claim.title} • ${claim.amount} • {claim.claimDate?.split("T")[0]} • {claim.policyName}
                        </small>
                        <p className="mb-0"><strong>Remarks:</strong> {claim.remarks || "-"}</p>
                      </div>
                      <span
                        className={`badge ${
                          claim.status === "Pending"
                            ? "bg-warning"
                            : claim.status === "Approved"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                  ))}
                  <button
                    className="btn btn-outline-primary mt-3 btn-sm"
                    onClick={() => setActiveTab("claims")}
                  >
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
    <div className="text-center">
      <h4 className="mb-4 fw-bold">Claim Approval Management</h4>

      {/* ---------------- Filter Tabs ---------------- */}
      <div className="mb-3 d-flex justify-content-center gap-2">
        {["All", "Pending", "Approved", "Rejected"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setStatusFilter(status)}
          >
            {status}{" "}
            {status === "Pending" && (
              <span className="badge bg-light text-dark ms-1">
                {pendingClaims.filter(c => c.status === "Pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ---------------- Download Buttons ---------------- */}
      <div className="mb-3 d-flex justify-content-center gap-2">
        <button className="btn btn-sm btn-success" onClick={downloadCSV}>
          <i className="bi bi-file-earmark-spreadsheet"></i> Download CSV
        </button>
        <button className="btn btn-sm btn-danger" onClick={downloadPDF}>
          <i className="bi bi-file-earmark-pdf"></i> Download PDF
        </button>
      </div>

      {/* ---------------- All Claims Table ---------------- */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">All Claims</h5>
          <span className="badge bg-light text-dark">
            {pendingClaims.filter(c => c.status === "Pending").length} Pending
          </span>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Claim Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Policy Name</th>
                  <th style={{ width: "140px" }}>Documents</th>
                  <th>Remarks</th>
                  <th style={{ width: "220px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedClaims.map(claim => (
                  <tr key={claim.id}>
                    <td>{claim.employeeName}</td>
                    <td>{claim.employeeIdDisplay}</td>
                    <td>{claim.title}</td>
                    <td className="fw-bold">${claim.amount}</td>
                    <td>{claim.claimDate?.split("T")[0]}</td>
                    <td>
                      <span className={`badge ${
                        claim.status === "Pending"
                          ? "bg-warning"
                          : claim.status === "Approved"
                          ? "bg-success"
                          : "bg-danger"
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>{claim.policyName}</td>

                    {/* Documents */}
                    <td>
                      {claim.documents?.length > 0 ? (
                        <div className="d-flex flex-column gap-1">
                          {claim.documents.map((doc, idx) => (
                            <a
                              key={idx}
                              href={`http://localhost:8080${doc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-secondary text-truncate"
                              style={{ maxWidth: "120px" }}
                              title={doc.split("/").pop()}
                            >
                              <i className="bi bi-file-earmark-text me-1"></i>
                              Doc {idx + 1}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">No docs</span>
                      )}
                    </td>

                    {/* Remarks */}
                    <td>
                      {claim.status === "Pending" && claim.canModify ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Add remarks"
                          value={claim.remarks || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setMappedClaims(prev =>
                              prev.map(c =>
                                c.id === claim.id ? { ...c, remarks: value } : c
                              )
                            );
                          }}
                        />
                      ) : (
                        claim.remarks || "-"
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => openViewModal(claim)}
                      >
                        <i className="bi bi-eye"></i> View
                      </button>
                      {claim.status === "Pending" && claim.canModify && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-success me-1"
                            onClick={() => {
                              const latestRemarks = mappedClaims.find(c => c.id === claim.id)?.remarks || "";
                              approveClaim(claim.id, latestRemarks);
                            }}
                          >
                            <i className="bi bi-check"></i> Approve
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              const latestRemarks = mappedClaims.find(c => c.id === claim.id)?.remarks || "";
                              rejectClaim(claim.id, latestRemarks);
                            }}
                          >
                            <i className="bi bi-x"></i> Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ------------------ View Claim Modal ------------------ */}
      {viewingClaim && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Claim Details #{viewingClaim.id}</h5>
                <button type="button" className="btn-close" onClick={closeViewModal}></button>
              </div>
              <div className="modal-body text-start">
                <p><strong>Employee Name:</strong> {viewingClaim.employeeName}</p>
                <p><strong>Employee ID:</strong> {viewingClaim.employeeIdDisplay}</p>
                <p><strong>Claim Type:</strong> {viewingClaim.title}</p>
                <p><strong>Description:</strong> {viewingClaim.description}</p>
                <p><strong>Amount:</strong> ${viewingClaim.amount}</p>
                <p><strong>Date Submitted:</strong> {viewingClaim.claimDate?.split("T")[0]}</p>
                <p><strong>Status:</strong> {viewingClaim.status}</p>
                <p><strong>Policy Name:</strong> {viewingClaim.policyName}</p>
                <p><strong>Remarks:</strong> {viewingClaim.remarks || "-"}</p>

                {/* Documents */}
                <div>
                  <strong>Documents:</strong>
                  {viewingClaim.documents?.length > 0 ? (
                    <ul>
                      {viewingClaim.documents.map((doc, idx) => (
                        <li key={idx}>
                          <a
                            href={`http://localhost:8080${doc}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {doc.split("/").pop()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No documents uploaded</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeViewModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
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
    <ReportsAnalytics 
      mappedClaims={mappedClaims} 
      policies={policies} 
    />
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