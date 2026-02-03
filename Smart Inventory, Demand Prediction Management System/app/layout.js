/**
 * Root Layout Component
 * =====================
 * 
 * This is the root layout for the entire application.
 * It wraps all pages and provides:
 * - Global CSS styles
 * - HTML structure
 * - Professional sidebar navigation with smooth transitions
 */

'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

/**
 * Sidebar Navigation Component
 * ----------------------------
 * Professional navigation menu with smooth animations
 */

function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navSections = [
    {
      title: 'Overview',
      items: [
        { href: '/', icon: '📊', label: 'Dashboard' },
      ]
    },
    {
      title: 'Inventory',
      items: [
        { href: '/products', icon: '📦', label: 'Products' },
        { href: '/products/add', icon: '➕', label: 'Add Product' },
        { href: '/categories', icon: '🏷️', label: 'Categories' },
        { href: '/warehouses', icon: '🏭', label: 'Warehouses' },
      ]
    },
    {
      title: 'Transactions',
      items: [
        { href: '/sales', icon: '💰', label: 'Sales' },
        { href: '/sales/add', icon: '🛒', label: 'New Sale' },
        { href: '/purchases', icon: '📥', label: 'Purchases' },
        { href: '/purchases/add', icon: '📋', label: 'New Purchase' },
      ]
    },
    {
      title: 'Partners',
      items: [
        { href: '/customers', icon: '👥', label: 'Customers' },
        { href: '/suppliers', icon: '🏢', label: 'Suppliers' },
      ]
    },
    {
      title: 'Alerts & Reports',
      items: [
        { href: '/alerts', icon: '🔔', label: 'Alerts' },
        { href: '/alerts/low-stock', icon: '⚠️', label: 'Low Stock' },
        { href: '/alerts/dead-stock', icon: '💀', label: 'Dead Stock' },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { href: '/analytics/sales', icon: '📈', label: 'Sales Analytics' },
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
            <span className="user-name">Admin User</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </aside>
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
        <div className="layout">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
