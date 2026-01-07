# 🏭 Smart Inventory & Demand Prediction Management System

A comprehensive full-stack web application for managing inventory, tracking sales, and predicting demand patterns. Built with **Next.js 14**, **MS SQL Server**, and modern React patterns.

![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![MS SQL Server](https://img.shields.io/badge/MS%20SQL%20Server-2019+-red?style=flat-square&logo=microsoft-sql-server)
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
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## 🎯 Overview

The **Smart Inventory & Demand Prediction Management System** is designed to help businesses:

- 📦 Track products and inventory levels in real-time
- 📊 Analyze sales patterns and predict demand
- ⚠️ Receive automated alerts for low stock and dead stock
- 🤝 Manage supplier relationships and track performance
- 💰 Monitor revenue and cost analytics

This system is perfect for **small to medium businesses** looking for an efficient way to manage their inventory without the complexity of enterprise solutions.

---

## ✨ Features

### Core Inventory Management
- **Product Management** - Add, view, and manage products with detailed information
- **Category Organization** - Organize products into logical categories
- **Supplier Management** - Track supplier details and contact information
- **Stock Tracking** - Real-time stock level monitoring with automatic updates

### Stock Transactions
- **Purchases (Stock In)** - Record incoming inventory from suppliers
- **Sales (Stock Out)** - Process sales with automatic stock deduction
- **Stock Ledger** - Complete audit trail of all stock movements

### Smart Alerts System
- **Low Stock Alerts** - Automatic notifications when stock falls below threshold
- **Dead Stock Detection** - Identify products with no sales in 90+ days
- **Alert Management** - Mark alerts as resolved and track resolution

### Analytics & Reporting
- **Dashboard Overview** - At-a-glance metrics and KPIs
- **Monthly Sales Analysis** - Track revenue trends over time
- **Supplier Performance Scoring** - Evaluate suppliers based on orders and volume
- **Demand Prediction** - Identify fast-moving and slow-moving products

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18.2, Next.js 14 (App Router) |
| **Backend** | Next.js API Routes (Node.js) |
| **Database** | Microsoft SQL Server |
| **DB Connection** | `mssql` npm package (No ORM) |
| **Styling** | Custom CSS with CSS Variables |
| **Icons** | Emoji-based icons |

### Why This Stack?

- **Next.js App Router** - Modern React patterns with server components and file-based routing
- **MS SQL Server** - Enterprise-grade reliability with advanced features (triggers, stored procedures)
- **No ORM** - Direct SQL queries for full control and learning purposes
- **mssql Package** - Efficient connection pooling and parameterized queries for security

---

## 🗄 Database Design

### Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Categories │     │  Suppliers  │     │  Products   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ CategoryID  │◄────│ SupplierID  │◄────│ ProductID   │
│ Name        │     │ Name        │     │ Name        │
│ Description │     │ Contact     │     │ CategoryID  │
│ CreatedAt   │     │ Email       │     │ SupplierID  │
└─────────────┘     │ Phone       │     │ CurrentStock│
                    │ Address     │     │ ReorderLevel│
                    └─────────────┘     │ UnitPrice   │
                                        └──────┬──────┘
                                               │
                    ┌──────────────────────────┴──────────────────────────┐
                    │                                                     │
              ┌─────▼─────┐                                        ┌──────▼─────┐
              │ Purchases │                                        │   Sales    │
              ├───────────┤                                        ├────────────┤
              │PurchaseID │                                        │ SaleID     │
              │ProductID  │──────┐                      ┌──────────│ProductID   │
              │SupplierID │      │                      │          │ Quantity   │
              │ Quantity  │      │    ┌─────────────┐   │          │ UnitPrice  │
              │ UnitCost  │      └────►StockLedger  ◄───┘          │ TotalPrice │
              └───────────┘           ├─────────────┤              └────────────┘
                                      │ LedgerID    │
                                      │ ProductID   │
                                      │ Type (IN/OUT│
                                      │ Quantity    │
                                      │ Reference   │
                                      └─────────────┘

              ┌─────────────────┐
              │InventoryAlerts │
              ├─────────────────┤
              │ AlertID         │
              │ ProductID       │
              │ AlertType       │
              │ Message         │
              │ IsResolved      │
              └─────────────────┘
```

### Database Objects

| Object Type | Name | Purpose |
|-------------|------|---------|
| **Table** | Categories | Product categories |
| **Table** | Suppliers | Supplier information |
| **Table** | Products | Product details and stock |
| **Table** | Purchases | Stock-in transactions |
| **Table** | Sales | Stock-out transactions |
| **Table** | StockLedger | Audit trail of movements |
| **Table** | InventoryAlerts | System alerts |
| **Trigger** | trg_AfterPurchaseInsert | Auto-update stock on purchase |
| **Trigger** | trg_AfterSaleInsert | Auto-update stock on sale |
| **View** | vw_LowStockProducts | Products below reorder level |
| **View** | vw_ProductInventorySummary | Product summary with category |
| **View** | vw_MonthlySalesSummary | Monthly sales aggregation |
| **View** | vw_SupplierPerformance | Supplier metrics |
| **Procedure** | sp_GetDeadStock | Find products with no recent sales |
| **Procedure** | sp_GetMonthlySalesAnalysis | Sales trend analysis |
| **Procedure** | sp_GetSupplierPerformanceScore | Supplier scoring |

---

## 📁 Project Structure

```
Smart-Inventory-Demand-Prediction-Management-System/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📂 api/                      # API Routes
│   │   ├── 📂 products/
│   │   │   ├── route.js             # GET/POST products
│   │   │   ├── 📂 low-stock/route.js
│   │   │   └── 📂 dead-stock/route.js
│   │   ├── 📂 categories/route.js
│   │   ├── 📂 suppliers/route.js
│   │   ├── 📂 purchases/route.js
│   │   ├── 📂 sales/route.js
│   │   ├── 📂 alerts/route.js
│   │   └── 📂 analytics/
│   │       ├── 📂 dashboard/route.js
│   │       ├── 📂 monthly-sales/route.js
│   │       └── 📂 supplier-performance/route.js
│   │
│   ├── 📂 products/
│   │   ├── page.js                  # Products list
│   │   └── 📂 add/page.js           # Add product
│   │
│   ├── 📂 categories/page.js        # Categories management
│   ├── 📂 suppliers/page.js         # Suppliers management
│   │
│   ├── 📂 purchases/
│   │   ├── page.js                  # Purchases list
│   │   └── 📂 add/page.js           # Add purchase
│   │
│   ├── 📂 sales/
│   │   ├── page.js                  # Sales list
│   │   └── 📂 add/page.js           # New sale
│   │
│   ├── 📂 alerts/
│   │   ├── page.js                  # All alerts
│   │   ├── 📂 low-stock/page.js
│   │   └── 📂 dead-stock/page.js
│   │
│   ├── 📂 analytics/
│   │   └── 📂 sales/page.js         # Sales analytics
│   │
│   ├── globals.css                  # Global styles
│   ├── layout.js                    # Root layout with sidebar
│   └── page.js                      # Dashboard
│
├── 📂 lib/
│   └── db.js                        # Database connection utility
│
├── 📂 sql/
│   └── database.sql                 # Complete database schema
│
├── .env.local.example               # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18.0.0 or higher)
   - Download from: https://nodejs.org/

2. **Microsoft SQL Server** (2019 or higher)
   - Options:
     - [SQL Server Express](https://www.microsoft.com/sql-server/sql-server-downloads) (Free)
     - [SQL Server Developer Edition](https://www.microsoft.com/sql-server/sql-server-downloads) (Free for development)
     - Azure SQL Database

3. **SQL Server Management Studio (SSMS)** (Recommended)
   - Download from: https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms

4. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/smart-inventory-management.git
cd smart-inventory-management
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up the Database

1. **Open SQL Server Management Studio (SSMS)**

2. **Connect to your SQL Server instance**

3. **Create a new database:**
   ```sql
   CREATE DATABASE SmartInventoryDB;
   ```

4. **Run the database script:**
   - Open the file `sql/database.sql`
   - Execute the entire script in SSMS
   - This will create all tables, triggers, views, stored procedures, and sample data

### Step 4: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   copy .env.local.example .env.local
   ```

2. **Edit `.env.local` with your database credentials:**
   ```env
   DB_SERVER=localhost
   DB_NAME=SmartInventoryDB
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_PORT=1433
   ```

   > **Note:** If using Windows Authentication, you may need to modify the connection settings in `lib/db.js`

---

## ⚙️ Configuration

### Database Connection Settings

The database connection is configured in `lib/db.js`. Key settings:

| Setting | Description | Default |
|---------|-------------|---------|
| `server` | SQL Server hostname | `localhost` |
| `database` | Database name | `SmartInventoryDB` |
| `port` | SQL Server port | `1433` |
| `pool.max` | Max connection pool size | `10` |
| `pool.min` | Min connection pool size | `0` |
| `pool.idleTimeoutMillis` | Idle connection timeout | `30000` |

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_SERVER` | SQL Server host | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database username | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `DB_PORT` | SQL Server port | No (default: 1433) |

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

### Products

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all products |
| `/api/products` | POST | Create new product |
| `/api/products/low-stock` | GET | Get low stock products |
| `/api/products/dead-stock` | GET | Get dead stock (no sales in 90 days) |

### Categories

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/categories` | GET | Get all categories |
| `/api/categories` | POST | Create new category |

### Suppliers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/suppliers` | GET | Get all suppliers |
| `/api/suppliers` | POST | Create new supplier |

### Purchases

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/purchases` | GET | Get all purchases |
| `/api/purchases` | POST | Record new purchase |

### Sales

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sales` | GET | Get all sales |
| `/api/sales` | POST | Record new sale |

### Alerts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/alerts` | GET | Get all alerts |
| `/api/alerts` | PATCH | Update alert status |

### Analytics

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/dashboard` | GET | Get dashboard statistics |
| `/api/analytics/monthly-sales` | GET | Get monthly sales data |
| `/api/analytics/supplier-performance` | GET | Get supplier performance scores |

---

## 🖼 Screenshots

### Dashboard
The main dashboard provides an overview of key metrics:
- Total Products, Categories, Suppliers
- Low Stock Items count
- Recent Sales
- Top Selling Products

### Products Management
- View all products with search and filtering
- Add new products with category and supplier selection
- Track stock levels with visual indicators

### Alerts System
- Low stock warnings with urgency levels
- Dead stock identification
- One-click alert resolution

### Analytics
- Monthly revenue trends
- Sales velocity metrics
- Supplier performance scoring

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style Guidelines

- Use meaningful variable and function names
- Add comments explaining complex logic
- Follow existing code patterns
- Test your changes before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Microsoft SQL Server](https://www.microsoft.com/sql-server)
- Icons from [Emoji](https://emojipedia.org/)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ for learning backend development

</div>
