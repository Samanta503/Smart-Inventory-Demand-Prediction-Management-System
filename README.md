# 🏭 Smart Inventory & Demand Prediction Management System

A comprehensive full-stack web application for managing inventory across multiple warehouses, tracking sales and purchases with multi-item support, and monitoring stock levels. Built with **Next.js 14**, **MySQL 8.0+**, and modern React patterns.

![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange?style=flat-square&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Design](#-database-design)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)

---

## 🎯 Overview

The **Smart Inventory & Demand Prediction Management System** is designed to help businesses:

- 📦 Track products and inventory levels across **multiple warehouses**
- 🛒 Process **multi-item sales and purchases** with cart functionality
- 👥 Manage customers, suppliers, and users
- ⚠️ Receive automated alerts for low stock and out-of-stock items
- 📊 View real-time dashboard analytics and reports
- 📈 Monitor stock movements with complete audit trail

This system is perfect for **small to medium businesses** looking for an efficient way to manage their inventory across multiple locations.

---

## ✨ Features

### Multi-Warehouse Inventory Management
- **Product Management** - Add products with warehouse-specific stock allocation
- **Warehouse Stock Tracking** - View stock levels per warehouse for each product
- **Real-time Stock Updates** - Automatic stock adjustments via database triggers

### Multi-Item Transactions
- **Sales with Cart** - Add multiple products to a sale, select customer and warehouse
- **Purchases with Cart** - Record multi-item purchases from suppliers
- **Invoice Generation** - Automatic invoice/reference number generation

### Customer & Supplier Management
- **Customer Database** - Manage customer information for sales
- **Supplier Database** - Track supplier details and contacts
- **User Management** - Role-based users (Admin, Manager, Sales, Warehouse)

### Smart Alerts System
- **Low Stock Alerts** - Automatic notifications when stock falls below reorder level
- **Out of Stock Alerts** - Immediate alerts when warehouse stock reaches zero
- **Alert Resolution** - Mark alerts as resolved and track who resolved them

### Analytics Dashboard
- **Real-time Metrics** - Total products, inventory value, sales overview
- **Recent Activity** - Latest sales and top-selling products
- **Warehouse Summary** - Stock distribution across warehouses
- **Category Breakdown** - Inventory organized by category

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18.2, Next.js 14 (App Router) |
| **Backend** | Next.js API Routes (Node.js) |
| **Database** | MySQL 8.0+ |
| **DB Connection** | `mysql2` npm package with Connection Pooling |
| **Styling** | Custom CSS with CSS Variables |
| **Icons** | Emoji-based icons |

### Why This Stack?

- **Next.js App Router** - Modern React patterns with file-based routing
- **MySQL 8.0+** - Reliable, open-source database with triggers and stored procedures
- **mysql2 Package** - Fast MySQL driver with Promise support and connection pooling
- **No ORM** - Direct SQL queries for full control and learning purposes

---

## 🗄 Database Design

### 13 Tables Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           MASTER TABLES                                  │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────┤
│ Categories  │  Suppliers  │  Products   │  Customers  │  Warehouses     │
│             │             │             │             │                 │
│ CategoryID  │ SupplierID  │ ProductID   │ CustomerID  │ WarehouseID     │
│ Name        │ Name        │ ProductCode │ Name        │ Name            │
│ Description │ Contact     │ Name        │ Email       │ Address         │
└─────────────┴─────────────┴──────┬──────┴─────────────┴────────┬────────┘
                                   │                              │
                    ┌──────────────┴──────────────┐              │
                    ▼                             ▼              ▼
         ┌─────────────────┐           ┌─────────────────────────────┐
         │  ProductStocks  │           │        Users                │
         │  (M:N Junction) │           │                             │
         ├─────────────────┤           │ UserID, FullName, Username  │
         │ ProductID (PK)  │           │ Role (ADMIN/MANAGER/SALES)  │
         │ WarehouseID(PK) │           └─────────────────────────────┘
         │ OnHandQty       │
         │ ReservedQty     │
         └────────┬────────┘
                  │
    ┌─────────────┴─────────────┐
    ▼                           ▼
┌───────────────┐       ┌───────────────┐
│PurchaseHeaders│       │ SalesHeaders  │
├───────────────┤       ├───────────────┤
│ PurchaseID    │       │ SaleID        │
│ SupplierID    │       │ CustomerID    │
│ WarehouseID   │       │ WarehouseID   │
│ ReferenceNo   │       │ InvoiceNumber │
│ CreatedByUser │       │ CreatedByUser │
└───────┬───────┘       └───────┬───────┘
        │                       │
        ▼                       ▼
┌───────────────┐       ┌───────────────┐
│ PurchaseItems │       │  SalesItems   │
├───────────────┤       ├───────────────┤
│ PurchaseID    │       │ SaleID        │
│ ProductID     │       │ ProductID     │
│ Quantity      │       │ Quantity      │
│ UnitCost      │       │ UnitPrice     │
│ LineTotal     │       │ LineTotal     │
└───────────────┘       └───────────────┘

┌─────────────────┐     ┌─────────────────┐
│  StockLedger    │     │InventoryAlerts  │
├─────────────────┤     ├─────────────────┤
│ LedgerID        │     │ AlertID         │
│ ProductID       │     │ ProductID       │
│ WarehouseID     │     │ WarehouseID     │
│ Type (IN/OUT)   │     │ AlertType       │
│ Quantity        │     │ Message         │
│ PreviousStock   │     │ IsResolved      │
│ NewStock        │     │ ResolvedByUser  │
└─────────────────┘     └─────────────────┘
```

### Database Objects Summary

| Object Type | Count | Examples |
|-------------|-------|----------|
| **Tables** | 13 | Categories, Products, SalesHeaders, SalesItems, ProductStocks, etc. |
| **Views** | 2 | vw_LowStockProducts, vw_ProductInventorySummary |
| **Triggers** | 5 | Auto stock updates, ledger entries, alert generation |
| **Indexes** | 10 | Performance optimization indexes |

### Key Features

- **Multi-Item Transactions** - Sales and Purchases support multiple items per transaction
- **Warehouse-Level Stock** - ProductStocks tracks inventory per warehouse
- **Auto Stock Updates** - Triggers automatically update stock on purchase/sale
- **Stock Validation** - Prevents sales exceeding available warehouse stock
- **Complete Audit Trail** - StockLedger records every stock movement

---

## 📁 Project Structure

```
Smart-Inventory-Demand-Prediction-Management-System/
│
├── 📂 Smart Inventory, Demand Prediction Management System/
│   │
│   ├── 📂 app/                          # Next.js App Router
│   │   ├── 📂 api/                      # API Routes
│   │   │   ├── 📂 products/
│   │   │   │   ├── route.js             # GET/POST products
│   │   │   │   ├── 📂 low-stock/
│   │   │   │   └── 📂 dead-stock/
│   │   │   ├── 📂 categories/
│   │   │   ├── 📂 suppliers/
│   │   │   ├── 📂 customers/
│   │   │   ├── 📂 warehouses/
│   │   │   ├── 📂 users/
│   │   │   ├── 📂 purchases/            # Multi-item purchases
│   │   │   ├── 📂 sales/                # Multi-item sales
│   │   │   ├── 📂 alerts/
│   │   │   └── 📂 analytics/
│   │   │       ├── 📂 dashboard/
│   │   │       ├── 📂 monthly-sales/
│   │   │       └── 📂 supplier-performance/
│   │   │
│   │   ├── 📂 products/
│   │   │   ├── page.js                  # Products list with warehouse stock
│   │   │   └── 📂 add/page.js           # Add product with warehouse selection
│   │   │
│   │   ├── 📂 categories/page.js
│   │   ├── 📂 suppliers/page.js
│   │   ├── 📂 customers/page.js
│   │   ├── 📂 warehouses/page.js
│   │   │
│   │   ├── 📂 purchases/
│   │   │   ├── page.js                  # Purchases list
│   │   │   └── 📂 add/page.js           # Add purchase (multi-item cart)
│   │   │
│   │   ├── 📂 sales/
│   │   │   ├── page.js                  # Sales list
│   │   │   └── 📂 add/page.js           # New sale (multi-item cart)
│   │   │
│   │   ├── 📂 alerts/
│   │   │   ├── page.js                  # All alerts
│   │   │   ├── 📂 low-stock/page.js
│   │   │   └── 📂 dead-stock/page.js
│   │   │
│   │   ├── 📂 analytics/
│   │   │   └── 📂 sales/page.js         # Sales analytics
│   │   │
│   │   ├── globals.css                  # Global styles
│   │   ├── layout.js                    # Root layout with sidebar
│   │   └── page.js                      # Dashboard
│   │
│   ├── 📂 lib/
│   │   └── db.js                        # MySQL connection utility
│   │
│   ├── 📂 sql/
│   │   └── database_mysql.sql           # Complete MySQL database schema
│   │
│   ├── .env.local                       # Environment variables
│   ├── next.config.js
│   └── package.json
│
└── README.md
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18.0.0 or higher)
   - Download from: https://nodejs.org/

2. **MySQL Server** (8.0 or higher)
   - Options:
     - [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) (Free)
     - [XAMPP](https://www.apachefriends.org/) (Includes MySQL)
     - [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (GUI Tool)

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/smart-inventory-management.git
cd smart-inventory-management
cd "Smart Inventory, Demand Prediction Management System"
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up the Database

1. **Open MySQL Workbench or Command Line**

2. **Run the database script:**
   ```bash
   mysql -u root -p < sql/database_mysql.sql
   ```
   
   Or open `sql/database_mysql.sql` in MySQL Workbench and execute.

   This will:
   - Create the `SmartInventoryDB` database
   - Create all 13 tables with proper relationships
   - Set up triggers for automatic stock management
   - Insert sample data (categories, products, warehouses, etc.)

### Step 4: Configure Environment Variables

1. **Create `.env.local` file** with your database credentials:

   ```env
   # MySQL Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=SmartInventoryDB
   DB_USER=root
   DB_PASSWORD=your_password
   DB_CONNECTION_LIMIT=10
   ```

---

## ⚙️ Configuration

### Database Connection Settings

The database connection is configured in `lib/db.js`. Key settings:

| Setting | Description | Default |
|---------|-------------|---------|
| `host` | MySQL server hostname | `localhost` |
| `port` | MySQL server port | `3306` |
| `database` | Database name | `SmartInventoryDB` |
| `connectionLimit` | Max pool connections | `10` |

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | MySQL server host | Yes |
| `DB_PORT` | MySQL server port | No (default: 3306) |
| `DB_DATABASE` | Database name | Yes |
| `DB_USER` | Database username | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `DB_CONNECTION_LIMIT` | Connection pool size | No (default: 10) |

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

---

## 📡 API Reference

### Products API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products with warehouse stock |
| POST | `/api/products` | Create new product with warehouse allocation |
| GET | `/api/products/low-stock` | Get low stock products |
| GET | `/api/products/dead-stock` | Get dead stock (no sales in 90+ days) |

### Sales API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | Get all sales with items |
| POST | `/api/sales` | Create new sale (multi-item) |

### Purchases API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/purchases` | Get all purchases with items |
| POST | `/api/purchases` | Create new purchase (multi-item) |

### Other APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/categories` | Manage categories |
| GET/POST | `/api/suppliers` | Manage suppliers |
| GET/POST | `/api/customers` | Manage customers |
| GET/POST | `/api/warehouses` | Manage warehouses |
| GET/PATCH | `/api/alerts` | Get and resolve alerts |
| GET | `/api/analytics/dashboard` | Dashboard statistics |
| GET | `/api/analytics/monthly-sales` | Monthly sales data |

---

## 🖼 Screenshots

### Dashboard
- Real-time inventory statistics
- Sales overview for current month
- Recent sales and top products
- Warehouse stock distribution

### Products Page
- Product listing with warehouse stock breakdown
- Stock status indicators (In Stock, Low Stock, Out of Stock)
- Quick add product functionality

### New Sale Page
- Customer and warehouse selection
- Multi-item cart with product search
- Real-time total calculation
- Stock validation per warehouse

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [MySQL](https://www.mysql.com/)
- Icons from Emoji
