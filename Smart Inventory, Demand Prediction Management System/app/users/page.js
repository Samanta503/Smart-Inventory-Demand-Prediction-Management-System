'use client';

import { HiOutlineShieldCheck, HiOutlineClipboardDocumentList, HiOutlineBanknotes, HiOutlineBuildingOffice, HiOutlineXMark, HiOutlinePlusCircle, HiOutlineExclamationTriangle, HiOutlineCheckCircle, HiOutlinePencil, HiOutlineCheck, HiOutlineUser, HiOutlineBriefcase, HiOutlineMagnifyingGlass, HiOutlineNoSymbol } from 'react-icons/hi2';

/**
 * Users Management Page (Admin)
 * =============================
 * 
 * View, add, edit, and manage system users.
 * Only accessible by Admin role.
 */

import React, { useState, useEffect } from 'react';

const ROLES = ['ADMIN', 'MANAGER', 'SALES', 'WAREHOUSE'];

const roleBadgeColor = {
  ADMIN: 'badge-danger',
  MANAGER: 'badge-warning',
  SALES: 'badge-success',
  WAREHOUSE: 'badge-info',
};

const roleIcons = {
  ADMIN: <HiOutlineShieldCheck size={14} style={{display:'inline', verticalAlign:'middle'}} />,
  MANAGER: <HiOutlineClipboardDocumentList size={14} style={{display:'inline', verticalAlign:'middle'}} />,
  SALES: <HiOutlineBanknotes size={14} style={{display:'inline', verticalAlign:'middle'}} />,
  WAREHOUSE: <HiOutlineBuildingOffice size={14} style={{display:'inline', verticalAlign:'middle'}} />,
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    role: 'SALES',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const result = await response.json();
      if (result.success) {
        setUsers(result.data || []);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleEdit(user) {
    setEditingUser(user);
    setFormData({
      fullName: user.FullName,
      username: user.Username,
      password: '',
      role: user.Role,
    });
    setShowForm(true);
    setError(null);
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ fullName: '', username: '', password: '', role: 'SALES' });
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingUser) {
        // Update existing user
        const response = await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: editingUser.UserID,
            fullName: formData.fullName,
            username: formData.username,
            role: formData.role,
          }),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        setSuccessMsg('User updated successfully!');
      } else {
        // Create new user
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        setSuccessMsg('User created successfully!');
      }

      handleCancelForm();
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleUserStatus(user) {
    try {
      setError(null);
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.UserID,
          isActive: !user.IsActive,
        }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setSuccessMsg(`User ${user.IsActive ? 'deactivated' : 'activated'} successfully!`);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  // Filter and search
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.Role === filterRole;
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && user.IsActive) ||
      (filterStatus === 'INACTIVE' && !user.IsActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats
  const activeUsers = users.filter(u => u.IsActive).length;
  const inactiveUsers = users.filter(u => !u.IsActive).length;
  const adminCount = users.filter(u => u.Role === 'ADMIN').length;
  const totalSalesActivity = users.reduce((sum, u) => sum + parseInt(u.TotalSales || 0), 0);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading users...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title"><HiOutlineShieldCheck size={24} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> User Management</h1>
          <p className="page-subtitle">Manage system users and roles (Admin Panel)</p>
        </div>
        <button className="btn btn-primary" onClick={() => { showForm ? handleCancelForm() : setShowForm(true); }}>
          {showForm ? <><HiOutlineXMark size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Cancel</> : <><HiOutlinePlusCircle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Add User</>}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
          <span><HiOutlineExclamationTriangle size={16} style={{display:'inline', verticalAlign:'middle'}} /></span> {error}
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success" style={{ 
          marginBottom: '1rem', 
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span><HiOutlineCheckCircle size={16} style={{display:'inline', verticalAlign:'middle'}} /></span> {successMsg}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>
            {editingUser ? <><HiOutlinePencil size={20} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Edit User: {editingUser.FullName}</> : <><HiOutlinePlusCircle size={20} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Add New User</>}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              {!editingUser && (
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter password"
                    required={!editingUser}
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>
                      {roleIcons[role]} {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting
                  ? (editingUser ? 'Updating...' : 'Creating...')
                  : (editingUser ? <><HiOutlineCheck size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Update User</> : <><HiOutlinePlusCircle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Create User</>)
                }
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancelForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <span className="stat-icon"><HiOutlineUser size={24} /></span>
          <span className="stat-value">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card success">
          <span className="stat-icon"><HiOutlineCheckCircle size={24} /></span>
          <span className="stat-value">{activeUsers}</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-icon"><HiOutlineShieldCheck size={24} /></span>
          <span className="stat-value">{adminCount}</span>
          <span className="stat-label">Admins</span>
        </div>
        <div className="stat-card info">
          <span className="stat-icon"><HiOutlineBriefcase size={24} /></span>
          <span className="stat-value">{totalSalesActivity}</span>
          <span className="stat-label">Total Sales Made</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="form-group" style={{ flex: '1', minWidth: '200px', marginBottom: 0 }}>
            <input
              type="text"
              placeholder="Search by name or username..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="form-input"
            >
              <option value="ALL">All Roles</option>
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="form-input"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {filteredUsers.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Sales</th>
                  <th>Purchases</th>
                  <th>Created</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.UserID} style={{ opacity: user.IsActive ? 1 : 0.6 }}>
                    <td>#{user.UserID}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: user.IsActive 
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                            : 'linear-gradient(135deg, #6b7280, #9ca3af)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          {user.FullName.charAt(0).toUpperCase()}
                        </div>
                        <strong>{user.FullName}</strong>
                      </div>
                    </td>
                    <td>
                      <code style={{ 
                        backgroundColor: 'var(--bg-primary)', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {user.Username}
                      </code>
                    </td>
                    <td>
                      <span className={`badge ${roleBadgeColor[user.Role] || 'badge-info'}`}>
                        {roleIcons[user.Role]} {user.Role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${user.IsActive ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleUserStatus(user)}
                        title={`Click to ${user.IsActive ? 'deactivate' : 'activate'}`}
                      >
                        {user.IsActive ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info">{user.TotalSales || 0}</span>
                    </td>
                    <td>
                      <span className="badge badge-warning">{user.TotalPurchases || 0}</span>
                    </td>
                    <td style={{ fontSize: '13px' }}>
                      {user.CreatedAt
                        ? new Date(user.CreatedAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })
                        : '-'}
                    </td>
                    <td style={{ fontSize: '13px' }}>
                      {user.UpdatedAt
                        ? new Date(user.UpdatedAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })
                        : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleEdit(user)}
                          title="Edit user"
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <HiOutlinePencil size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => toggleUserStatus(user)}
                          title={user.IsActive ? 'Deactivate user' : 'Activate user'}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            backgroundColor: user.IsActive
                              ? 'rgba(239, 68, 68, 0.1)'
                              : 'rgba(16, 185, 129, 0.1)',
                            color: user.IsActive ? '#ef4444' : '#10b981',
                            border: `1px solid ${user.IsActive
                              ? 'rgba(239, 68, 68, 0.3)'
                              : 'rgba(16, 185, 129, 0.3)'}`,
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          {user.IsActive ? <><HiOutlineNoSymbol size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Deactivate</> : <><HiOutlineCheckCircle size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Activate</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="icon"><HiOutlineUser size={24} /></span>
            <h3>No users found</h3>
            <p>{searchTerm || filterRole !== 'ALL' || filterStatus !== 'ALL'
              ? 'Try adjusting your search or filters'
              : 'Add your first user to get started'
            }</p>
          </div>
        )}
      </div>
    </div>
  );
}
