// File: src/pages/dashboard/Admin/AdminUserManagement.jsx
import React, { useState, useMemo } from "react";
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminUserManagement({ 
  users = [], 
  setActiveTab,
  onEditUser,
  onDeleteUser,
  onStatusChange 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Calculate user statistics
  const userStats = useMemo(() => {
    const totalUsers = users.length;
    const totalEmployees = users.filter(user => user.role === "Employee").length;
    const totalAgents = users.filter(user => user.role === "Agent").length;
    const totalHR = users.filter(user => user.role === "HR").length;
    const activeUsers = users.filter(user => user.status === "Active").length;
    const inactiveUsers = users.filter(user => user.status === "Inactive").length;

    return { totalUsers, totalEmployees, totalAgents, totalHR, activeUsers, inactiveUsers };
  }, [users]);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle user actions
  const handleEdit = (user) => {
    if (onEditUser) {
      onEditUser(user);
    }
  };

  const handleStatusToggle = (user) => {
    if (onStatusChange) {
      const newStatus = user.status === "Active" ? "Inactive" : "Active";
      onStatusChange(user.id, newStatus);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteConfirm(user);
  };

  const confirmDelete = () => {
    if (onDeleteUser && deleteConfirm) {
      onDeleteUser(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "HR": return "bg-primary";
      case "Agent": return "bg-info";
      case "Employee": return "bg-success";
      default: return "bg-secondary";
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    return status === "Active" ? "bg-success" : "bg-warning";
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "HR": return "bi-person-badge";
      case "Agent": return "bi-headset";
      case "Employee": return "bi-person";
      default: return "bi-person";
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  // Chart data for user distribution
  const roleDistributionData = {
    labels: ['Employees', 'Agents', 'HR'],
    datasets: [
      {
        data: [userStats.totalEmployees, userStats.totalAgents, userStats.totalHR],
        backgroundColor: [
          'rgba(25, 135, 84, 0.8)',
          'rgba(13, 202, 240, 0.8)',
          'rgba(13, 110, 253, 0.8)'
        ],
        borderColor: [
          'rgba(25, 135, 84, 1)',
          'rgba(13, 202, 240, 1)',
          'rgba(13, 110, 253, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  // Status distribution data
  const statusDistributionData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [userStats.activeUsers, userStats.inactiveUsers],
        backgroundColor: [
          'rgba(25, 135, 84, 0.8)',
          'rgba(255, 193, 7, 0.8)'
        ],
        borderColor: [
          'rgba(25, 135, 84, 1)',
          'rgba(255, 193, 7, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  // Role comparison chart data
  const roleComparisonData = {
    labels: ['Employees', 'Agents', 'HR'],
    datasets: [
      {
        label: 'User Count',
        data: [userStats.totalEmployees, userStats.totalAgents, userStats.totalHR],
        backgroundColor: [
          'rgba(25, 135, 84, 0.7)',
          'rgba(13, 202, 240, 0.7)',
          'rgba(13, 110, 253, 0.7)'
        ],
        borderColor: [
          'rgba(25, 135, 84, 1)',
          'rgba(13, 202, 240, 1)',
          'rgba(13, 110, 253, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#6c757d'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#6c757d'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6c757d'
        }
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#6c757d'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
  };

  return (
    <div className="admin-user-management">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-gray-800 mb-1">User Management</h4>
          <p className="text-gray-600 mb-0">Manage system users and their permissions</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary d-flex align-items-center shadow-sm"
            onClick={() => setActiveTab("registerHR")}
          >
            <i className="bi bi-person-plus me-2"></i>
            Add HR
          </button>
          <button
            className="btn btn-outline-primary d-flex align-items-center shadow-sm"
            onClick={() => setActiveTab("registerAgent")}
          >
            <i className="bi bi-person-plus me-2"></i>
            Add Agent
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow-sm h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {userStats.totalUsers}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">All system users</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-people-fill fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow-sm h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Employees
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {userStats.totalEmployees}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Employee accounts</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-person-fill fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow-sm h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Agents
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {userStats.totalAgents}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Agent accounts</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-headset fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow-sm h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    HR Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {userStats.totalHR}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">HR accounts</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-person-badge fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-gray-800">
                <i className="bi bi-pie-chart me-2"></i>
                Role Distribution
              </h6>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                <Pie data={roleDistributionData} options={pieChartOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-gray-800">
                <i className="bi bi-bar-chart me-2"></i>
                Role Comparison
              </h6>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                <Bar data={roleComparisonData} options={barChartOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-gray-800">
                <i className="bi bi-circle-half me-2"></i>
                Status Overview
              </h6>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                <Doughnut data={statusDistributionData} options={doughnutChartOptions} />
              </div>
              <div className="text-center mt-3">
                <div className="d-flex justify-content-around">
                  <div>
                    <span className="badge bg-success me-2"></span>
                    <small className="text-gray-600">Active: {userStats.activeUsers}</small>
                  </div>
                  <div>
                    <span className="badge bg-warning me-2"></span>
                    <small className="text-gray-600">Inactive: {userStats.inactiveUsers}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-semibold text-gray-700">Search Users</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-gray-500"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-gray-700">Filter by Role</label>
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Roles</option>
                <option value="Employee">Employee</option>
                <option value="Agent">Agent</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-gray-700">Filter by Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={resetFilters}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 font-weight-bold text-gray-800">
            <i className="bi bi-people me-2"></i>
            All Users
            <span className="badge bg-primary ms-2">
              {filteredUsers.length}
            </span>
          </h5>
          <div className="d-flex align-items-center gap-3">
            <span className="text-gray-600 small">
              Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
            </span>
            <select
              className="form-select form-select-sm w-auto"
              value={usersPerPage}
              onChange={(e) => {
                setUsersPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 text-gray-700 font-weight-bold">User</th>
                  <th className="border-0 text-gray-700 font-weight-bold">Email</th>
                  <th className="border-0 text-gray-700 font-weight-bold">Role</th>
                  <th className="border-0 text-gray-700 font-weight-bold">Status</th>
                  <th className="border-0 text-gray-700 font-weight-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="border-bottom">
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="avatar-sm rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-bold shadow-sm"
                          style={{
                            backgroundColor: user.role === "HR" ? "#0d6efd" : 
                                           user.role === "Agent" ? "#0dcaf0" : 
                                           user.role === "Employee" ? "#198754" : "#6c757d",
                            width: "40px",
                            height: "40px"
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold text-gray-800">{user.name}</div>
                          <small className="text-gray-600">{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle text-gray-700">{user.email}</td>
                    <td className="align-middle">
                      <span className={`badge ${getRoleBadgeClass(user.role)} shadow-sm`}>
                        <i className={`bi ${getRoleIcon(user.role)} me-1`}></i>
                        {user.role}
                      </span>
                    </td>
                    <td className="align-middle">
                      <span className={`badge ${getStatusBadgeClass(user.status)} shadow-sm`}>
                        <i className={`bi ${
                          user.status === "Active" ? "bi-check-circle" : "bi-pause-circle"
                        } me-1`}></i>
                        {user.status}
                      </span>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          onClick={() => handleEdit(user)}
                          title="Edit User"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-success rounded-pill px-3"
                          onClick={() => handleStatusToggle(user)}
                          title={user.status === "Active" ? "Deactivate User" : "Activate User"}
                        >
                          <i className={`bi ${
                            user.status === "Active" ? "bi-pause" : "bi-play"
                          }`}></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => handleDeleteClick(user)}
                          title="Delete User"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <i className="bi bi-people display-1 text-gray-300 d-block mb-3"></i>
                      <h5 className="text-gray-500">No users found</h5>
                      <p className="text-gray-500 mb-0">
                        {users.length === 0 
                          ? "No users in the system yet. Add your first user above."
                          : "Try adjusting your search or filters"
                        }
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-gray-600 small">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link rounded-start"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}

                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link rounded-end"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div 
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white border-0">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Confirm Delete
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={cancelDelete}
                ></button>
              </div>
              <div className="modal-body py-4">
                <p className="text-gray-700">
                  Are you sure you want to delete user <strong>"{deleteConfirm.name}"</strong>?
                </p>
                <p className="text-gray-600 mb-0">
                  This action cannot be undone. All user data will be permanently removed.
                </p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill px-4"
                  onClick={confirmDelete}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}