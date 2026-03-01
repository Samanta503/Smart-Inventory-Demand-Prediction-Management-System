/**
 * Root Layout Component
 * =====================
 * 
 * This is the root layout for the entire application.
 * It wraps all pages and provides:
 * - Global CSS styles
 * - HTML structure
 * - Authentication gating (login required)
 * - Role-based access (Admin sees full app, others see under construction)
 * - Professional sidebar navigation with smooth transitions
 */

'use client';

import { HiOutlineChartBar, HiOutlineCube, HiOutlinePlusCircle, HiOutlineTag, HiOutlineBuildingOffice, HiOutlineBanknotes, HiOutlineShoppingCart, HiOutlineInboxArrowDown, HiOutlineClipboardDocumentList, HiOutlineUserGroup, HiOutlineBuildingStorefront, HiOutlineBell, HiOutlineExclamationTriangle, HiOutlineNoSymbol, HiOutlineChartBarSquare, HiOutlineShieldCheck, HiOutlineArrowRightOnRectangle, HiOutlineWrench } from 'react-icons/hi2';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import LoginPage from '@/app/login/page';

/**
 * Sidebar Navigation Component
 * ---------------------------- 
 * Professional navigation menu with smooth animations
 */


function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  // Alert counts for sidebar badges
  const [lowStockCount, setLowStockCount] = useState(0);
  const [deadStockCount, setDeadStockCount] = useState(0);

  const fetchAlertCounts = useCallback(async () => {
    try {
      const [lowStockRes, deadStockRes] = await Promise.all([
        fetch('/api/products/low-stock'),
        fetch('/api/products/dead-stock')
      ]);
      const lowStockData = await lowStockRes.json();
      const deadStockData = await deadStockRes.json();
      if (lowStockData.success) {
        setLowStockCount(lowStockData.summary?.totalLowStockProducts || 0);
      }
      if (deadStockData.success) {
        setDeadStockCount(deadStockData.summary?.totalDeadStockProducts || 0);
      }
    } catch (err) {
      // Silently fail - badges just won't show
    }
  }, []);

  useEffect(() => {
    fetchAlertCounts();
    // Refresh counts every 60 seconds
    const interval = setInterval(fetchAlertCounts, 60000);
    return () => clearInterval(interval);
  }, [fetchAlertCounts]);

  const navSections = [
    {
      title: 'Overview',
      items: [
        { href: '/', icon: <HiOutlineChartBar size={20} />, label: 'Dashboard' },
      ]
    },
    {
      title: 'Inventory',
      items: [
        { href: '/products', icon: <HiOutlineCube size={20} />, label: 'Products' },
        { href: '/products/add', icon: <HiOutlinePlusCircle size={20} />, label: 'Add Product' },
        { href: '/categories', icon: <HiOutlineTag size={20} />, label: 'Categories' },
        { href: '/warehouses', icon: <HiOutlineBuildingOffice size={20} />, label: 'Warehouses' },
      ]
    },
    {
      title: 'Transactions',
      items: [
        { href: '/sales', icon: <HiOutlineBanknotes size={20} />, label: 'Sales' },
        { href: '/sales/add', icon: <HiOutlineShoppingCart size={20} />, label: 'New Sale' },
        { href: '/purchases', icon: <HiOutlineInboxArrowDown size={20} />, label: 'Purchases' },
        { href: '/purchases/add', icon: <HiOutlineClipboardDocumentList size={20} />, label: 'New Purchase' },
      ]
    },
    {
      title: 'Partners',
      items: [
        { href: '/customers', icon: <HiOutlineUserGroup size={20} />, label: 'Customers' },
        { href: '/suppliers', icon: <HiOutlineBuildingStorefront size={20} />, label: 'Suppliers' },
      ]
    },
    {
      title: 'Alerts & Reports',
      items: [
        { href: '/alerts', icon: <HiOutlineBell size={20} />, label: 'Alerts' },
        { href: '/alerts/low-stock', icon: <HiOutlineExclamationTriangle size={20} />, label: 'Low Stock', badge: lowStockCount },
        { href: '/alerts/dead-stock', icon: <HiOutlineNoSymbol size={20} />, label: 'Dead Stock', badge: deadStockCount },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { href: '/analytics/sales', icon: <HiOutlineChartBarSquare size={20} />, label: 'Sales Analytics' },
      ]
    },
    {
      title: 'Administration',
      items: [
        { href: '/users', icon: <HiOutlineShieldCheck size={20} />, label: 'User Management' },
      ]
    },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <span className="logo-text">Smart Inventory</span>
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="nav-section">
            <div className="nav-section-title">
              <span>{section.title}</span>
            </div>
            <ul className="nav-list">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link 
                    href={item.href} 
                    className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                    {isActive(item.href) && <span className="nav-indicator" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.fullName || 'User'}</span>
            <span className="user-role">{user?.role || 'Role'}</span>
          </div>
          <button
            onClick={logout}
            title="Logout"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '4px',
              marginLeft: 'auto',
              borderRadius: '6px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.color = '#ef4444'}
            onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
          >
            <HiOutlineArrowRightOnRectangle size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/**
 * Under Construction Page
 * -----------------------
 * Shown to non-Admin users after login
 */
function UnderConstructionPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}><HiOutlineWrench size={48} /></div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#f1f5f9',
          marginBottom: '0.75rem',
        }}>
          Page Under Construction
        </h1>
        <p style={{
          color: '#94a3b8',
          fontSize: '1.1rem',
          marginBottom: '0.5rem',
        }}>
          Welcome, <strong style={{ color: '#6366f1' }}>{user?.fullName}</strong>!
        </p>
        <p style={{
          color: '#64748b',
          fontSize: '0.95rem',
          marginBottom: '2rem',
          lineHeight: '1.6',
        }}>
          Your dashboard is currently under development. Only administrators have access to the
          inventory management system at this time. Please check back later.
        </p>
        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '8px',
          color: '#818cf8',
          fontSize: '0.85rem',
          marginBottom: '2rem',
        }}>
          Role: {user?.role}
        </div>
        <br />
        <button
          onClick={logout}
          style={{
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
          }}
        >
          <><HiOutlineArrowRightOnRectangle size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} /> Logout</>
        </button>
      </div>
    </div>
  );
}

/**
 * App Shell
 * ---------
 * Handles auth gating: login → role check → render
 */
function AppShell({ children }) {
  const { user, loading, isAdmin } = useAuth();

  // Still loading auth state from localStorage
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#94a3b8',
        fontSize: '1.1rem',
      }}>
        <div className="spinner" style={{ marginRight: '0.75rem' }}></div>
        Loading...
      </div>
    );
  }

  // Not logged in → show login page
  if (!user) {
    return <LoginPage />;
  }

  // Logged in but NOT admin → under construction
  if (!isAdmin) {
    return <UnderConstructionPage />;
  }

  // Admin → full app
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

/**
 * Root Layout
 * -----------
 * The main layout wrapper for all pages
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Smart Inventory Management System</title>
        <meta name="description" content="A comprehensive inventory and demand prediction management system" />
      </head>
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
