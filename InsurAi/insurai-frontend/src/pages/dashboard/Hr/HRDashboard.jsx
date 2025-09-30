import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Dashboard.css";
import jsPDF from "jspdf";
import "jspdf-autotable"; // just import it, no variable needed
import ReportsAnalytics from "./ReportsAnalytics"; // adjust path if needed
import HRClaims from "./HRClaims";
import HRPolicies from "./HRPolicies";
import HREmployees from "./HREmployees"; 

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
      // Enhanced Home Page Content
      const pendingClaimsCount = pendingClaims.filter(c => c.status === "Pending").length;
      const approvedClaimsCount = pendingClaims.filter(c => c.status === "Approved").length;
      const rejectedClaimsCount = pendingClaims.filter(c => c.status === "Rejected").length;
      const totalClaimsAmount = pendingClaims.reduce((sum, claim) => sum + (parseFloat(claim.amount) || 0), 0);
      const pendingClaimsAmount = pendingClaims
        .filter(c => c.status === "Pending")
        .reduce((sum, claim) => sum + (parseFloat(claim.amount) || 0), 0);

      const activePolicies = policies.filter(p => p.policyStatus === "Active").length;
      const expiringPolicies = policies.filter(policy => {
        if (!policy.renewalDate) return false;
        try {
          const renewalDate = new Date(policy.renewalDate);
          const daysUntilRenewal = Math.ceil((renewalDate - new Date()) / (1000 * 60 * 60 * 24));
          return daysUntilRenewal <= 30 && daysUntilRenewal > 0;
        } catch {
          return false;
        }
      }).length;

      const activeEmployees = employees.filter(emp => emp.active).length;
      const inactiveEmployees = employees.length - activeEmployees;
      const recentClaims = pendingClaims.slice(0, 5);

      return (
        <div className="container-fluid">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="fw-bold mb-1">HR Dashboard Overview</h4>
                <p className="text-muted mb-0">Welcome back! Here's your insurance management summary</p>
              </div>
              <div className="text-end">
                <div className="badge bg-light text-dark p-2">
                  <i className="bi bi-calendar me-1"></i>
                  {new Date().toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            {/* Pending Claims */}
            <div className="col-xl-2 col-md-4 col-6 mb-3">
              <div className="card bg-warning bg-opacity-10 border-0 shadow-sm h-100 hover-shadow-lg">
                <div className="card-body text-center">
                  <i className="bi bi-clock-history text-warning fs-4 mb-2"></i>
                  <h3 className="text-warning mb-1">{pendingClaimsCount}</h3>
                  <small className="text-muted">Pending Claims</small>
                  <div className="mt-2">
                    <small className="text-warning">
                      <i className="bi bi-exclamation-triangle"></i> Requires review
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Approved Claims */}
            <div className="col-xl-2 col-md-4 col-6 mb-3">
              <div className="card bg-success bg-opacity-10 border-0 shadow-sm h-100 hover-shadow-lg">
                <div className="card-body text-center">
                  <i className="bi bi-check-circle text-success fs-4 mb-2"></i>
                  <h3 className="text-success mb-1">{approvedClaimsCount}</h3>
                  <small className="text-muted">Approved Claims</small>
                  <div className="mt-2">
                    <small className="text-success">
                      <i className="bi bi-check-lg"></i> Processed
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Employees */}
            <div className="col-xl-2 col-md-4 col-6 mb-3">
              <div className="card bg-primary bg-opacity-10 border-0 shadow-sm h-100 hover-shadow-lg">
                <div className="card-body text-center">
                  <i className="bi bi-people-fill text-primary fs-4 mb-2"></i>
                  <h3 className="text-primary mb-1">{activeEmployees}</h3>
                  <small className="text-muted">Active Employees</small>
                  <div className="mt-2">
                    <small className="text-primary">
                      <i className="bi bi-person-check"></i> With policies
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Policies */}
            <div className="col-xl-2 col-md-4 col-6 mb-3">
              <div className="card bg-info bg-opacity-10 border-0 shadow-sm h-100 hover-shadow-lg">
                <div className="card-body text-center">
                  <i className="bi bi-shield-check text-info fs-4 mb-2"></i>
                  <h3 className="text-info mb-1">{activePolicies}</h3>
                  <small className="text-muted">Active Policies</small>
                  <div className="mt-2">
                    <small className="text-info">
                      <i className="bi bi-file-earmark-text"></i> In force
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Amount */}
            <div className="col-xl-2 col-md-4 col-6 mb-3">
              <div className="card bg-danger bg-opacity-10 border-0 shadow-sm h-100 hover-shadow-lg">
                <div className="card-body text-center">
                  <i className="bi bi-currency-rupee text-danger fs-4 mb-2"></i>
                  <h3 className="text-danger mb-1">₹{(pendingClaimsAmount/1000).toFixed(0)}K</h3>
                  <small className="text-muted">Pending Amount</small>
                  <div className="mt-2">
                    <small className="text-danger">
                      <i className="bi bi-graph-up"></i> Under review
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Expiring Policies */}
            <div className="col-xl-2 col-md-4 col-6 mb-3">
              <div className="card bg-secondary bg-opacity-10 border-0 shadow-sm h-100 hover-shadow-lg">
                <div className="card-body text-center">
                  <i className="bi bi-calendar-x text-secondary fs-4 mb-2"></i>
                  <h3 className="text-secondary mb-1">{expiringPolicies}</h3>
                  <small className="text-muted">Renewing Soon</small>
                  <div className="mt-2">
                    <small className="text-secondary">
                      <i className="bi bi-clock"></i> In 30 days
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light border-0">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-lightning-fill text-warning me-2"></i>
                    Quick Actions
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-xl-2 col-md-4 col-6">
                      <button className="btn btn-primary w-100 h-100 py-3 d-flex flex-column align-items-center hover-scale" onClick={() => setActiveTab("claims")}>
                        <i className="bi bi-list-check fs-3 mb-2"></i>
                        <span>Manage Claims</span>
                        <small className="text-white opacity-75 mt-1">{pendingClaimsCount} pending</small>
                      </button>
                    </div>
                    <div className="col-xl-2 col-md-4 col-6">
                      <button className="btn btn-success w-100 h-100 py-3 d-flex flex-column align-items-center hover-scale" onClick={() => setActiveTab("policies")}>
                        <i className="bi bi-shield-check fs-3 mb-2"></i>
                        <span>View Policies</span>
                        <small className="text-white opacity-75 mt-1">{activePolicies} active</small>
                      </button>
                    </div>
                    <div className="col-xl-2 col-md-4 col-6">
                      <button className="btn btn-info w-100 h-100 py-3 d-flex flex-column align-items-center hover-scale" onClick={() => setActiveTab("reports")}>
                        <i className="bi bi-graph-up fs-3 mb-2"></i>
                        <span>Analytics</span>
                        <small className="text-white opacity-75 mt-1">View reports</small>
                      </button>
                    </div>
                    <div className="col-xl-2 col-md-4 col-6">
                      <button className="btn btn-warning w-100 h-100 py-3 d-flex flex-column align-items-center hover-scale" onClick={downloadCSV}>
                        <i className="bi bi-file-earmark-spreadsheet fs-3 mb-2"></i>
                        <span>Export CSV</span>
                        <small className="text-white opacity-75 mt-1">Claim data</small>
                      </button>
                    </div>
                    <div className="col-xl-2 col-md-4 col-6">
                      <button className="btn btn-danger w-100 h-100 py-3 d-flex flex-column align-items-center hover-scale" onClick={downloadPDF}>
                        <i className="bi bi-file-earmark-pdf fs-3 mb-2"></i>
                        <span>Export PDF</span>
                        <small className="text-white opacity-75 mt-1">Reports</small>
                      </button>
                    </div>
                    <div className="col-xl-2 col-md-4 col-6">
                      <button className="btn btn-secondary w-100 h-100 py-3 d-flex flex-column align-items-center hover-scale" onClick={() => setActiveTab("employees")}>
                        <i className="bi bi-people fs-3 mb-2"></i>
                        <span>Employees</span>
                        <small className="text-white opacity-75 mt-1">{activeEmployees} active</small>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

 {/* Recent Claims */}
<div className="row">
  <div className="col-xl-8 mb-4">
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header bg-gradient-primary text-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="bi bi-clock-history me-2"></i>
          Recent Pending Claims
        </h5>
        <span className="badge bg-light text-dark">{pendingClaimsCount} pending • ₹{pendingClaimsAmount.toLocaleString('en-IN')}</span>
      </div>
      <div className="card-body">
        {mappedClaims.length > 0 ? (
          <>
            {mappedClaims.slice(0, 5).map((claim, index) => (
              <div key={claim.id} className={`d-flex justify-content-between align-items-center p-3 ${index !== mappedClaims.slice(0,5).length - 1 ? 'border-bottom' : ''}`}>
                <div className="d-flex align-items-center flex-grow-1">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="bi bi-person-circle text-warning"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="mb-1">{claim.employeeName || "Unknown Employee"}</h6>
                      <span className={`badge ${claim.status === "Pending" ? "bg-warning" : claim.status === "Approved" ? "bg-success" : "bg-danger"}`}>
                        {claim.status || "Pending"}
                      </span>
                    </div>
                    <small className="text-muted d-block">
                      {claim.title || "Untitled"} • ₹{claim.amount || 0} • {claim.claimDate?.split("T")[0] || "N/A"}
                    </small>
                    <small className="d-block">
                      <strong>Policy:</strong> {claim.policyName || "N/A"} • 
                      <strong> Remarks:</strong> {claim.remarks || "No remarks"}
                    </small>
                  </div>
                </div>
                <div className="text-end ms-3">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => { openViewModal(claim); setActiveTab("claims"); }}>
                    Review
                  </button>
                </div>
              </div>
            ))}
            <div className="text-center mt-3">
              <button className="btn btn-primary" onClick={() => setActiveTab("claims")}>
                <i className="bi bi-arrow-right me-2"></i>View All Claims
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <i className="bi bi-check-circle display-4 text-success"></i>
            <p className="text-muted mt-3">No pending claims! Great work!</p>
          </div>
        )}
      </div>
    </div>
  </div>


            {/* Right Sidebar - Metrics & Alerts */}
            <div className="col-xl-4 mb-4">
              {/* Performance Metrics */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-light border-0">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    Performance Metrics
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Claim Approval Rate</span>
                      <strong className="text-success">{pendingClaims.length > 0 ? Math.round((approvedClaimsCount / pendingClaims.length) * 100) : 0}%</strong>
                    </div>
                    <div className="progress" style={{height: '8px'}}>
                      <div className="progress-bar bg-success" style={{width: `${pendingClaims.length > 0 ? Math.round((approvedClaimsCount / pendingClaims.length) * 100) : 0}%`}}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Average Processing Time</span>
                      <strong className="text-info">2.3 days</strong>
                    </div>
                    <div className="progress" style={{height: '8px'}}>
                      <div className="progress-bar bg-info" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Policy Coverage Rate</span>
                      <strong className="text-warning">{employees.length > 0 ? Math.round((activeEmployees / employees.length) * 100) : 0}%</strong>
                    </div>
                    <div className="progress" style={{height: '8px'}}>
                      <div className="progress-bar bg-warning" style={{width: `${employees.length > 0 ? Math.round((activeEmployees / employees.length) * 100) : 0}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Alerts */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light border-0">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-bell me-2"></i>
                    System Alerts
                  </h5>
                </div>
                <div className="card-body">
                  {expiringPolicies > 0 && (
                    <div className="alert alert-warning d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle me-2 fs-5"></i>
                      <div>
                        <strong>{expiringPolicies} policies</strong> expiring soon
                        <br />
                        <small>Review and renew policies</small>
                      </div>
                    </div>
                  )}

                  {pendingClaimsCount > 10 && (
                    <div className="alert alert-info d-flex align-items-center">
                      <i className="bi bi-info-circle me-2 fs-5"></i>
                      <div>
                        <strong>High claim volume</strong>
                        <br />
                        <small>{pendingClaimsCount} claims awaiting review</small>
                      </div>
                    </div>
                  )}

                  <div className="alert alert-success d-flex align-items-center">
                    <i className="bi bi-check-circle me-2 fs-5"></i>
                    <div>
                      <strong>All systems operational</strong>
                      <br />
                      <small>Last updated: {new Date().toLocaleTimeString('en-IN')}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            .hover-shadow-lg:hover {
              box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
              transform: translateY(-2px);
              transition: all 0.3s ease;
            }
            .hover-scale:hover {
              transform: scale(1.05);
              transition: all 0.3s ease;
            }
          `}</style>
        </div>
      );


case "claims":
  return (
    <HRClaims
      pendingClaims={pendingClaims}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      displayedClaims={displayedClaims}
      mappedClaims={mappedClaims}
      setMappedClaims={setMappedClaims}
      viewingClaim={viewingClaim}
      openViewModal={openViewModal}
      closeViewModal={closeViewModal}
      approveClaim={approveClaim}
      rejectClaim={rejectClaim}
      downloadCSV={downloadCSV}
      downloadPDF={downloadPDF}
    />
  );
  

case "policies":
  return <HRPolicies policies={policies} />;


case "employees":
  return (
    <HREmployees
      employees={employees}
      searchName={searchName}
      setSearchName={setSearchName}
      policyFilter={policyFilter}
      setPolicyFilter={setPolicyFilter}
      filteredEmployees={filteredEmployees}
      handleView={handleView}
      handleEdit={handleEdit}
      showModal={showModal}
      selectedEmployee={selectedEmployee}
      handleCloseModal={handleCloseModal}
    />
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
        className={`nav-link ${activeTab === "policies" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("policies"); }}
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