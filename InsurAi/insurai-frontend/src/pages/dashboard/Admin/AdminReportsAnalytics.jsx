import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { CSVLink } from "react-csv";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useMemo } from "react";

export default function AdminReportsAnalytics() {
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [employeeClaimsMap, setEmployeeClaimsMap] = useState({});

  // Colors for charts
  const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
  const STATUS_COLORS = { 
    "Pending": "#FFC107", 
    "Approved": "#28A745", 
    "Rejected": "#DC3545",
    "Processing": "#17A2B8"
  };

  // Fetch data for reports
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      try {
        const [usersRes, claimsRes, policiesRes, hrsRes, agentsRes] = await Promise.all([
          axios.get("http://localhost:8080/auth/employees", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8080/admin/claims", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8080/admin/policies", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8080/hr", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8080/agent", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUsers(usersRes.data || []);
        setClaims(claimsRes.data || []);
        setPolicies(policiesRes.data || []);
        setHrs(hrsRes.data || []);
        setAgents(agentsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch report data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on date
 const filterDataByDate = (data, type) => {
  if (dateFilter === "all") return data;
  const now = new Date();
  let filterDate = new Date();

  switch(dateFilter) {
    case "today":
      filterDate.setHours(0,0,0,0);
      break;
    case "week":
      filterDate.setDate(now.getDate() - 7);
      break;
    case "month":
      filterDate.setMonth(now.getMonth() - 1);
      break;
    case "year":
      filterDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return data;
  }

  return data.filter(item => {
    let itemDate;
    if (type === "claims") itemDate = item.claimDate || item.created_at;
    else if (type === "users") itemDate = item.joinDate;
    else if (type === "policies") itemDate = item.created_at;

    return itemDate && new Date(itemDate) >= filterDate;
  });
};


const filteredClaims = useMemo(() => filterDataByDate(claims, "claims"), [claims, dateFilter]);
const filteredUsers = useMemo(() => filterDataByDate(users, "users"), [users, dateFilter]);
const filteredPolicies = useMemo(() => filterDataByDate(policies, "policies"), [policies, dateFilter]);


  // ==================== CALCULATED METRICS ====================

  const totalPolicies = policies.length;
  const totalEmployees = users.length;

  // Map employeeId (string) to number of claims
  useEffect(() => {
    if (!filteredClaims || filteredClaims.length === 0) {
      setEmployeeClaimsMap({});
      return;
    }

    const map = {};
    filteredClaims.forEach(claim => {
      const empId = claim.employeeId || claim.employee_id; // match string employeeId from users
      if (empId) map[empId] = (map[empId] || 0) + 1;
    });

    setEmployeeClaimsMap(map);
  }, [filteredClaims]);

  // Employees with at least one claim
  const employeesWithClaims = users.filter(user => 
    employeeClaimsMap[user.id] > 0
  ).length;

  // Average claims per employee
  const averageClaimPerEmployee = totalEmployees > 0 
    ? (filteredClaims.length / totalEmployees).toFixed(1) 
    : 0;

  // Average amount per employee
  const averageAmountPerEmployee = totalEmployees > 0
    ? (filteredClaims.reduce((sum, claim) => sum + (parseFloat(claim.amount) || 0), 0) / totalEmployees).toFixed(2)
    : 0;

  // HR Reports - calculate workload using **all claims**, ignoring date filter
const hrWorkload = hrs.map(hr => {
  const hrClaims = claims.filter(
    claim => String(claim.assignedHrId) === String(hr.id)
  );

  console.log("HR:", hr.name, "ID:", hr.id, "Claims:", hrClaims);

  const approved = hrClaims.filter(c => c.status === "Approved").length;
  const rejected = hrClaims.filter(c => c.status === "Rejected").length;
  const pending = hrClaims.filter(c => c.status === "Pending").length;
  const total = hrClaims.length;

  return {
    ...hr,
    approved,
    rejected,
    pending,
    total,
    approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0
  };
});


console.log("Claims sample:", claims[0]);


  // Total agents
  const totalAgents = agents.length;

  // Policy usage
  const policyUsage = policies.map(policy => {
    const policyClaims = filteredClaims.filter(claim => 
      claim.policyId === policy.policyId || claim.policyName === policy.policyName
    );
    const claimCount = policyClaims.length;
    const totalAmount = policyClaims.reduce((sum, claim) => sum + (parseFloat(claim.amount) || 0), 0);

    return {
      ...policy,
      claimCount,
      totalAmount,
      avgPerClaim: claimCount > 0 ? (totalAmount / claimCount).toFixed(2) : 0
    };
  });

  // Claims summary
  const totalClaims = filteredClaims.length;
  const claimsByStatus = Object.entries(
    filteredClaims.reduce((acc, claim) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] }));

  // Monthly trends
  const monthlyClaims = () => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthClaims = filteredClaims.filter(claim => {
        const claimDate = new Date(claim.claimDate || claim.created_at);
        return claimDate.getMonth() === index && claimDate.getFullYear() === currentYear;
      });
      return {
        month,
        claims: monthClaims.length,
        amount: monthClaims.reduce((sum, claim) => sum + (parseFloat(claim.amount) || 0), 0)
      };
    });
  };


  // ==================== EXPORT FUNCTIONS ====================

  const downloadFullPDFReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('COMPREHENSIVE ADMIN REPORT', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${date}`, 105, 28, { align: 'center' });
    doc.text(`Date Filter: ${dateFilter === 'all' ? 'All Time' : dateFilter}`, 105, 34, { align: 'center' });

    let startY = 45;

    // Executive Summary
    doc.setFontSize(12);
    doc.setTextColor(33, 150, 243);
    doc.text('EXECUTIVE SUMMARY', 14, startY);
    
    doc.autoTable({
      startY: startY + 5,
      head: [['Metric', 'Count', 'Amount (₹)']],
      body: [
        ['Total Employees', totalEmployees, '-'],
        ['Total HR Users', hrs.length, '-'],
        ['Total Agents', agents.length, '-'],
        ['Total Policies', policies.length, '-'],
        ['Total Claims', totalClaims, `₹${filteredClaims.reduce((sum, claim) => sum + (parseFloat(claim.amount) || 0), 0).toFixed(2)}`],
        ['Approved Claims', claimsByStatus.find(s => s.name === 'Approved')?.value || 0, '-'],
        ['Pending Claims', claimsByStatus.find(s => s.name === 'Pending')?.value || 0, '-']
      ],
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243], textColor: 255 },
      styles: { fontSize: 10 }
    });

    // Employee Summary
    startY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(33, 150, 243);
    doc.text('EMPLOYEE SUMMARY', 14, startY);
    
    doc.autoTable({
      startY: startY + 5,
      head: [['Employee Name', 'Role', 'Claims Count', 'Status']],
      body: users.slice(0, 10).map(user => [
        user.name || 'N/A',
        user.role || 'Employee',
        employeeClaimsMap[user.employeeId || user.name] || 0,
        user.status || 'Active'
      ]),
      theme: 'striped',
      styles: { fontSize: 8 }
    });

    // Claims Summary
    startY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(33, 150, 243);
    doc.text('RECENT CLAIMS ACTIVITY', 14, startY);
    
    doc.autoTable({
      startY: startY + 5,
      head: [['Employee', 'Policy', 'Amount (₹)', 'Date', 'Status', 'Assigned HR']],
      body: filteredClaims.slice(0, 15).map(claim => [
        claim.employeeName || 'N/A',
        claim.policyName || 'N/A',
        `₹${parseFloat(claim.amount || 0).toFixed(2)}`,
        new Date(claim.claimDate).toLocaleDateString(),
        claim.status,
        claim.processedByName || 'Not Assigned'
      ]),
      theme: 'grid',
      styles: { fontSize: 7 }
    });

    // Policy Summary
    startY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(33, 150, 243);
    doc.text('POLICY USAGE SUMMARY', 14, startY);
    
    doc.autoTable({
      startY: startY + 5,
      head: [['Policy Name', 'Type', 'Claims', 'Total Amount (₹)', 'Avg/Claim (₹)']],
      body: policyUsage.map(policy => [
        policy.policyName,
        policy.policyType,
        policy.claimCount,
        `₹${policy.totalAmount.toFixed(2)}`,
        `₹${policy.avgPerClaim}`
      ]),
      theme: 'striped',
      styles: { fontSize: 8 }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      doc.text('Generated by Claims Management System', 105, 295, { align: 'center' });
    }

    doc.save(`admin_comprehensive_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Remove password from employee CSV export
  const getEmployeesForCSV = () => {
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Format currency with ₹ symbol
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold text-gray-800 mb-1">Admin Reports & Analytics</h4>
              <p className="text-muted mb-0">Comprehensive analytics across employees, HR, agents, policies, and claims</p>
            </div>
            <div className="bg-primary rounded p-2">
              <span className="text-white">
                <i className="bi bi-graph-up me-2"></i>
                Real-time Analytics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Date Range Filter</label>
                  <select 
                    className="form-select border-primary" 
                    value={dateFilter} 
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
                <div className="col-md-9">
                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-primary">Employees: {totalEmployees}</span>
                    <span className="badge bg-success">HR Users: {hrs.length}</span>
                    <span className="badge bg-info">Agents: {totalAgents}</span>
                    <span className="badge bg-warning">Policies: {totalPolicies}</span>
                    <span className="badge bg-danger">Claims: {totalClaims}</span>
                    <span className="badge bg-secondary">Total Amount: {formatCurrency(filteredClaims.reduce((sum, claim) => sum + (parseFloat(claim.amount) || 0), 0))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills nav-fill bg-light rounded p-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: "speedometer2" },
              { id: "employees", label: "Employee Reports", icon: "people" },
              { id: "hr", label: "HR Reports", icon: "person-check" },
              { id: "agents", label: "Agent Reports", icon: "person-badge" },
              { id: "policies", label: "Policy Reports", icon: "file-earmark-text" },
              { id: "claims", label: "Claims Reports", icon: "clipboard-data" }
            ].map(tab => (
              <li key={tab.id} className="nav-item">
                <button 
                  className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`bi bi-${tab.icon} me-2`}></i>{tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="row">
          {/* Summary Cards */}
          <div className="col-xl-2 col-md-4 col-6 mb-3">
            <div className="card border-left-primary border-3 border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className="bi bi-people fs-1 text-primary mb-2"></i>
                <h4 className="text-primary">{totalEmployees}</h4>
                <small className="text-muted">Total Employees</small>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-6 mb-3">
            <div className="card border-left-success border-3 border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className="bi bi-person-check fs-1 text-success mb-2"></i>
                <h4 className="text-success">{hrs.length}</h4>
                <small className="text-muted">HR Users</small>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-6 mb-3">
            <div className="card border-left-info border-3 border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className="bi bi-person-badge fs-1 text-info mb-2"></i>
                <h4 className="text-info">{totalAgents}</h4>
                <small className="text-muted">Agents</small>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-6 mb-3">
            <div className="card border-left-warning border-3 border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className="bi bi-file-earmark-text fs-1 text-warning mb-2"></i>
                <h4 className="text-warning">{totalPolicies}</h4>
                <small className="text-muted">Policies</small>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-6 mb-3">
            <div className="card border-left-danger border-3 border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className="bi bi-clipboard-data fs-1 text-danger mb-2"></i>
                <h4 className="text-danger">{totalClaims}</h4>
                <small className="text-muted">Total Claims</small>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-6 mb-3">
            <div className="card border-left-secondary border-3 border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className="bi bi-currency-rupee fs-1 text-secondary mb-2"></i>
                <h4 className="text-secondary">
                  {formatCurrency(filteredClaims.reduce((sum, claim) => sum + (parseFloat(claim.amount) || 0), 0))}
                </h4>
                <small className="text-muted">Total Amount</small>
              </div>
            </div>
          </div>

           {/* Charts Row */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Claims Status Distribution</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={claimsByStatus} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100}
                      label
                    >
                      {claimsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Policy Usage</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={policyUsage.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="policyName" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="claimCount" name="Number of Claims" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Monthly Claims Trend</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyClaims()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="claims" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Employee Reports Tab */}
{activeTab === "employees" && (
  <div className="row">
    {/* Employee Metrics */}
    <div className="col-md-4 mb-4">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Employee Metrics</h5>
          <CSVLink 
            data={getEmployeesForCSV()} 
            filename="employee_report.csv"
            className="btn btn-sm btn-success"
          >
            <i className="bi bi-download me-1"></i>CSV
          </CSVLink>
        </div>
        <div className="card-body">
          <div className="row text-center">
            <div className="col-6 mb-3">
              <div className="border rounded p-3">
                <h4 className="text-primary">{totalEmployees}</h4>
                <small className="text-muted">Total Employees</small>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="border rounded p-3">
              <h4 className="text-success">{filteredClaims.length}</h4>
              <small className="text-muted">Total Claims</small>

              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="border rounded p-3">
                <h4 className="text-info">
                  {averageClaimPerEmployee}
                </h4>
                <small className="text-muted">Avg Claims/Employee</small>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="border rounded p-3">
                <h4 className="text-warning">
                  {formatCurrency(
                    filteredClaims.reduce((sum, claim) => sum + (parseFloat(claim.amount) || 0), 0) / totalEmployees
                  )}
                </h4>
                <small className="text-muted">Avg Amount/Employee</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    {/* Employee List */}
    <div className="col-md-8 mb-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Employee List</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Claims Count</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map(user => (
                  <tr key={user.id || user.employeeId}>
                    <td>{user.name || 'N/A'}</td>
                    <td><span className="badge bg-secondary">{user.role || 'Employee'}</span></td>
                    <td>
                      <span className="badge bg-primary">
    {employeeClaimsMap[user.id] || 0} {/* use user.id, not employeeId */}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${(user.status === 'Active' || !user.status) ? 'bg-success' : 'bg-warning'}`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


{/* HR Reports Tab */}
{activeTab === "hr" && (
  <div className="row">
    <div className="col-12 mb-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
          <h5 className="mb-0">HR Performance Overview</h5>
          <CSVLink 
            data={hrWorkload} 
            filename="hr_report.csv"
            className="btn btn-sm btn-success"
          >
            <i className="bi bi-download me-1"></i>CSV
          </CSVLink>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>HR Name</th>
                  <th>Approved</th>
                  <th>Rejected</th>
                  <th>Pending</th>
                  <th>Total Processed</th>
                  <th>Approval Rate</th>
                  <th>Workload</th>
                </tr>
              </thead>
              <tbody>
                {hrs.map(hr => {
                  // ✅ match camelCase field from backend
                  const hrClaims = filteredClaims.filter(
                    claim => Number(claim.assignedHrId) === Number(hr.id)
                  );

                  const approved = hrClaims.filter(c => c.status === "Approved").length;
                  const rejected = hrClaims.filter(c => c.status === "Rejected").length;
                  const pending = hrClaims.filter(c => c.status === "Pending").length;
                  const total = hrClaims.length;
                  const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

                  return (
                    <tr key={hr.hrId || hr.id}>
                      <td>{hr.name || 'HR User'}</td>
                      <td><span className="badge bg-success">{approved}</span></td>
                      <td><span className="badge bg-danger">{rejected}</span></td>
                      <td><span className="badge bg-warning">{pending}</span></td>
                      <td><span className="badge bg-primary">{total}</span></td>
                      <td><span className="badge bg-info">{approvalRate}%</span></td>
                      <td>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar bg-success" 
                            style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%` }}
                          ></div>
                          <div 
                            className="progress-bar bg-danger" 
                            style={{ width: `${total > 0 ? (rejected / total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
)}





      {/* Agent Reports Tab */}
      {activeTab === "agents" && (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className="bi bi-person-badge fs-1 text-info mb-3"></i>
                <h3 className="text-info">{totalAgents}</h3>
                <h5>Total Agents</h5>
                <p className="text-muted">Active insurance agents in the system</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Agent List</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Agent Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.slice(0, 5).map(agent => (
                        <tr key={agent.agentId || agent.id}>
                          <td>{agent.name || 'N/A'}</td>
                          <td>{agent.email || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policy Reports Tab */}
      {activeTab === "policies" && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Policy Usage Analytics</h5>
                <CSVLink 
                  data={policyUsage} 
                  filename="policy_report.csv"
                  className="btn btn-sm btn-success"
                >
                  <i className="bi bi-download me-1"></i>CSV
                </CSVLink>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Policy Name</th>
                        <th>Type</th>
                        <th>Claims Count</th>
                        <th>Total Amount (₹)</th>
                        <th>Avg per Claim (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policyUsage.map(policy => (
                        <tr key={policy.policyId || policy.id}>
                          <td>{policy.policyName}</td>
                          <td><span className="badge bg-secondary">{policy.policyType}</span></td>
                          <td><span className="badge bg-primary">{policy.claimCount}</span></td>
                          <td>{formatCurrency(policy.totalAmount)}</td>
                          <td>{formatCurrency(policy.avgPerClaim)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Claims Reports Tab */}
{activeTab === "claims" && (
  <div className="row">
    {/* Claims Summary */}
    <div className="col-md-4 mb-4">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title">Claims Summary</h5>
          <div className="row text-center">
            {claimsByStatus.map(status => (
              <div key={status.name} className="col-6 mb-3">
                <div className="border rounded p-2">
                  <h6 className="mb-1" style={{ color: status.color }}>
                    {status.value}
                  </h6>
                  <small className="text-muted">{status.name}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Recent Claims Activity */}
    <div className="col-md-8 mb-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Recent Claims Activity</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Policy</th>
                  <th>Amount (₹)</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Assigned HR</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.slice(0, 10).map(claim => {
                  const employee = users.find(u => u.id === claim.employeeId);
                  const hr = hrs.find(h => h.id === claim.assignedHrId);

                  return (
                    <tr key={claim.id}>
                      <td>{employee ? employee.name : `Emp#${claim.employeeId}`}</td>
                      <td>{claim.policyName || "N/A"}</td>
                      <td>{formatCurrency(claim.amount)}</td>
                      <td>{new Date(claim.claimDate).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            claim.status === "Approved"
                              ? "success"
                              : claim.status === "Rejected"
                              ? "danger"
                              : "warning"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td>{hr ? hr.name : "Not Assigned"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Export Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">Export Reports</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <button className="btn btn-outline-danger w-100" onClick={downloadFullPDFReport}>
                    <i className="bi bi-file-pdf me-2"></i>Full PDF Report
                  </button>
                </div>
                <div className="col-md-3">
                  <CSVLink data={getEmployeesForCSV()} filename="employees_report.csv" className="btn btn-outline-primary w-100">
                    <i className="bi bi-file-spreadsheet me-2"></i>Employees CSV
                  </CSVLink>
                </div>
                <div className="col-md-3">
                  <CSVLink data={claims} filename="claims_report.csv" className="btn btn-outline-success w-100">
                    <i className="bi bi-file-spreadsheet me-2"></i>Claims CSV
                  </CSVLink>
                </div>
                <div className="col-md-3">
                  <CSVLink data={policies} filename="policies_report.csv" className="btn btn-outline-warning w-100">
                    <i className="bi bi-file-spreadsheet me-2"></i>Policies CSV
                  </CSVLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}