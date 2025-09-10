import React, { useState, useEffect } from "react";
import api from "../../../api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminPolicy() {
  const [policyData, setPolicyData] = useState({
    policyName: "",
    policyType: "",
    providerName: "",
    coverageAmount: "",
    monthlyPremium: "",
    renewalDate: "",
    policyStatus: "Active",
    policyDescription: "",
  });

  const [policies, setPolicies] = useState([]);
  const [message, setMessage] = useState("");
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [viewPolicy, setViewPolicy] = useState(null); // for modal view

  // -------------------- Handle input changes --------------------
  const handleChange = (e) => {
    setPolicyData({ ...policyData, [e.target.name]: e.target.value });
  };

  // -------------------- Fetch policies --------------------
  const fetchPolicies = async () => {
    try {
      const response = await api.get("/admin/policies", { withCredentials: true });
      setPolicies(response.data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching policies:", error);
      setMessage(
        error.response?.status === 403
          ? "❌ Forbidden: You are not authorized"
          : "❌ Failed to fetch policies."
      );
    }
  };

  // -------------------- Submit new or edited policy --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPolicyId) {
        await api.put(`/admin/policies/${editingPolicyId}`, policyData, { withCredentials: true });
        setMessage("✅ Policy updated successfully!");
      } else {
        await api.post("/admin/policies", policyData, { withCredentials: true });
        setMessage("✅ Policy created successfully!");
      }

      setPolicyData({
        policyName: "",
        policyType: "",
        providerName: "",
        coverageAmount: "",
        monthlyPremium: "",
        renewalDate: "",
        policyStatus: "Active",
        policyDescription: "",
      });
      setEditingPolicyId(null);
      fetchPolicies();
    } catch (error) {
      console.error("Error creating/updating policy:", error);
      setMessage(
        error.response?.status === 403
          ? "❌ Forbidden: You are not authorized"
          : "❌ Failed to submit policy. Try again."
      );
    }
  };

  // -------------------- Edit a policy --------------------
  const handleEdit = (policy) => {
    setPolicyData(policy);
    setEditingPolicyId(policy.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------- Delete a policy --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      await api.delete(`/admin/policies/${id}`, { withCredentials: true });
      setMessage("✅ Policy deleted successfully!");
      fetchPolicies();
    } catch (error) {
      console.error("Error deleting policy:", error);
      setMessage(
        error.response?.status === 403
          ? "❌ Forbidden: You are not authorized"
          : "❌ Failed to delete policy. Try again."
      );
    }
  };

  // -------------------- View policy in modal --------------------
  const handleView = (policy) => {
    setViewPolicy(policy);
  };

  const closeModal = () => {
    setViewPolicy(null);
  };

  // -------------------- Load policies on mount --------------------
  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <div>
      <h4 className="mb-4">{editingPolicyId ? "Edit Policy" : "Create New Policy"}</h4>

      <div className="card mb-4">
        <div className="card-body">
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Policy Name</label>
              <input
                type="text"
                className="form-control"
                name="policyName"
                value={policyData.policyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Policy Type</label>
              <select
                className="form-select"
                name="policyType"
                value={policyData.policyType}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Health">Health</option>
                <option value="Accident">Accident</option>
                <option value="Life">Life</option>
                <option value="Corporate Benefit">Corporate Benefit</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Provider Name</label>
              <input
                type="text"
                className="form-control"
                name="providerName"
                value={policyData.providerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Coverage Amount ($)</label>
              <input
                type="number"
                className="form-control"
                name="coverageAmount"
                value={policyData.coverageAmount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Monthly Premium ($)</label>
              <input
                type="number"
                className="form-control"
                name="monthlyPremium"
                value={policyData.monthlyPremium}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Renewal Date</label>
              <input
                type="date"
                className="form-control"
                name="renewalDate"
                value={policyData.renewalDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Policy Status</label>
              <select
                className="form-select"
                name="policyStatus"
                value={policyData.policyStatus}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Policy Description</label>
              <textarea
                className="form-control"
                rows="3"
                name="policyDescription"
                value={policyData.policyDescription}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary me-2">
              {editingPolicyId ? "Update Policy" : "Create Policy"}
            </button>
            {editingPolicyId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingPolicyId(null);
                  setPolicyData({
                    policyName: "",
                    policyType: "",
                    providerName: "",
                    coverageAmount: "",
                    monthlyPremium: "",
                    renewalDate: "",
                    policyStatus: "Active",
                    policyDescription: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* -------------------- Policies List -------------------- */}
      <div className="mt-4">
        <h5>Created Policies</h5>
        {policies.length === 0 ? (
          <p>No policies available.</p>
        ) : (
          <ul className="list-group">
            {policies.map((policy) => (
              <li key={policy.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{policy.policyName}</strong> - {policy.policyType} ({policy.policyStatus})
                </div>
                <div>
                  <button className="btn btn-sm btn-success me-2" onClick={() => handleView(policy)}>
                    View
                  </button>
                  <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(policy)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(policy.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* -------------------- View Modal -------------------- */}
      {viewPolicy && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{viewPolicy.policyName} Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Type:</strong> {viewPolicy.policyType}</p>
                <p><strong>Provider:</strong> {viewPolicy.providerName}</p>
                <p><strong>Coverage:</strong> ${viewPolicy.coverageAmount}</p>
                <p><strong>Monthly Premium:</strong> ${viewPolicy.monthlyPremium}</p>
                <p><strong>Renewal Date:</strong> {viewPolicy.renewalDate}</p>
                <p><strong>Status:</strong> {viewPolicy.policyStatus}</p>
                <p><strong>Description:</strong> {viewPolicy.policyDescription}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
