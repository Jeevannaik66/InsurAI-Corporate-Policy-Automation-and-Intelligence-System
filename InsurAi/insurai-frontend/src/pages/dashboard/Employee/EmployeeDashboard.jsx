import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";

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

 const renderHome = () => {
  const activeClaims = claims.filter(claim => claim.status === "In Review").length;
  const approvedClaims = claims.filter(claim => claim.status === "Approved").length;
  const pendingQueries = queries.filter(query => !query.response || query.response.trim() === "").length;

  return (
    <div className="p-4">
      <h4 className="mb-4">Employee Dashboard Overview</h4>

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">My Policies</h5>
              <h2 className="card-text">{policies.length}</h2>
              <p><i className="bi bi-file-earmark-text"></i> Active Policies</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">My Claims</h5>
              <h2 className="card-text">{claims.length}</h2>
              <p><i className="bi bi-wallet2"></i> {approvedClaims} Approved</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Pending Queries</h5>
              <h2 className="card-text">{pendingQueries}</h2>
              <p><i className="bi bi-question-circle"></i> Waiting for response</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Agent Availability</h5>
              <h2 className="card-text">Online</h2>
              <p><i className="bi bi-person-check"></i> Support available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Recent Claims Activity</h5>
            </div>
            <div className="card-body">
              <div className="list-group">
                {claims.slice(0, 5).map(claim => (
                  <div key={claim.id} className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{claim.type} Claim #{claim.id}</h6>
                      <small>{claim.submittedDate}</small>
                    </div>
                    <p className="mb-1">{claim.details}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">{claim.amount}</span>
                      <span className={`badge ${claim.status === 'Approved' ? 'bg-success' : claim.status === 'In Review' ? 'bg-warning' : 'bg-danger'}`}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                ))}
                {claims.length === 0 && (
                  <div className="text-center py-3">
                    <p className="text-muted">No claims submitted yet</p>
                    <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('newClaim')}>
                      Submit Your First Claim
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Recent Queries</h5>
            </div>
            <div className="card-body">
              <div className="list-group">
                {queries.slice(0, 5).map(query => {
                  const isAnswered = query.response && query.response.trim() !== "";
                  return (
                    <div key={query.id} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{query.queryText}</h6>
                        <span className={`badge ${isAnswered ? 'bg-success' : 'bg-warning'}`}>
                          {isAnswered ? 'answered' : 'pending'}
                        </span>
                      </div>
                      <p className="mb-1 text-truncate">{query.response || "Waiting for agent response..."}</p>
                      <small className="text-muted">
                        Created: {query.createdAt ? new Date(query.createdAt).toLocaleString() : "-"}
                      </small>
                    </div>
                  );
                })}
                {queries.length === 0 && (
                  <div className="text-center py-3">
                    <p className="text-muted">No queries submitted yet</p>
                    <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('askQuery')}>
                      Ask a Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="card-title mb-0">Quick Actions</h5>
        </div>
        <div className="card-body">
          <div className="d-grid gap-2 d-md-flex">
            <button className="btn btn-primary me-md-2" onClick={() => setActiveTab('newClaim')}>
              <i className="bi bi-plus-circle me-2"></i> Submit New Claim
            </button>
            <button className="btn btn-outline-primary me-md-2" onClick={() => setActiveTab('askQuery')}>
              <i className="bi bi-question-circle me-2"></i> Ask a Question
            </button>
            <button className="btn btn-outline-secondary me-md-2" onClick={() => setActiveTab('policies')}>
              <i className="bi bi-file-text me-2"></i> View Policies
            </button>
            <button className="btn btn-outline-info" onClick={() => setActiveTab('support')}>
              <i className="bi bi-headset me-2"></i> Get Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const renderPolicies = () => {
  return (
    <div className="container-fluid my-4">
      {/* Section Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h4 className="fw-bold mb-2 mb-md-0">Your Insurance Policies</h4>
        <div className="d-flex flex-column flex-md-row gap-3 text-muted">
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
            className={`flex-grow-1`}
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
            <div className="card h-100 shadow-sm border rounded-3">
              {/* Header */}
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{policy.name}</h5>
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
                      className="bg-light border rounded px-3 py-2 text-dark"
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                        fontSize: "1rem",
                      }}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-primary flex-fill"
                    onClick={() => viewPolicyDetails(policy)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-sm btn-primary flex-fill"
                    onClick={() => downloadPolicy(policy)} // only details
                  >
                    Download Policy
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
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{selectedPolicy.name}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setSelectedPolicy(null)}
          ></button>
        </div>
        <div className="modal-body">
          <p><strong>Provider:</strong> {selectedPolicy.provider}</p>
          <p><strong>Coverage:</strong> {selectedPolicy.coverage}</p>
          <p><strong>Premium:</strong> ${selectedPolicy.monthlyPremium}/month</p>
          <p><strong>Renewal Date:</strong> {selectedPolicy.renewalDate}</p>
          <p><strong>Status:</strong> {selectedPolicy.status}</p>

          <h6 className="mt-3">Covered Benefits:</h6>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {selectedPolicy.benefits.join("\n")}
          </p>

          <h6 className="mt-3">Documents:</h6>
          <div className="d-flex flex-wrap gap-2">
            {selectedPolicy.contractUrl && (
              <a
                href={selectedPolicy.contractUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Download Contract
              </a>
            )}
            {selectedPolicy.termsUrl && (
              <a
                href={selectedPolicy.termsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Download Terms
              </a>
            )}
            {selectedPolicy.claimFormUrl && (
              <a
                href={selectedPolicy.claimFormUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Download Claim Form
              </a>
            )}
            {selectedPolicy.annexureUrl && (
              <a
                href={selectedPolicy.annexureUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Download Annexure
              </a>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedPolicy(null)}
          >
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => downloadPolicy(selectedPolicy)} // only details
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


  const renderClaims = () => {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>My Insurance Claims</h4>
          <button className="btn btn-primary" onClick={() => setActiveTab('newClaim')}>
            <i className="bi bi-plus-circle me-1"></i> Submit New Claim
          </button>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-4 text-center">
            <div className="card">
              <div className="card-body">
                <h2 className="text-success">{claims.filter(c => c.status === 'Approved').length}</h2>
                <p className="card-text">Approved</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="card">
              <div className="card-body">
                <h2 className="text-warning">{claims.filter(c => c.status === 'In Review').length}</h2>
                <p className="card-text">In Review</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="card">
              <div className="card-body">
                <h2 className="text-danger">{claims.filter(c => c.status === 'Rejected').length}</h2>
                <p className="card-text">Rejected</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map(claim => (
                    <tr key={claim.id}>
                      <td><strong>#{claim.id}</strong></td>
                      <td>{claim.type}</td>
                      <td>{claim.details}</td>
                      <td><strong>{claim.amount}</strong></td>
                      <td>{claim.submittedDate}</td>
                      <td>
                        <span className={`badge ${claim.status === 'Approved' ? 'bg-success' : claim.status === 'In Review' ? 'bg-warning' : 'bg-danger'}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">View</button>
                        {claim.status === 'In Review' && (
                          <button className="btn btn-sm btn-outline-secondary">Edit</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {claims.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <i className="bi bi-wallet2 display-4 text-muted"></i>
                        <p className="text-muted mt-2">No claims submitted yet</p>
                        <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('newClaim')}>
                          Submit Your First Claim
                        </button>
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
  };

  const renderNewClaim = () => {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Submit New Claim</h4>
          <button className="btn btn-secondary" onClick={() => setActiveTab('claims')}>
            <i className="bi bi-arrow-left me-1"></i> Back to Claims
          </button>
        </div>
        
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleClaimSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="claimType" className="form-label">Claim Type *</label>
                  <select 
                    className="form-select" 
                    id="claimType"
                    value={newClaim.type}
                    onChange={(e) => setNewClaim({...newClaim, type: e.target.value})}
                    required
                  >
                    <option value="">Select Claim Type</option>
                    <option value="Health">Health Insurance</option>
                    <option value="Dental">Dental Insurance</option>
                    <option value="Vision">Vision Insurance</option>
                    <option value="Accident">Accident Insurance</option>
                    <option value="Life">Life Insurance</option>
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="claimAmount" className="form-label">Claim Amount *</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="claimAmount"
                      value={newClaim.amount}
                      onChange={(e) => setNewClaim({...newClaim, amount: e.target.value})}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="claimDate" className="form-label">Incident/Service Date *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  id="claimDate"
                  value={newClaim.date}
                  onChange={(e) => setNewClaim({...newClaim, date: e.target.value})}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="claimDescription" className="form-label">Description *</label>
                <textarea 
                  className="form-control" 
                  id="claimDescription" 
                  rows="4"
                  value={newClaim.description}
                  onChange={(e) => setNewClaim({...newClaim, description: e.target.value})}
                  placeholder="Please provide detailed description of the incident/service..."
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="claimDocuments" className="form-label">Supporting Documents</label>
                <input 
                  type="file" 
                  className="form-control" 
                  id="claimDocuments" 
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleDocumentUpload}
                />
                <div className="form-text">
                  Upload receipts, medical reports, or other supporting documents. Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB each)
                </div>
                
                {newClaim.documents.length > 0 && (
                  <div className="mt-3">
                    <h6>Uploaded Files:</h6>
                    <ul className="list-group">
                      {newClaim.documents.map((file, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          <span><i className="bi bi-file-earmark me-2"></i> {file.name}</span>
                          <span className="badge bg-secondary rounded-pill">
                            {Math.round(file.size / 1024)} KB
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="submit" className="btn btn-success me-md-2">
                  <i className="bi bi-check-circle me-1"></i> Submit Claim
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('claims')}>
                  <i className="bi bi-x-circle me-1"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

const renderAskQuery = () => {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Ask a Question</h4>
        <button className="btn btn-secondary" onClick={() => setActiveTab("myQueries")}>
          <i className="bi bi-arrow-left me-1"></i> View My Queries
        </button>
      </div>

      <div className="row">
        {/* Form */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Submit a New Query</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleQuerySubmit}>
                {/* Query Text */}
                <div className="mb-3">
                  <label htmlFor="queryText" className="form-label">
                    Your Question *
                  </label>
                  <textarea
                    className="form-control"
                    id="queryText"
                    rows="5"
                    value={newQuery.queryText}
                    onChange={(e) => handleQueryInputChange("queryText", e.target.value)}
                    placeholder="Please provide detailed information about your question or issue..."
                    required
                  ></textarea>
                </div>

                {/* Assign Agent */}
                <div className="mb-3">
                  <label htmlFor="assignedAgent" className="form-label">
                    Assign to Agent *
                  </label>
                  <select
                    className="form-select"
                    id="assignedAgent"
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    required
                  >
                    <option value="">Select Agent</option>
                    {agentsAvailability.length > 0 ? (
                      agentsAvailability.map((a) => (
                        <option
                          key={a.id}
                          value={a.agent.id}
                          disabled={!a.available} // ✅ use outer "available"
                        >
                          {a.agent.name} ({a.available ? "Online" : "Offline"})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No agents available
                      </option>
                    )}
                  </select>
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <i className="bi bi-send me-1"></i> Submit Question
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Agent Availability Cards */}
        <div className="col-md-4">
          {agentsAvailability.map((agentAvailability) => (
            <div className="card shadow-sm mb-3" key={agentAvailability.id}>
              <div
                className={`card-header text-white ${
                  agentAvailability.available ? "bg-success" : "bg-secondary"
                }`}
              >
                <h5 className="card-title mb-0">Agent Availability</h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div
                    className={`rounded-circle me-2 ${
                      agentAvailability.available ? "bg-success" : "bg-secondary"
                    }`}
                    style={{ width: "12px", height: "12px" }}
                  ></div>
                  <span className="fw-bold">
                    {agentAvailability.agent.name}{" "}
                    {agentAvailability.available ? "is Online Now" : "is Currently Unavailable"}
                  </span>
                </div>

                {/* Availability Period */}
                {agentAvailability.startTime && agentAvailability.endTime && (
                  <div className="mb-2">
                    <h6>Availability Period:</h6>
                    <p className="card-text mb-0">
                      From: {new Date(agentAvailability.startTime).toLocaleString()} <br />
                      To: {new Date(agentAvailability.endTime).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Agent Email */}
                {agentAvailability.agent.email && (
                  <div className="mb-2">
                    <h6>Agent Email:</h6>
                    <p className="card-text">{agentAvailability.agent.email}</p>
                  </div>
                )}

                {/* Offline Warning */}
                {!agentAvailability.available && (
                  <div className="alert alert-warning p-2 mt-2" role="alert">
                    This agent is currently unavailable. Employees cannot contact them at this moment.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



const renderMyQueries = () => {
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>My Queries</h4>
        <button className="btn btn-primary" onClick={() => setActiveTab("askQuery")}>
          <i className="bi bi-plus-circle me-1"></i> Ask New Question
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Query</th>
                  <th>Response</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => {
                  const isAnswered = query.response && query.response.trim() !== "";
                  return (
                    <tr key={query.id}>
                      <td><strong>#{query.id}</strong></td>
                      <td>{query.queryText}</td>
                      <td>{query.response || <span className="text-muted">No response yet</span>}</td>
                      <td>{query.createdAt ? new Date(query.createdAt).toLocaleString() : "-"}</td>
                      <td>
                        <span className={`badge ${isAnswered ? "bg-success" : "bg-warning"}`}>
                          {isAnswered ? "answered" : query.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setActiveTab("queryDetails")}
                        >
                          <i className="bi bi-eye me-1"></i> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {queries.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <i className="bi bi-question-circle display-4 text-muted"></i>
                      <p className="text-muted mt-2">No queries submitted yet</p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveTab("askQuery")}
                      >
                        Ask Your First Question
                      </button>
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
};

const renderQueryDetails = () => {
  // For demo purposes, showing the first query
  const query = queries[0] || {};

  const isAnswered = query.response && query.response.trim() !== "";

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Query Details</h4>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveTab("myQueries")}
        >
          <i className="bi bi-arrow-left me-1"></i> Back to My Queries
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Query #{query.id}</h5>
          <span className={`badge ${isAnswered ? "bg-success" : "bg-warning"}`}>
            {isAnswered ? "answered" : query.status}
          </span>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong>Query:</strong>
            <p className="mt-2">{query.queryText}</p>
          </div>

          <div className="mb-3">
            <strong>Response:</strong>
            <p className="mt-2">
              {query.response || (
                <span className="text-muted">No response from agent yet</span>
              )}
            </p>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Created:</strong>{" "}
              {query.createdAt ? new Date(query.createdAt).toLocaleString() : "-"}
            </div>
            <div className="col-md-6">
              <strong>Last Updated:</strong>{" "}
              {query.updatedAt ? new Date(query.updatedAt).toLocaleString() : "-"}
            </div>
          </div>

          {query.agent && (
            <div className="mb-3">
              <strong>Assigned Agent:</strong>{" "}
              {query.agent.name} ({query.agent.email})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


  const renderSupport = () => {
    return (
      <div className="p-4">
        <h4 className="mb-4">Get Support</h4>
        
        <div className="row mb-4">
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-people display-4 text-primary mb-3"></i>
                <h5>Contact Insurance Agent</h5>
                <p>Get personalized assistance with your claims and policies from our expert agents.</p>
                <div className="mt-3">
                  <p><strong>Available:</strong> Mon-Fri, 9 AM - 6 PM</p>
                  <p><strong>Response Time:</strong> Within 2 hours</p>
                </div>
                <button className="btn btn-primary mt-3">
                  <i className="bi bi-telephone me-1"></i> Request Callback
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-question-circle display-4 text-primary mb-3"></i>
                <h5>FAQs & Resources</h5>
                <p>Find answers to common questions about your insurance benefits and claim processes.</p>
                <div className="mt-3">
                  <div className="d-grid gap-2">
                    <a href="#" className="btn btn-outline-primary text-start">
                      <i className="bi bi-file-text me-1"></i> How to submit a claim?
                    </a>
                    <a href="#" className="btn btn-outline-primary text-start">
                      <i className="bi bi-clock me-1"></i> Claim processing time
                    </a>
                    <a href="#" className="btn btn-outline-primary text-start">
                      <i className="bi bi-file-earmark me-1"></i> Required documents
                    </a>
                  </div>
                </div>
                <button className="btn btn-primary mt-3">
                  <i className="bi bi-search me-1"></i> View All FAQs
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-chat-dots display-4 text-success mb-3"></i>
                <h5>Live Chat Support</h5>
                <p>Chat with our support team for immediate assistance with your queries.</p>
                <div className="mt-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="bg-success rounded-circle me-2" style={{width: '10px', height: '10px'}}></div>
                    <span>Support team is online</span>
                  </div>
                </div>
                <button className="btn btn-success mt-3">
                  <i className="bi bi-chat me-1"></i> Start Live Chat
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-envelope display-4 text-primary mb-3"></i>
                <h5>Email Support</h5>
                <p>Send us detailed queries via email and get comprehensive responses.</p>
                <div className="mt-3">
                  <p><strong>Email:</strong> support@insurai.com</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                </div>
                <button className="btn btn-primary mt-3">
                  <i className="bi bi-send me-1"></i> Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-warning">
          <div className="card-body">
            <div className="d-flex">
              <div className="me-3">
                <i className="bi bi-exclamation-triangle display-4"></i>
              </div>
              <div>
                <h5>Emergency Assistance</h5>
                <p>For urgent medical emergencies requiring immediate claim processing:</p>
                <div className="mt-2">
                  <h3>1-800-INSURAI (1-800-467-8724)</h3>
                  <p className="mb-0">Available 24/7 for emergency claims</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      <div className="dashboard-main d-flex">
        {/* Sidebar */}
        <aside className="dashboard-sidebar bg-light" style={{width: '250px', minHeight: 'calc(100vh - 76px)'}}>
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
              className={`nav-link ${activeTab === "policies" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("policies"); }}
            >
              <i className="bi bi-file-text me-2"></i> My Policies
            </a>

            <a
              href="#"
              className={`nav-link ${activeTab === "claims" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("claims"); }}
            >
              <i className="bi bi-wallet2 me-2"></i> My Claims
            </a>

            <a
              href="#"
              className={`nav-link ${activeTab === "newClaim" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("newClaim"); }}
            >
              <i className="bi bi-plus-circle me-2"></i> Submit Claim
            </a>

            <a
              href="#"
              className={`nav-link ${activeTab === "askQuery" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("askQuery"); }}
            >
              <i className="bi bi-question-circle me-2"></i> Ask a Question
            </a>

            <a
              href="#"
              className={`nav-link ${activeTab === "myQueries" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("myQueries"); }}
            >
              <i className="bi bi-chat-left-text me-2"></i> My Queries
            </a>

            <a
              href="#"
              className={`nav-link ${activeTab === "support" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("support"); }}
            >
              <i className="bi bi-headset me-2"></i> Support
            </a>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="dashboard-content flex-grow-1 p-0">
          <div className="dashboard-content-wrapper p-4">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'policies' && renderPolicies()}
            {activeTab === 'claims' && renderClaims()}
            {activeTab === 'newClaim' && renderNewClaim()}
            {activeTab === 'askQuery' && renderAskQuery()}
            {activeTab === 'myQueries' && renderMyQueries()}
            {activeTab === 'queryDetails' && renderQueryDetails()}
            {activeTab === 'support' && renderSupport()}
          </div>
        </main>
      </div>
    </div>
  );
}