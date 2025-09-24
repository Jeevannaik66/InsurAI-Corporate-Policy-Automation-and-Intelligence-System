import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Dashboard.css";
import axios from "axios";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("home");
  const [availability, setAvailability] = useState(false);
  const [employeeQueries, setEmployeeQueries] = useState([]);
  const [assistedClaims, setAssistedClaims] = useState([
    { id: 1, employee: "David Brown", type: "Health", amount: "$250", date: "2023-10-15", status: "Approved" },
    { id: 2, employee: "Emily Davis", type: "Dental", amount: "$180", date: "2023-10-14", status: "Processing" },
    { id: 3, employee: "Robert Wilson", type: "Vision", amount: "$120", date: "2023-10-13", status: "Approved" }
  ]);

  const [futureFrom, setFutureFrom] = useState("");
  const [futureTo, setFutureTo] = useState("");
  const [agentId, setAgentId] = useState(null);
  const [agentName, setAgentName] = useState("");

  // -------------------- Get agent info, availability, and queries --------------------
  useEffect(() => {
    const storedAgentId = localStorage.getItem("agentId");
    const storedAgentName = localStorage.getItem("agentName");
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found, please login again");
      navigate("/agent/login");
      return;
    }

    if (storedAgentId && storedAgentName) {
      const id = parseInt(storedAgentId);
      setAgentId(id);
      setAgentName(storedAgentName);

      const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch availability
      axios.get(`http://localhost:8080/agent/${id}/availability`, axiosConfig)
        .then(res => {
          if (res.data && typeof res.data.available === "boolean") {
            setAvailability(res.data.available);
          }
        })
        .catch(err => console.error("Failed to fetch availability", err));

      // -------------------- Fetch all employees once --------------------
      let employeeMap = {};
      axios.get("http://localhost:8080/auth/employees", axiosConfig)
        .then(empRes => {
          empRes.data.forEach(emp => {
            employeeMap[emp.id] = emp.name;
          });

          // -------------------- Fetch pending queries --------------------
          axios.get(`http://localhost:8080/agent/queries/pending/${id}`, axiosConfig)
            .then(res => {
              if (res.data) {
                const pendingWithNames = res.data.map(q => ({
                  id: q.id,
                  employeeId: q.employeeId,
                  query: q.queryText,
                  createdAt: q.createdAt,
                  status: "Pending",
                  response: q.response || "",
                  agentId: q.agentId,
                  employee: q.employee ? q.employee.name : employeeMap[q.employeeId] || `Employee ${q.employeeId}`,
                  allowEdit: true  // ready for edit if needed in the future
                }));
                setEmployeeQueries(prev => [...prev.filter(q => q.status !== "Pending"), ...pendingWithNames]);
              }
            })
            .catch(err => console.error("Failed to fetch pending queries", err));

          // -------------------- Fetch resolved queries --------------------
          axios.get(`http://localhost:8080/agent/queries/all/${id}`, axiosConfig)
            .then(res => {
              if (res.data) {
                const resolvedWithNames = res.data
                  .filter(q => q.status === "resolved")
                  .map(q => ({
                    id: q.id,
                    employeeId: q.employeeId,
                    query: q.queryText,
                    createdAt: q.createdAt,
                    updatedAt: q.updatedAt,
                    status: "Resolved",
                    response: q.response || "",
                    agentId: q.agentId,
                    employee: employeeMap[q.employeeId] || `Employee ${q.employeeId}`,
                    allowEdit: false  // default: cannot edit after resolved
                  }));
                setEmployeeQueries(prev => [
                  ...prev.filter(q => q.status !== "Resolved"),
                  ...resolvedWithNames
                ]);
              }
            })
            .catch(err => console.error("Failed to fetch resolved queries", err));

        })
        .catch(err => console.error("Failed to fetch employees", err));

    } else {
      navigate("/agent/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/agent/login");
  };

  // -------------------- Toggle availability --------------------
  const toggleAvailability = async () => {
    try {
      const newStatus = !availability;
      const token = localStorage.getItem("token");
      if (!token) return alert("No token found, please login again");

      const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post("http://localhost:8080/agent/availability", {
        agentId,
        available: newStatus,
        startTime: new Date().toISOString(),
        endTime: null
      }, axiosConfig);

      const res = await axios.get(`http://localhost:8080/agent/${agentId}/availability`, axiosConfig);
      if (res.data) setAvailability(res.data.available);

      alert(`You are now ${newStatus ? "available" : "unavailable"} for queries`);
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability");
    }
  };

  // -------------------- Schedule future availability --------------------
  const scheduleFutureAvailability = async () => {
    if (!futureFrom || !futureTo) {
      alert("Please select both start and end time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("No token found, please login again");

      const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

      const startISO = new Date(futureFrom).toISOString();
      const endISO = new Date(futureTo).toISOString();

      await axios.post("http://localhost:8080/agent/availability", {
        agentId,
        available: true,
        startTime: startISO,
        endTime: endISO
      }, axiosConfig);

      const res = await axios.get(`http://localhost:8080/agent/${agentId}/availability`, axiosConfig);
      if (res.data) setAvailability(res.data.available);

      alert("Future availability scheduled successfully!");
      setFutureFrom("");
      setFutureTo("");
    } catch (error) {
      console.error("Error scheduling availability:", error);
      alert("Failed to schedule availability.");
    }
  };

  // -------------------- Respond to a query --------------------
const respondToQuery = async (id, responseText, isUpdate = false) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("No token found, please login again");

    const query = employeeQueries.find(q => q.id === id);
    if (!query) return alert("Query not found");

    await axios.put(
      `http://localhost:8080/agent/queries/respond/${id}`,
      { response: responseText },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEmployeeQueries(prev =>
      prev.map(q =>
        q.id === id
          ? {
              ...q,
              response: responseText,
              status: isUpdate ? q.status : "Resolved", // Keep status if updating
              allowEdit: isUpdate ? true : true // Keep editable flag for updates
            }
          : q
      )
    );

    alert(isUpdate ? "Response updated successfully!" : "Response sent successfully!");
  } catch (error) {
    console.error("Failed to send/update response:", error.response?.data || error.message);
    alert("Failed to send/update response");
  }
};


  // -------------------- Handle response input changes --------------------
  const handleResponseChange = (id, value) => {
    setEmployeeQueries(prev =>
      prev.map(q => q.id === id ? { ...q, response: value } : q)
    );
  };






  
  // Render content based on active tab
const renderContent = () => {
  switch (activeTab) {
    case "home":
      const pendingQueriesCount = employeeQueries.filter(q => !q.response || q.response.trim() === "").length;
      
      return (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Agent Dashboard Overview</h4>
            <div className="d-flex align-items-center">
              <span className={`badge ${availability ? "bg-success" : "bg-warning"} me-2`}>
                {availability ? "Available" : "Unavailable"}
              </span>
              <button 
                className={`btn btn-sm ${availability ? "btn-warning" : "btn-success"}`}
                onClick={toggleAvailability}
              >
                {availability ? "Set Unavailable" : "Set Available"}
              </button>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Pending Queries</h5>
                  <h2 className="card-text">{pendingQueriesCount}</h2>
                  <p><i className="bi bi-question-circle-fill"></i> Require your attention</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Assisted Claims</h5>
                  <h2 className="card-text">{assistedClaims.length}</h2>
                  <p><i className="bi bi-check-circle-fill"></i> This month</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">Avg. Response Time</h5>
                  <h2 className="card-text">2.5h</h2>
                  <p><i className="bi bi-clock-fill"></i> Faster than average</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <h5 className="card-title">Satisfaction Rate</h5>
                  <h2 className="card-text">94%</h2>
                  <p><i className="bi bi-star-fill"></i> Employee feedback</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Recent Employee Queries</h5>
                </div>
                <div className="card-body">
                  {employeeQueries.slice(0, 5).map(query => {
                    const isAnswered = query.response && query.response.trim() !== "";
                    return (
                      <div key={query.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                        <div>
                          <h6 className="mb-0">{query.employeeName || query.employee}</h6>
                          <small className="text-muted">{query.queryText || query.query}</small>
                        </div>
                        <span className={`badge ${isAnswered ? 'bg-success' : 'bg-warning'}`}>
                          {isAnswered ? 'Answered' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                  {employeeQueries.length === 0 && (
                    <p className="text-muted text-center py-3">No queries assigned yet</p>
                  )}
                  <button className="btn btn-outline-success mt-3 btn-sm" onClick={() => setActiveTab("queries")}>
                    View All Queries
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Recently Assisted Claims</h5>
                </div>
                <div className="card-body">
                  {assistedClaims.slice(0, 5).map(claim => (
                    <div key={claim.id} className="border-bottom py-2">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-0">{claim.employeeName || claim.employee}</h6>
                        <span className={`badge ${claim.status === 'Approved' ? 'bg-success' : 'bg-warning'}`}>
                          {claim.status}
                        </span>
                      </div>
                      <small className="text-muted">{claim.type} • {claim.amount} • {claim.date ? new Date(claim.date).toLocaleString() : "-"}</small>
                    </div>
                  ))}
                  {assistedClaims.length === 0 && (
                    <p className="text-muted text-center py-3">No claims assisted yet</p>
                  )}
                  <button className="btn btn-outline-success mt-3 btn-sm" onClick={() => setActiveTab("claims")}>
                    View All Claims
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      
case "queries":
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Employee Queries</h4>
        <span className={`badge ${availability ? "bg-success" : "bg-warning"}`}>
          {availability ? "Available for queries" : "Currently unavailable"}
        </span>
      </div>

      {/* Filter buttons */}
      <div className="mb-3">
        <button
          className={`btn btn-sm me-2 ${filter === "All" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          className={`btn btn-sm me-2 ${filter === "Pending" ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => setFilter("Pending")}
        >
          Pending
        </button>
        <button
          className={`btn btn-sm ${filter === "Resolved" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setFilter("Resolved")}
        >
          Resolved
        </button>
      </div>

      <div className="card">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">All Employee Queries</h5>
          <span className="badge bg-light text-dark">
            {employeeQueries.filter(q => q.status !== "Resolved").length} Pending
          </span>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Query</th>
                <th>Date</th>
                <th>Status</th>
                <th>Response</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeQueries
                .filter(q => (filter === "All" ? true : q.status === filter))
                .map(query => (
                  <tr key={query.id}>
                    <td>{query.employee || `Employee ${query.employeeId}`}</td>
                    <td>{query.query}</td>
                    <td>{query.createdAt ? new Date(query.createdAt).toLocaleString() : "Invalid Date"}</td>
                    <td>
                      <span
                        className={`badge ${
                          query.status === "Pending"
                            ? "bg-warning"
                            : query.status === "Resolved"
                            ? "bg-success"
                            : "bg-info"
                        }`}
                      >
                        {query.status}
                      </span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Type your response"
                        value={query.response || ""}
                        onChange={e => handleResponseChange(query.id, e.target.value)}
                        disabled={query.status === "Resolved" && !query.isEditing} // Editable if editing
                      />
                    </td>
                    <td>
                      {/* Pending queries */}
                      {query.status === "Pending" && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => {
                              if (!query.response || query.response.trim() === "") {
                                alert("Please type a response before submitting");
                                return;
                              }
                              respondToQuery(query.id, query.response);
                            }}
                          >
                            <i className="bi bi-chat"></i> Respond
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={async () => {
                              try {
                                await axios.put(
                                  `http://localhost:8080/agent/queries/respond/${query.id}`,
                                  { response: query.response || "Resolved" },
                                  { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                                );
                                setEmployeeQueries(prev =>
                                  prev.map(q =>
                                    q.id === query.id
                                      ? { ...q, status: "Resolved", isEditing: false }
                                      : q
                                  )
                                );
                                alert("Query marked as resolved");
                              } catch (err) {
                                console.error("Failed to resolve query:", err);
                                alert("Failed to resolve query.");
                              }
                            }}
                          >
                            <i className="bi bi-check"></i> Resolve
                          </button>
                        </>
                      )}

                      {/* Resolved queries */}
                      {query.status === "Resolved" && (
                        <button
                          className={`btn btn-sm ${query.isEditing ? "btn-success" : "btn-outline-primary"}`}
                          onClick={() => {
                            if (query.isEditing) {
                              // Update response
                              respondToQuery(query.id, query.response, true);
                              setEmployeeQueries(prev =>
                                prev.map(q =>
                                  q.id === query.id ? { ...q, isEditing: false } : q
                                )
                              );
                            } else {
                              // Enable edit mode
                              setEmployeeQueries(prev =>
                                prev.map(q =>
                                  q.id === query.id ? { ...q, isEditing: true } : q
                                )
                              );
                            }
                          }}
                        >
                          <i className={`bi ${query.isEditing ? "bi-check-lg" : "bi-pencil"}`}></i>{" "}
                          {query.isEditing ? "Update" : "Edit"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

              {employeeQueries.filter(q => (filter === "All" ? true : q.status === filter)).length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    <span className="text-muted">No queries to display</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


      
      case "claims":
        return (
          <div>
            <h4 className="mb-4">Assisted Claims</h4>
            
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Claims You've Assisted With</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assistedClaims.map(claim => (
                        <tr key={claim.id}>
                          <td>{claim.employee}</td>
                          <td>{claim.type}</td>
                          <td>{claim.amount}</td>
                          <td>{claim.date}</td>
                          <td>
                            <span className={`badge ${claim.status === 'Approved' ? 'bg-success' : 'bg-warning'}`}>
                              {claim.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="bi bi-eye"></i> View
                            </button>
                            <button className="btn btn-sm btn-outline-info">
                              <i className="bi bi-pencil"></i> Update
                            </button>
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
      
case "availability":
  return (
    <div>
      <h4 className="mb-4">Availability Settings ({agentName})</h4>

      <div className="card">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Set Your Availability</h5>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            When you're unavailable, employees will see that you're not accepting new queries at the moment.
          </div>

          {/* Current Availability */}
          <div className="d-flex align-items-center mb-4">
            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="availabilityToggle"
                checked={availability}
                onChange={toggleAvailability}
                style={{ transform: "scale(1.5)" }}
              />
            </div>
            <label className="form-check-label fs-5" htmlFor="availabilityToggle">
              I am currently available for employee queries
            </label>
          </div>

          <div className={`p-3 rounded-3 ${availability ? "bg-success bg-opacity-10" : "bg-warning bg-opacity-10"}`}>
            <h6 className="mb-2">Current Status:</h6>
            <span className={`badge ${availability ? "bg-success" : "bg-warning"} fs-6`}>
              {availability ? "Available - Employees can contact you" : "Unavailable - Not accepting new queries"}
            </span>
          </div>

          {/* Schedule Future Availability */}
          <div className="mt-4">
            <h6>Schedule Future Availability:</h6>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">From</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={futureFrom}
                  onChange={(e) => setFutureFrom(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">To</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={futureTo}
                  onChange={(e) => setFutureTo(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-success" onClick={scheduleFutureAvailability}>
              <i className="bi bi-calendar-check me-2"></i> Schedule Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );

      
      case "resources":
        return (
          <div>
            <h4 className="mb-4">Policy Resources</h4>
            
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <i className="bi bi-file-earmark-text fs-1 text-primary mb-3"></i>
                    <h5>Health Policy Guide</h5>
                    <p>Complete documentation for health insurance policies</p>
                    <button className="btn btn-outline-primary">View Guide</button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <i className="bi bi-file-earmark-pdf fs-1 text-danger mb-3"></i>
                    <h5>Claim Process FAQ</h5>
                    <p>Frequently asked questions about the claim process</p>
                    <button className="btn btn-outline-danger">Download PDF</button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <i className="bi bi-play-btn fs-1 text-info mb-3"></i>
                    <h5>Training Videos</h5>
                    <p>Video tutorials for assisting employees</p>
                    <button className="btn btn-outline-info">Watch Videos</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card mt-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Quick Reference Materials</h5>
              </div>
              <div className="card-body">
                <div className="list-group">
                  <a href="#" className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Contact Information for Insurance Providers</h6>
                      <small className="text-muted">PDF</small>
                    </div>
                    <small className="text-muted">Updated 2 days ago</small>
                  </a>
                  <a href="#" className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Claim Submission Checklist</h6>
                      <small className="text-muted">DOCX</small>
                    </div>
                    <small className="text-muted">Updated 1 week ago</small>
                  </a>
                  <a href="#" className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Common Rejection Reasons & Solutions</h6>
                      <small className="text-muted">PDF</small>
                    </div>
                    <small className="text-muted">Updated 3 weeks ago</small>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "reports":
        return (
          <div>
            <h4 className="mb-4">Agent Performance Reports</h4>
            
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Monthly Performance</h5>
                  </div>
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-6 mb-3">
                        <h3 className="text-primary">24</h3>
                        <p>Queries Handled</p>
                      </div>
                      <div className="col-6 mb-3">
                        <h3 className="text-success">92%</h3>
                        <p>Resolution Rate</p>
                      </div>
                      <div className="col-6 mb-3">
                        <h3 className="text-info">2.1h</h3>
                        <p>Avg. Response Time</p>
                      </div>
                      <div className="col-6 mb-3">
                        <h3 className="text-warning">4.8/5</h3>
                        <p>Satisfaction Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Generate Report</h5>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Report Type</label>
                        <select className="form-select">
                          <option>Query Resolution Report</option>
                          <option>Claim Assistance Report</option>
                          <option>Performance Summary</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Date Range</label>
                        <select className="form-select">
                          <option>Last 7 days</option>
                          <option>Last 30 days</option>
                          <option>Last quarter</option>
                          <option>Custom range</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Format</label>
                        <select className="form-select">
                          <option>PDF</option>
                          <option>Excel</option>
                          <option>CSV</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-success w-100">
                        <i className="bi bi-download me-2"></i> Generate Report
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <h4>Welcome, {localStorage.getItem("agentName") || "Agent"}</h4>;
    }
  };

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <header className="bg-success text-white py-3 px-4 d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-person-check fs-2"></i>
          <h2 className="mb-0">InsurAI Agent Portal</h2>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span>Welcome, <strong>{localStorage.getItem("agentName") || "Agent"}</strong></span>
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
              className={`nav-link ${activeTab === "queries" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("queries"); }}
            >
              <i className="bi bi-question-circle me-2"></i> Employee Queries
            </a>
            <a
              href="#"
              className={`nav-link ${activeTab === "claims" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("claims"); }}
            >
              <i className="bi bi-file-earmark-check me-2"></i> Assisted Claims
            </a>
            <a
              href="#"
              className={`nav-link ${activeTab === "availability" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("availability"); }}
            >
              <i className="bi bi-calendar-check me-2"></i> Availability
            </a>
            <a
              href="#"
              className={`nav-link ${activeTab === "resources" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("resources"); }}
            >
              <i className="bi bi-file-earmark-text me-2"></i> Resources
            </a>
            <a
              href="#"
              className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("reports"); }}
            >
              <i className="bi bi-graph-up me-2"></i> Reports
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