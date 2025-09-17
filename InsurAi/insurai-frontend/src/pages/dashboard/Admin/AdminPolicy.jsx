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
  const [viewPolicy, setViewPolicy] = useState(null);

  // -------------------- Documents --------------------
  const [documents, setDocuments] = useState({
    contract: null,
    terms: null,
    claimForm: null,
    annexure: null,
  });

  const handleDocumentChange = (e) => {
    const { name, files } = e.target;
    setDocuments({ ...documents, [name]: files[0] });
  };

  // -------------------- Input Changes --------------------
  const handleChange = (e) => {
    setPolicyData({ ...policyData, [e.target.name]: e.target.value });
  };

  // -------------------- Convert raw S3 URL to public Supabase URL --------------------
  const formatPublicUrl = (url) => {
    if (!url) return null;
    // Check if URL already contains "/object/public/"
    if (url.includes("/object/public/")) return url;

    // Example: convert raw S3 path to Supabase public URL
    // Raw: https://<project>.storage.supabase.co/storage/v1/s3/<bucket>/<path>
    // Public: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/").filter(Boolean); // remove empty
      const bucketIndex = pathParts.indexOf("s3") + 1;
      const bucket = pathParts[bucketIndex];
      const filePath = pathParts.slice(bucketIndex + 1).join("/");
      const projectDomain = urlObj.hostname.replace(".storage.", ".");
      return `https://${projectDomain}/storage/v1/object/public/${bucket}/${filePath}`;
    } catch {
      return url; // fallback
    }
  };

  // -------------------- Fetch Policies --------------------
  const fetchPolicies = async () => {
    try {
      const response = await api.get("/admin/policies", { withCredentials: true });

      // Convert any raw S3 URL to public Supabase URL
      const formattedPolicies = response.data.map((p) => ({
        ...p,
        contractUrl: formatPublicUrl(p.contractUrl),
        termsUrl: formatPublicUrl(p.termsUrl),
        claimFormUrl: formatPublicUrl(p.claimFormUrl),
        annexureUrl: formatPublicUrl(p.annexureUrl),
      }));

      setPolicies(formattedPolicies);
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

  // -------------------- Submit Policy --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append(
        "policy",
        new Blob([JSON.stringify(policyData)], { type: "application/json" })
      );

      Object.keys(documents).forEach((docKey) => {
        if (documents[docKey]) formData.append(docKey, documents[docKey]);
      });

      await api.post("/admin/policies", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer dummy-token", // remove or replace in production
        },
      });

      setMessage("✅ Policy saved successfully!");
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
      setDocuments({ contract: null, terms: null, claimForm: null, annexure: null });
      setEditingPolicyId(null);
      fetchPolicies();
    } catch (error) {
      console.error("Error saving policy:", error);
      setMessage("❌ Failed to submit policy. Try again.");
    }
  };

  // -------------------- Edit Policy --------------------
  const handleEdit = (policy) => {
    setPolicyData(policy);
    setEditingPolicyId(policy.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------- Delete Policy --------------------
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

  // -------------------- View Policy Modal --------------------
  const handleView = (policy) => setViewPolicy(policy);
  const closeModal = () => setViewPolicy(null);

  // -------------------- Load Policies on Mount --------------------
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
            {/* Policy Fields */}
            <div className="mb-3">
              <label className="form-label">Policy Name</label>
              <input type="text" className="form-control" name="policyName" value={policyData.policyName} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Policy Type</label>
              <select className="form-select" name="policyType" value={policyData.policyType} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="Health">Health</option>
                <option value="Accident">Accident</option>
                <option value="Life">Life</option>
                <option value="Corporate Benefit">Corporate Benefit</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Provider Name</label>
              <input type="text" className="form-control" name="providerName" value={policyData.providerName} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Coverage Amount ($)</label>
              <input type="number" className="form-control" name="coverageAmount" value={policyData.coverageAmount} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Monthly Premium ($)</label>
              <input type="number" className="form-control" name="monthlyPremium" value={policyData.monthlyPremium} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Renewal Date</label>
              <input type="date" className="form-control" name="renewalDate" value={policyData.renewalDate} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Policy Status</label>
              <select className="form-select" name="policyStatus" value={policyData.policyStatus} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Policy Description</label>
              <textarea className="form-control" rows="3" name="policyDescription" value={policyData.policyDescription} onChange={handleChange} />
            </div>

            {/* Document Uploads */}
            {["contract", "terms", "claimForm", "annexure"].map((doc) => (
              <div key={doc} className="mb-3">
                <label className="form-label">{doc.charAt(0).toUpperCase() + doc.slice(1)}</label>
                <input type="file" className="form-control" name={doc} onChange={handleDocumentChange} accept=".pdf,.doc,.docx" />
              </div>
            ))}

            <button type="submit" className="btn btn-primary me-2">{editingPolicyId ? "Update Policy" : "Create Policy"}</button>
            {editingPolicyId && (
              <button type="button" className="btn btn-secondary" onClick={() => {
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
                setDocuments({ contract: null, terms: null, claimForm: null, annexure: null });
              }}>Cancel</button>
            )}
          </form>
        </div>
      </div>

      {/* Policies List */}
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
                  <button className="btn btn-sm btn-success me-2" onClick={() => handleView(policy)}>View</button>
                  <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(policy)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(policy.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* View Modal */}
      {viewPolicy && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={closeModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{viewPolicy.policyName} Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body overflow-auto" style={{ maxHeight: "70vh" }}>
                <p><strong>Type:</strong> {viewPolicy.policyType}</p>
                <p><strong>Provider:</strong> {viewPolicy.providerName}</p>
                <p><strong>Coverage:</strong> ${viewPolicy.coverageAmount}</p>
                <p><strong>Monthly Premium:</strong> ${viewPolicy.monthlyPremium}</p>
                <p><strong>Renewal Date:</strong> {viewPolicy.renewalDate}</p>
                <p><strong>Status:</strong> {viewPolicy.policyStatus}</p>
                <p><strong>Description:</strong> {viewPolicy.policyDescription}</p>

                {/* Document Links */}
                {["contractUrl", "termsUrl", "claimFormUrl", "annexureUrl"].map((urlKey) =>
                  viewPolicy[urlKey] ? (
                    <p key={urlKey}>
                      <a href={viewPolicy[urlKey]} target="_blank" rel="noopener noreferrer">
                        View {urlKey.replace("Url", "")}
                      </a>
                    </p>
                  ) : null
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
