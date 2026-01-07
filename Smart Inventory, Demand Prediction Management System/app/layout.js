/**
 * Root Layout Component
 * =====================
 * 
 * This is the root layout for the entire application.
 * It wraps all pages and provides:
 * - Global CSS styles
 * - HTML structure
 * - Sidebar navigation
 */

import './globals.css';
import Link from 'next/link';

// Metadata for the application (SEO)
export const metadata = {
  title: 'Smart Inventory Management System',
  description: 'A comprehensive inventory and demand prediction management system',
};

/**
 * Sidebar Navigation Component
 * ----------------------------
 * Displays the navigation menu with links to all pages
 */
function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span>📦</span>
        Smart Inventory
      </div>

      {/* Main Navigation */}
      <nav>
        {/* Dashboard */}
        <div className="nav-section">
          <div className="nav-section-title">Overview</div>
          <Link href="/" className="nav-link">
            <span className="icon">📊</span>
            Dashboard
          </Link>
        </div>

        {/* Inventory */}
        <div className="nav-section">
          <div className="nav-section-title">Inventory</div>
          <Link href="/products" className="nav-link">
            <span className="icon">📦</span>
            Products
          </Link>
          <Link href="/products/add" className="nav-link">
            <span className="icon">➕</span>
            Add Product
          </Link>
          <Link href="/categories" className="nav-link">
            <span className="icon">🏷️</span>
            Categories
          </Link>
        </div>

        {/* Transactions */}
        <div className="nav-section">
          <div className="nav-section-title">Transactions</div>
          <Link href="/sales" className="nav-link">
            <span className="icon">💰</span>
            Sales
          </Link>
          <Link href="/sales/add" className="nav-link">
            <span className="icon">🛒</span>
            New Sale
          </Link>
          <Link href="/purchases" className="nav-link">
            <span className="icon">📥</span>
            Purchases
          </Link>
        </div>

        {/* Alerts & Reports */}
        <div className="nav-section">
          <div className="nav-section-title">Alerts & Reports</div>
          <Link href="/alerts" className="nav-link">
            <span className="icon">🔔</span>
            Alerts
          </Link>
          <Link href="/alerts/low-stock" className="nav-link">
            <span className="icon">⚠️</span>
            Low Stock
          </Link>
          <Link href="/alerts/dead-stock" className="nav-link">
            <span className="icon">💀</span>
            Dead Stock
          </Link>
        </div>

        {/* Analytics */}
        <div className="nav-section">
          <div className="nav-section-title">Analytics</div>
          <Link href="/analytics/sales" className="nav-link">
            <span className="icon">📈</span>
            Sales Analytics
          </Link>
          <Link href="/suppliers" className="nav-link">
            <span className="icon">🏢</span>
            Suppliers
          </Link>
        </div>
      </nav>
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
