import React, { useState, useEffect } from "react";

export default function EmployeeClaims({
  activeTab,
  setActiveTab,
  showNotificationAlert,
  policies = []
}) {
  const [newClaim, setNewClaim] = useState({
    type: "",
    amount: "",
    date: "",
    description: "",
    documents: [],
    existingDocuments: [], // for edit mode
  });
  const [claims, setClaims] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState(
    policies.length > 0 ? String(policies[0].id) : ""
  );

  const [viewingClaim, setViewingClaim] = useState(null);

  useEffect(() => {
    if (policies.length > 0 && !selectedPolicyId) {
      setSelectedPolicyId(String(policies[0].id));
    }
  }, [policies, selectedPolicyId]);

  // ------------------ Fetch employee claims ------------------
  const fetchClaims = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.warn("Missing token, cannot fetch claims");

    try {
      const res = await fetch("http://localhost:8080/employee/claims", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch claims");
      const data = await res.json();
      setClaims(data);
    } catch (error) {
      console.error(error);
      showNotificationAlert("Error fetching claims");
    }
  };

  useEffect(() => {
    if (activeTab === "claims") fetchClaims();
  }, [activeTab]);

  // ------------------ Handle document upload ------------------
  const handleDocumentUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setNewClaim(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(files)],
      }));
    }
  };

  // ------------------ Handle claim submission ------------------
const handleClaimSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) return showNotificationAlert("Cannot submit claim: missing token.");

  if (!newClaim.type || !newClaim.amount || !newClaim.date || !newClaim.description || !selectedPolicyId) {
    return showNotificationAlert("Please fill all required fields.");
  }

  try {
    const formData = new FormData();
    formData.append("policyId", selectedPolicyId);
    formData.append("title", newClaim.type);
    formData.append("description", newClaim.description);
    formData.append("amount", parseFloat(newClaim.amount));
    formData.append("date", newClaim.date);

    // Append new uploaded files
    newClaim.documents.forEach(file => formData.append("documents", file));

    let url = "http://localhost:8080/employee/claims";
    // If editing, send to update endpoint
    if (newClaim.id) {
      url = "http://localhost:8080/employee/claims/update";
      formData.append("claimId", newClaim.id);
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to submit claim");
    }

    const data = await res.json();

    // Update state: replace edited claim or add new claim
    setClaims(prev => {
      if (newClaim.id) {
        return prev.map(c => (c.id === data.id ? data : c));
      } else {
        return [data, ...prev];
      }
    });

    showNotificationAlert(newClaim.id ? "Claim updated successfully!" : "Claim submitted successfully!");

    // Reset form
    setNewClaim({ type: "", amount: "", date: "", description: "", documents: [], existingDocuments: [] });
    if (policies.length > 0) setSelectedPolicyId(String(policies[0].id));
    setActiveTab("claims");

  } catch (error) {
    console.error(error);
    showNotificationAlert(error.message || "Error submitting claim");
  }
};


  // ------------------ Open/Close View Modal ------------------
  const openViewModal = (claim) => setViewingClaim(claim);
  const closeViewModal = () => setViewingClaim(null);

 // ------------------ Render claims table ------------------
const renderClaimsList = () => (
  <div className="p-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4>My Insurance Claims</h4>
      <button className="btn btn-primary" onClick={() => setActiveTab("newClaim")}>
        <i className="bi bi-plus-circle me-1"></i> Submit New Claim
      </button>
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
              {claims.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <i className="bi bi-wallet2 display-4 text-muted"></i>
                    <p className="text-muted mt-2">No claims submitted yet</p>
                    <button className="btn btn-primary btn-sm" onClick={() => setActiveTab("newClaim")}>
                      Submit Your First Claim
                    </button>
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id}>
                    <td><strong>#{claim.id}</strong></td>
                    <td>{claim.title}</td>
                    <td>{claim.description}</td>
                    <td><strong>{claim.amount}</strong></td>
                    <td>{claim.createdAt?.split("T")[0]}</td>
                    <td>
                      <span className={`badge ${
                        claim.status === 'Approved' ? 'bg-success' :
                        claim.status === 'Pending' ? 'bg-warning' :
                        'bg-danger'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openViewModal(claim)}>View</button>
                      {claim.status === 'Pending' && (
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => {
                            // Prepare form for editing
                            setNewClaim({
                              id: claim.id, // <-- essential for update
                              type: claim.title,
                              amount: claim.amount,
                              date: claim.claimDate?.split("T")[0] || "",
                              description: claim.description,
                              documents: [], // new uploads
                              existingDocuments: claim.documents || [], // already uploaded
                            });
                            setSelectedPolicyId(String(claim.policyId));
                            setActiveTab("newClaim");
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* ------------------ View Claim Modal ------------------ */}
    {viewingClaim && (
      <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Claim Details #{viewingClaim.id}</h5>
              <button type="button" className="btn-close" onClick={closeViewModal}></button>
            </div>
            <div className="modal-body">
              <p><strong>Type:</strong> {viewingClaim.title}</p>
              <p><strong>Description:</strong> {viewingClaim.description}</p>
              <p><strong>Amount:</strong> ${viewingClaim.amount}</p>
              <p><strong>Submitted On:</strong> {viewingClaim.createdAt?.split("T")[0]}</p>
              <p><strong>Status:</strong> {viewingClaim.status}</p>
              <p><strong>Remarks:</strong> {viewingClaim.remarks || "None"}</p>

              <div>
                <strong>Documents:</strong>
                {viewingClaim.documents && viewingClaim.documents.length > 0 ? (
                  <ul>
                    {viewingClaim.documents.map((doc, index) => (
                      <li key={index}>
                        <a href={`http://localhost:8080${doc}`} target="_blank" rel="noopener noreferrer">
                          {doc.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : <p>No documents uploaded</p>}
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



// ------------------ Render new claim form ------------------
const renderNewClaimForm = () => {

  const handleRemoveExistingDocument = (index) => {
    setNewClaim(prev => {
      const updatedExisting = [...prev.existingDocuments];
      updatedExisting.splice(index, 1);
      return { ...prev, existingDocuments: updatedExisting };
    });
  };

  const handleRemoveNewDocument = (index) => {
    setNewClaim(prev => {
      const updatedNew = [...prev.documents];
      updatedNew.splice(index, 1);
      return { ...prev, documents: updatedNew };
    });
  };

  // Determine if we are editing an existing claim
  const isEditMode = !!newClaim.id;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{isEditMode ? "Edit Claim" : "Submit New Claim"}</h4>
        <button className="btn btn-secondary" onClick={() => setActiveTab("claims")}>
          <i className="bi bi-arrow-left me-1"></i> Back to Claims
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleClaimSubmit}>
            {/* Policy Select */}
            <div className="mb-3">
              <label htmlFor="policySelect" className="form-label">Select Policy *</label>
              <select
                className="form-select"
                value={selectedPolicyId}
                onChange={(e) => setSelectedPolicyId(e.target.value)}
                required
              >
                <option value="">Select a policy</option>
                {policies.map((policy) => (
                  <option key={policy.id} value={String(policy.id)}>
                    {policy.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Claim Type */}
            <div className="mb-3">
              <label htmlFor="claimType" className="form-label">Claim Type *</label>
              <select
                className="form-select"
                id="claimType"
                value={newClaim.type}
                onChange={(e) => setNewClaim((prev) => ({ ...prev, type: e.target.value }))}
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

{/* Claim Amount */}
<div className="mb-3">
      <label htmlFor="claimAmount" className="form-label">Claim Amount *</label>
      <div className="input-group">
            <span className="input-group-text">₹</span>
            <input
                  type="number"
                  className="form-control"
                  id="claimAmount"
                  value={newClaim.amount || ""}
                  onChange={(e) => setNewClaim((prev) => ({
                        ...prev,
                        amount: e.target.value ? parseInt(e.target.value) : ""
                  }))}
                  min="0"
                  step="1"
                  required
            />
      </div>
</div>


            {/* Incident/Service Date */}
            <div className="mb-3">
              <label htmlFor="claimDate" className="form-label">Incident/Service Date *</label>
              <input
                type="date"
                className="form-control"
                id="claimDate"
                value={newClaim.date}
                onChange={(e) => setNewClaim((prev) => ({ ...prev, date: e.target.value }))}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label htmlFor="claimDescription" className="form-label">Description *</label>
              <textarea
                className="form-control"
                id="claimDescription"
                rows="4"
                value={newClaim.description}
                onChange={(e) => setNewClaim((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed description..."
                required
              />
            </div>

            {/* Existing Documents */}
            {newClaim.existingDocuments?.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Existing Documents</label>
                <ul className="list-group mb-2">
                  {newClaim.existingDocuments.map((doc, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <a href={`http://localhost:8080${doc}`} target="_blank" rel="noopener noreferrer">
                        {doc.split("/").pop()}
                      </a>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveExistingDocument(index)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* New Documents */}
            {newClaim.documents?.length > 0 && (
              <div className="mb-3">
                <label className="form-label">New Documents</label>
                <ul className="list-group mb-2">
                  {newClaim.documents.map((file, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {file.name}
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveNewDocument(index)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Upload new documents */}
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
            </div>

            {/* Form Actions */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="submit" className="btn btn-success me-md-2">
                {isEditMode ? "Update Claim" : "Submit Claim"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab("claims")}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

  return activeTab === "newClaim" ? renderNewClaimForm() : renderClaimsList();
}