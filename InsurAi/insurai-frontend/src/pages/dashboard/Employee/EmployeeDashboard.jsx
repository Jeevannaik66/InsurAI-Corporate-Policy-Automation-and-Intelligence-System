import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmployeeClaims from './EmployeeClaims'; // adjust the path based on your folder structure
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";
import EmployeeSupport from './EmployeeSupport'; // adjust path if needed
import EmployeeHome from "./EmployeeHome";
import EmployeeQueries from "./EmployeeQueries"; // adjust path if needed


export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [queries, setQueries] = useState([]);
  const [agentsAvailability, setAgentsAvailability] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [loading, setLoading] = useState(false);
const [employeeId, setEmployeeId] = useState(null);

  const [newClaim, setNewClaim] = useState({
    type: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    documents: []
  });

  const [newQuery, setNewQuery] = useState({ queryText: "" });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Modal state
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // ------------------ Token check and fetch data ------------------
  useEffect(() => {
    const token = localStorage.getItem("token"); 
    const storedName = localStorage.getItem("name");

    if (!token || token.trim() === "") {
      console.log("Missing token, redirecting to login");
      navigate("/employee/login");
      return;
    }

    setEmployeeName(storedName || "Employee");
    fetchEmployeeData(token);
    fetchAgents(token);
    fetchEmployeeQueries(token);

    const interval = setInterval(() => fetchEmployeeQueries(token), 15000);
    return () => clearInterval(interval);
  }, [navigate]);

  // ------------------ Convert raw S3 URL to public Supabase URL ------------------
  const formatPublicUrl = (url) => {
    if (!url) return null;
    if (url.includes("/object/public/")) return url;

    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      const bucketIndex = pathParts.indexOf("s3") + 1;
      const bucket = pathParts[bucketIndex];
      const filePath = pathParts.slice(bucketIndex + 1).join("/");
      const projectDomain = urlObj.hostname.replace(".storage.", ".");
      return `https://${projectDomain}/storage/v1/object/public/${bucket}/${filePath}`;
    } catch {
      return url;
    }
  };

 // ------------------ Fetch logged-in employee ------------------
const fetchLoggedInEmployee = async (token) => {
  try {
    const response = await axios.get("http://localhost:8080/auth/employees", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const storedEmail = localStorage.getItem("email"); // must save email at login
    const employee = response.data.find(emp => emp.email === storedEmail);

    if (!employee) {
      console.error("Employee not found");
      navigate("/employee/login");
      return;
    }

    // ✅ Store the corporate employee ID for claims
    setEmployeeId(employee.employeeId);       
    setEmployeeName(employee.name || "Employee");

    // Optional: store in localStorage for global access
    localStorage.setItem("employeeId", employee.employeeId);
    localStorage.setItem("name", employee.name || "Employee");

    console.log("Logged-in employee:", {
      employeeId: employee.employeeId,
      name: employee.name
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    navigate("/employee/login");
  }
};


  // ------------------ Fetch employee policies ------------------
  const fetchEmployeeData = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/employee/policies", {
        headers: { Authorization: `Bearer ${token}` }
      });
 
      const formattedPolicies = response.data.map((policy) => ({
        id: policy.id,
        name: policy.policyName,
        provider: policy.providerName,
        coverage: `$${policy.coverageAmount.toLocaleString()}`,
        monthlyPremium: policy.monthlyPremium || 0,
        renewalDate: policy.renewalDate,
        status: policy.policyStatus,
        benefits: policy.policyDescription ? [policy.policyDescription] : [],
        contractUrl: formatPublicUrl(policy.contractUrl),
        termsUrl: formatPublicUrl(policy.termsUrl),
        claimFormUrl: formatPublicUrl(policy.claimFormUrl),
        annexureUrl: formatPublicUrl(policy.annexureUrl),
      }));

      setPolicies(formattedPolicies);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      if (error.response?.status === 403) navigate("/employee/login");
    }
  };

  // ------------------ Fetch agents ------------------
  const fetchAgents = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/agent/availability/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAgentsAvailability(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  // ------------------ Fetch employee queries ------------------
  const fetchEmployeeQueries = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/employee/queries", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching employee queries:", error);
      if (error.response?.status === 403) navigate("/employee/login");
    }
  };
  

  // ------------------ Logout ------------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/employee/login");
  };

  // ------------------ Claim Submit ------------------
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    const newClaimData = {
      id: Math.floor(Math.random() * 10000),
      type: newClaim.type,
      amount: `$${newClaim.amount}`,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "In Review",
      processedDate: null,
      details: newClaim.description
    };

    setClaims([...claims, newClaimData]);
    showNotificationAlert("Claim submitted successfully! It will be processed shortly.");
    setNewClaim({ type: "", amount: "", description: "", date: new Date().toISOString().split("T")[0], documents: [] });
    setActiveTab("claims");
  };

  // ------------------ Query Submit ------------------
  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token || token.trim() === "") {
      navigate("/employee/login");
      return;
    }

    if (!selectedAgentId) {
      showNotificationAlert("Please select an agent to assign the query.");
      return;
    }

    const selectedAgent = agentsAvailability.find(a => a.agent.id.toString() === selectedAgentId.toString());
    if (!selectedAgent || !selectedAgent.available) {
      showNotificationAlert("Selected agent is not available. Please choose another agent.");
      return;
    }

    if (!newQuery.queryText || newQuery.queryText.trim() === "") {
      showNotificationAlert("Query text cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8080/employee/queries?agentId=${selectedAgentId}&queryText=${encodeURIComponent(newQuery.queryText)}`,
        null,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const savedQuery = response.data;
      setQueries([savedQuery, ...queries]); 
      showNotificationAlert("Query submitted successfully! An agent will respond shortly.");

      setNewQuery({ queryText: "" });
      setSelectedAgentId("");
      setActiveTab("myQueries");
    } catch (error) {
      console.error("Error submitting query:", error);
      const msg = error.response?.data || "Failed to submit query. Check console for details.";
      showNotificationAlert(msg);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Notification ------------------
  const showNotificationAlert = (msg) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleDocumentUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setNewClaim({
        ...newClaim,
        documents: [...newClaim.documents, ...Array.from(files)]
      });
    }
  };
const handleQueryInputChange = (field, value) => {
  setNewQuery({ ...newQuery, [field]: value });
};

  // ------------------ PDF download function ------------------
const downloadPolicy = (policy) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(policy.name, 20, 20);

  doc.setFontSize(12);
  doc.text(`Provider: ${policy.provider}`, 20, 35);
  doc.text(`Coverage: ${policy.coverage}`, 20, 45);
  doc.text(`Premium: $${policy.monthlyPremium}/month`, 20, 55);
  doc.text(`Renewal Date: ${policy.renewalDate}`, 20, 65);
  doc.text(`Status: ${policy.status}`, 20, 75);

  // Benefits
  doc.setFontSize(14);
  doc.text("Covered Benefits:", 20, 90);
  doc.setFontSize(12);
  policy.benefits.forEach((benefit, index) => {
    doc.text(`- ${benefit}`, 25, 100 + index * 10);
  });

  // ✅ Removed URLs section — only details are saved in PDF

  doc.save(`${policy.name}.pdf`);
};


  // ------------------ Policy modal ------------------
  const viewPolicyDetails = (policy) => {
    setSelectedPolicy(policy);
  };
   

  // Fetch all agent availabilities from backend
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get("http://localhost:8080/agent/availability/all");
        setAgentsAvailability(response.data);
      } catch (error) {
        console.error("Error fetching agent availability:", error);
      }
    };

    fetchAvailability();
  }, []);

 

const renderPolicies = () => {
  return (
    <div className="container-fluid my-4">
      {/* Section Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h4 className="fw-bold mb-2 mb-md-0">Your Insurance Policies</h4>
        <div className="d-flex flex-column flex-md-row gap-3 text-muted small">
          <span>
            <strong>{policies.length}</strong> Active Policies
          </span>
          <span>
            <strong>
              $
              {policies.reduce(
                (total, policy) => total + (policy.monthlyPremium || 0),
                0
              )}
            </strong>{" "}
            Total Monthly Premium
          </span>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="d-flex flex-wrap gap-4">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="flex-grow-1"
            style={{
              flexBasis:
                policies.length === 1
                  ? "100%"
                  : policies.length === 2
                  ? "48%"
                  : "30%",
              minWidth: "250px",
            }}
          >
            <div className="card h-100 shadow-lg border rounded-3 hover-shadow transition">
              {/* Header */}
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-truncate">{policy.name}</h5>
                <span
                  className={`badge px-3 py-2 ${
                    policy.status === "Active"
                      ? "bg-success"
                      : policy.status === "Expired"
                      ? "bg-danger"
                      : "bg-secondary"
                  }`}
                >
                  {policy.status}
                </span>
              </div>

              {/* Details */}
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Provider:</span>
                  <span>{policy.provider}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Coverage:</span>
                  <span>{policy.coverage}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Premium:</span>
                  <span>${policy.monthlyPremium}/month</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-semibold">Renewal:</span>
                  <span>{policy.renewalDate}</span>
                </div>

                {/* Benefits */}
                <h6 className="fw-semibold mb-2">Covered Benefits:</h6>
                <div className="d-flex flex-column gap-2 mb-3">
                  {policy.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="bg-light border rounded px-3 py-2 text-dark small"
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                      }}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-primary flex-fill shadow-sm hover-scale"
                    onClick={() => viewPolicyDetails(policy)}
                  >
                    <i className="bi bi-eye me-1"></i> View Details
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary flex-fill shadow-sm hover-scale"
                    onClick={() => downloadPolicy(policy)}
                  >
                    <i className="bi bi-download me-1"></i> Download Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Modal */}
      {selectedPolicy && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content shadow-lg rounded-4">
              <div className="modal-header border-0 bg-light">
                <h5 className="modal-title">{selectedPolicy.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedPolicy(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Provider:</strong> {selectedPolicy.provider}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Coverage:</strong> {selectedPolicy.coverage}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Premium:</strong> ${selectedPolicy.monthlyPremium}/month</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Renewal Date:</strong> {selectedPolicy.renewalDate}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Status:</strong> {selectedPolicy.status}</p>
                  </div>
                </div>

                <h6 className="mt-3 fw-semibold">Covered Benefits:</h6>
                <ul className="list-group list-group-flush mb-3">
                  {selectedPolicy.benefits.map((benefit, idx) => (
                    <li key={idx} className="list-group-item small">{benefit}</li>
                  ))}
                </ul>

                <h6 className="mt-3 fw-semibold">Documents:</h6>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {selectedPolicy.contractUrl && (
                    <a
                      href={selectedPolicy.contractUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm shadow-sm hover-scale"
                    >
                      Contract
                    </a>
                  )}
                  {selectedPolicy.termsUrl && (
                    <a
                      href={selectedPolicy.termsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm shadow-sm hover-scale"
                    >
                      Terms
                    </a>
                  )}
                  {selectedPolicy.claimFormUrl && (
                    <a
                      href={selectedPolicy.claimFormUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm shadow-sm hover-scale"
                    >
                      Claim Form
                    </a>
                  )}
                  {selectedPolicy.annexureUrl && (
                    <a
                      href={selectedPolicy.annexureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm shadow-sm hover-scale"
                    >
                      Annexure
                    </a>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedPolicy(null)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => downloadPolicy(selectedPolicy)}
                >
                  Download Policy Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



 
  


  return (
    <div>
      {/* Notification Alert */}
      {showNotification && (
        <div className="alert alert-success alert-dismissible fade show m-3 position-fixed top-0 end-0" style={{zIndex: 1050}} role="alert">
          <strong>{notificationMessage}</strong>
          <button type="button" className="btn-close" onClick={() => setShowNotification(false)}></button>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-person-circle fs-2"></i>
          <h2 className="mb-0">InsurAI Employee Portal</h2>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span>Welcome, <strong>{employeeName}</strong></span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </header>

{/* Main Layout */}
<div className="dashboard-main">
  {/* Sidebar */}
  <aside className="dashboard-sidebar">
    <nav className="nav flex-column p-3">  {/* added padding */}
      <a
        href="#"
        className={`nav-link mb-2 ${activeTab === "home" ? "active" : ""}`} // mb-2 = space between items
        onClick={(e) => { e.preventDefault(); setActiveTab("home"); }}
      >
        <i className="bi bi-speedometer2 me-2"></i> Dashboard
      </a>

      <a
        href="#"
        className={`nav-link mb-2 ${activeTab === "policies" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("policies"); }}
      >
        <i className="bi bi-file-text me-2"></i> My Policies
      </a>

      <a
        href="#"
        className={`nav-link mb-2 ${activeTab === "claims" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("claims"); }}
      >
        <i className="bi bi-wallet2 me-2"></i> My Claims
      </a>

      <a
        href="#"
        className={`nav-link mb-2 ${activeTab === "newClaim" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("newClaim"); }}
      >
        <i className="bi bi-plus-circle me-2"></i> Submit Claim
      </a>

      <a
        href="#"
        className={`nav-link mb-2 ${activeTab === "askQuery" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("askQuery"); }}
      >
        <i className="bi bi-question-circle me-2"></i> Ask a Question
      </a>

      <a
        href="#"
        className={`nav-link mb-2 ${activeTab === "myQueries" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("myQueries"); }}
      >
        <i className="bi bi-chat-left-text me-2"></i> My Queries
      </a>

      <a
        href="#"
        className={`nav-link mb-2 ${activeTab === "support" ? "active" : ""}`}
        onClick={(e) => { e.preventDefault(); setActiveTab("support"); }}
      >
        <i className="bi bi-headset me-2"></i> Support
      </a>
    </nav>
  </aside>

  {/* Content Area */}
<main className="dashboard-content">
  <div className="dashboard-content-wrapper p-4">
    {activeTab === "home" && (
      <EmployeeHome 
        queries={queries} 
        policies={policies} 
        setActiveTab={setActiveTab} 
      />
    )}

    {activeTab === "policies" && renderPolicies()}

    {(activeTab === "claims" || activeTab === "newClaim") && (
      <EmployeeClaims
        policies={policies}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        claims={claims}
        newClaim={newClaim}
        setNewClaim={setNewClaim}
        handleClaimSubmit={handleClaimSubmit}
        handleDocumentUpload={handleDocumentUpload}
        showNotificationAlert={(msg) => alert(msg)}
        employeeId={employeeId}   // ✅ pass the actual employee ID
        token={localStorage.getItem("token")}
      />
    )}

   {/* ✅ Queries Section */}
{(activeTab === "askQuery" || activeTab === "myQueries" || activeTab === "queryDetails") && (
  <EmployeeQueries
    activeTab={activeTab}              // 👈 pass this too
    queries={queries}
    setActiveTab={setActiveTab}
    agentsAvailability={agentsAvailability}
    selectedAgentId={selectedAgentId}
    setSelectedAgentId={setSelectedAgentId}
    handleQuerySubmit={handleQuerySubmit}
    handleQueryInputChange={handleQueryInputChange}
    newQuery={newQuery}
    loading={loading}
  />
)}


    {activeTab === "support" && (
      <EmployeeSupport
        agentsAvailability={agentsAvailability}
        selectedAgentId={selectedAgentId}
        setSelectedAgentId={setSelectedAgentId}
        showNotificationAlert={showNotificationAlert}
      />
    )}
  </div>
</main>
</div>

    </div>
  );
}