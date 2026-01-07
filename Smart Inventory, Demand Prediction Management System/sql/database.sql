/*
==========================================================================
  SMART INVENTORY & DEMAND PREDICTION MANAGEMENT SYSTEM
  Database Schema for MS SQL Server
==========================================================================

  This script creates:
  1. Database and tables with proper relationships
  2. Triggers for automatic stock updates and alerts
  3. Views for reporting
  4. Sample queries for dead-stock detection

  HOW TO RUN:
  1. Open SQL Server Management Studio (SSMS)
  2. Connect to your SQL Server instance
  3. Open this file and execute (F5)

==========================================================================
*/

-- ========================================================================
-- STEP 1: CREATE DATABASE
-- ========================================================================

-- Check if database exists, if so drop it (CAREFUL: This deletes all data!)
-- Comment out these lines if you want to keep existing data
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'SmartInventoryDB')
BEGIN
    ALTER DATABASE SmartInventoryDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SmartInventoryDB;
END
GO

-- Create fresh database
CREATE DATABASE SmartInventoryDB;
GO

-- Switch to our new database
USE SmartInventoryDB;
GO

-- ========================================================================
-- STEP 2: CREATE TABLES
-- ========================================================================

/*
  CATEGORIES TABLE
  ----------------
  Stores product categories (e.g., Electronics, Clothing, Food)
  This is a lookup table referenced by Products
*/
CREATE TABLE Categories (
    -- Primary key: Auto-incrementing ID
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    
    -- Category name must be unique and not empty
    CategoryName NVARCHAR(100) NOT NULL UNIQUE,
    
    -- Optional description
    Description NVARCHAR(500) NULL,
    
    -- Track when record was created
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    -- Track when record was last updated
    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO

/*
  SUPPLIERS TABLE
  ---------------
  Stores information about product suppliers/vendors
  Referenced by Products and Purchases
*/
CREATE TABLE Suppliers (
    -- Primary key: Auto-incrementing ID
    SupplierID INT PRIMARY KEY IDENTITY(1,1),
    
    -- Supplier company name (required)
    SupplierName NVARCHAR(200) NOT NULL,
    
    -- Contact person name
    ContactPerson NVARCHAR(100) NULL,
    
    -- Email for communication
    Email NVARCHAR(100) NULL,
    
    -- Phone number
    Phone NVARCHAR(20) NULL,
    
    -- Physical address
    Address NVARCHAR(500) NULL,
    
    -- City location
    City NVARCHAR(100) NULL,
    
    -- Country
    Country NVARCHAR(100) NULL,
    
    -- Is this supplier currently active?
    IsActive BIT DEFAULT 1,
    
    -- Timestamps
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO

/*
  PRODUCTS TABLE
  --------------
  Core table storing all product information
  Links to Categories and Suppliers
*/
CREATE TABLE Products (
    -- Primary key: Auto-incrementing ID
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    
    -- Unique product code/SKU (Stock Keeping Unit)
    ProductCode NVARCHAR(50) NOT NULL UNIQUE,
    
    -- Product name (required)
    ProductName NVARCHAR(200) NOT NULL,
    
    -- Detailed description
    Description NVARCHAR(1000) NULL,
    
    -- Foreign key to Categories table
    CategoryID INT NOT NULL,
    
    -- Foreign key to Suppliers table
    SupplierID INT NOT NULL,
    
    -- Unit of measurement (e.g., pieces, kg, liters)
    Unit NVARCHAR(20) DEFAULT 'pieces',
    
    -- Cost price (what we pay to supplier)
    CostPrice DECIMAL(10, 2) NOT NULL CHECK (CostPrice >= 0),
    
    -- Selling price (what customer pays)
    SellingPrice DECIMAL(10, 2) NOT NULL CHECK (SellingPrice >= 0),
    
    -- Current stock quantity
    CurrentStock INT DEFAULT 0 CHECK (CurrentStock >= 0),
    
    -- Minimum stock level before reorder alert
    ReorderLevel INT DEFAULT 10 CHECK (ReorderLevel >= 0),
    
    -- Is product currently available for sale?
    IsActive BIT DEFAULT 1,
    
    -- Timestamps
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    
    -- Foreign key constraints
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryID) 
        REFERENCES Categories(CategoryID),
    CONSTRAINT FK_Products_Suppliers FOREIGN KEY (SupplierID) 
        REFERENCES Suppliers(SupplierID),
    
    -- Ensure selling price is not less than cost (basic business rule)
    CONSTRAINT CHK_Price CHECK (SellingPrice >= CostPrice)
);
GO

/*
  PURCHASES TABLE
  ---------------
  Records stock-in transactions (when we buy from suppliers)
  Each purchase increases product stock
*/
CREATE TABLE Purchases (
    -- Primary key: Auto-incrementing ID
    PurchaseID INT PRIMARY KEY IDENTITY(1,1),
    
    -- Reference to the product purchased
    ProductID INT NOT NULL,
    
    -- Reference to supplier (who we bought from)
    SupplierID INT NOT NULL,
    
    -- Quantity purchased
    Quantity INT NOT NULL CHECK (Quantity > 0),
    
    -- Price per unit at time of purchase
    UnitCost DECIMAL(10, 2) NOT NULL CHECK (UnitCost >= 0),
    
    -- Total cost = Quantity * UnitCost (computed for convenience)
    TotalCost AS (Quantity * UnitCost) PERSISTED,
    
    -- Date of purchase
    PurchaseDate DATETIME DEFAULT GETDATE(),
    
    -- Invoice or reference number from supplier
    ReferenceNumber NVARCHAR(50) NULL,
    
    -- Any additional notes
    Notes NVARCHAR(500) NULL,
    
    -- Who recorded this purchase
    CreatedBy NVARCHAR(100) NULL,
    
    -- When record was created
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    -- Foreign key constraints
    CONSTRAINT FK_Purchases_Products FOREIGN KEY (ProductID) 
        REFERENCES Products(ProductID),
    CONSTRAINT FK_Purchases_Suppliers FOREIGN KEY (SupplierID) 
        REFERENCES Suppliers(SupplierID)
);
GO

/*
  SALES TABLE
  -----------
  Records stock-out transactions (when customers buy from us)
  Each sale decreases product stock
*/
CREATE TABLE Sales (
    -- Primary key: Auto-incrementing ID
    SaleID INT PRIMARY KEY IDENTITY(1,1),
    
    -- Reference to the product sold
    ProductID INT NOT NULL,
    
    -- Quantity sold
    Quantity INT NOT NULL CHECK (Quantity > 0),
    
    -- Price per unit at time of sale
    UnitPrice DECIMAL(10, 2) NOT NULL CHECK (UnitPrice >= 0),
    
    -- Total sale amount = Quantity * UnitPrice (computed)
    TotalAmount AS (Quantity * UnitPrice) PERSISTED,
    
    -- Date and time of sale
    SaleDate DATETIME DEFAULT GETDATE(),
    
    -- Customer name (optional for walk-in customers)
    CustomerName NVARCHAR(200) NULL,
    
    -- Invoice number for this sale
    InvoiceNumber NVARCHAR(50) NULL,
    
    -- Any notes about the sale
    Notes NVARCHAR(500) NULL,
    
    -- Who processed this sale
    CreatedBy NVARCHAR(100) NULL,
    
    -- When record was created
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    -- Foreign key constraint
    CONSTRAINT FK_Sales_Products FOREIGN KEY (ProductID) 
        REFERENCES Products(ProductID)
);
GO

/*
  STOCK LEDGER TABLE
  ------------------
  Tracks all stock movements (both in and out)
  Useful for audit trail and stock reconciliation
*/
CREATE TABLE StockLedger (
    -- Primary key: Auto-incrementing ID
    LedgerID INT PRIMARY KEY IDENTITY(1,1),
    
    -- Reference to the product
    ProductID INT NOT NULL,
    
    -- Type of transaction: 'IN' for purchase, 'OUT' for sale
    TransactionType NVARCHAR(10) NOT NULL CHECK (TransactionType IN ('IN', 'OUT')),
    
    -- Quantity moved (always positive)
    Quantity INT NOT NULL CHECK (Quantity > 0),
    
    -- Stock level before this transaction
    PreviousStock INT NOT NULL,
    
    -- Stock level after this transaction
    NewStock INT NOT NULL,
    
    -- Reference to Purchase or Sale ID
    ReferenceID INT NOT NULL,
    
    -- Which table the reference points to
    ReferenceType NVARCHAR(20) NOT NULL CHECK (ReferenceType IN ('Purchase', 'Sale')),
    
    -- When this transaction occurred
    TransactionDate DATETIME DEFAULT GETDATE(),
    
    -- Any notes
    Notes NVARCHAR(500) NULL,
    
    -- Foreign key constraint
    CONSTRAINT FK_StockLedger_Products FOREIGN KEY (ProductID) 
        REFERENCES Products(ProductID)
);
GO

/*
  INVENTORY ALERTS TABLE
  ----------------------
  Stores alerts for low stock, out of stock, etc.
  Helps users know when to reorder products
*/
CREATE TABLE InventoryAlerts (
    -- Primary key: Auto-incrementing ID
    AlertID INT PRIMARY KEY IDENTITY(1,1),
    
    -- Reference to the product
    ProductID INT NOT NULL,
    
    -- Type of alert: 'LOW_STOCK', 'OUT_OF_STOCK', 'DEAD_STOCK'
    AlertType NVARCHAR(20) NOT NULL 
        CHECK (AlertType IN ('LOW_STOCK', 'OUT_OF_STOCK', 'DEAD_STOCK')),
    
    -- Detailed alert message
    Message NVARCHAR(500) NOT NULL,
    
    -- Current stock at time of alert
    CurrentStock INT NOT NULL,
    
    -- Reorder level at time of alert
    ReorderLevel INT NOT NULL,
    
    -- Has this alert been acknowledged/resolved?
    IsResolved BIT DEFAULT 0,
    
    -- When was it resolved?
    ResolvedAt DATETIME NULL,
    
    -- Who resolved it?
    ResolvedBy NVARCHAR(100) NULL,
    
    -- When alert was created
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    -- Foreign key constraint
    CONSTRAINT FK_InventoryAlerts_Products FOREIGN KEY (ProductID) 
        REFERENCES Products(ProductID)
);
GO

-- ========================================================================
-- STEP 3: CREATE INDEXES FOR BETTER PERFORMANCE
-- ========================================================================

-- Index for faster product lookups by category
CREATE INDEX IX_Products_CategoryID ON Products(CategoryID);

-- Index for faster product lookups by supplier
CREATE INDEX IX_Products_SupplierID ON Products(SupplierID);

-- Index for faster sales queries by date
CREATE INDEX IX_Sales_SaleDate ON Sales(SaleDate);

-- Index for faster sales queries by product
CREATE INDEX IX_Sales_ProductID ON Sales(ProductID);

-- Index for faster purchase queries by product
CREATE INDEX IX_Purchases_ProductID ON Purchases(ProductID);

-- Index for unresolved alerts
CREATE INDEX IX_InventoryAlerts_Unresolved ON InventoryAlerts(IsResolved) 
    WHERE IsResolved = 0;
GO

-- ========================================================================
-- STEP 4: CREATE TRIGGERS
-- ========================================================================

/*
  TRIGGER: Update Stock After Purchase (Stock In)
  ------------------------------------------------
  Automatically increases product stock when a purchase is recorded
  Also logs the transaction in StockLedger
*/
CREATE TRIGGER trg_AfterPurchaseInsert
ON Purchases
AFTER INSERT
AS
BEGIN
    -- Prevent extra result sets from interfering
    SET NOCOUNT ON;
    
    -- Declare variables to hold values from inserted record
    DECLARE @ProductID INT;
    DECLARE @Quantity INT;
    DECLARE @PurchaseID INT;
    DECLARE @PreviousStock INT;
    DECLARE @NewStock INT;
    
    -- Get values from the newly inserted purchase
    SELECT 
        @ProductID = ProductID,
        @Quantity = Quantity,
        @PurchaseID = PurchaseID
    FROM inserted;
    
    -- Get current stock before update
    SELECT @PreviousStock = CurrentStock 
    FROM Products 
    WHERE ProductID = @ProductID;
    
    -- Calculate new stock
    SET @NewStock = @PreviousStock + @Quantity;
    
    -- Update product stock (increase)
    UPDATE Products
    SET 
        CurrentStock = @NewStock,
        UpdatedAt = GETDATE()
    WHERE ProductID = @ProductID;
    
    -- Log in StockLedger for audit trail
    INSERT INTO StockLedger (
        ProductID, 
        TransactionType, 
        Quantity, 
        PreviousStock, 
        NewStock, 
        ReferenceID, 
        ReferenceType,
        Notes
    )
    VALUES (
        @ProductID,
        'IN',
        @Quantity,
        @PreviousStock,
        @NewStock,
        @PurchaseID,
        'Purchase',
        'Stock increased from purchase'
    );
END;
GO

/*
  TRIGGER: Update Stock After Sale (Stock Out) + Low Stock Alert
  ---------------------------------------------------------------
  Automatically decreases product stock when a sale is recorded
  Logs the transaction in StockLedger
  Creates alert if stock falls below reorder level
*/
CREATE TRIGGER trg_AfterSaleInsert
ON Sales
AFTER INSERT
AS
BEGIN
    -- Prevent extra result sets from interfering
    SET NOCOUNT ON;
    
    -- Declare variables
    DECLARE @ProductID INT;
    DECLARE @Quantity INT;
    DECLARE @SaleID INT;
    DECLARE @PreviousStock INT;
    DECLARE @NewStock INT;
    DECLARE @ReorderLevel INT;
    DECLARE @ProductName NVARCHAR(200);
    
    -- Get values from the newly inserted sale
    SELECT 
        @ProductID = ProductID,
        @Quantity = Quantity,
        @SaleID = SaleID
    FROM inserted;
    
    -- Get current stock and reorder level
    SELECT 
        @PreviousStock = CurrentStock,
        @ReorderLevel = ReorderLevel,
        @ProductName = ProductName
    FROM Products 
    WHERE ProductID = @ProductID;
    
    -- Check if enough stock is available
    IF @PreviousStock < @Quantity
    BEGIN
        -- Rollback the transaction if not enough stock
        RAISERROR('Insufficient stock. Available: %d, Requested: %d', 16, 1, 
            @PreviousStock, @Quantity);
        ROLLBACK TRANSACTION;
        RETURN;
    END
    
    -- Calculate new stock
    SET @NewStock = @PreviousStock - @Quantity;
    
    -- Update product stock (decrease)
    UPDATE Products
    SET 
        CurrentStock = @NewStock,
        UpdatedAt = GETDATE()
    WHERE ProductID = @ProductID;
    
    -- Log in StockLedger for audit trail
    INSERT INTO StockLedger (
        ProductID, 
        TransactionType, 
        Quantity, 
        PreviousStock, 
        NewStock, 
        ReferenceID, 
        ReferenceType,
        Notes
    )
    VALUES (
        @ProductID,
        'OUT',
        @Quantity,
        @PreviousStock,
        @NewStock,
        @SaleID,
        'Sale',
        'Stock decreased from sale'
    );
    
    -- Check if stock is below reorder level and create alert
    IF @NewStock <= @ReorderLevel
    BEGIN
        -- Check if there's already an unresolved alert for this product
        IF NOT EXISTS (
            SELECT 1 
            FROM InventoryAlerts 
            WHERE ProductID = @ProductID 
              AND AlertType = 'LOW_STOCK' 
              AND IsResolved = 0
        )
        BEGIN
            -- Create new low stock alert
            INSERT INTO InventoryAlerts (
                ProductID,
                AlertType,
                Message,
                CurrentStock,
                ReorderLevel
            )
            VALUES (
                @ProductID,
                CASE 
                    WHEN @NewStock = 0 THEN 'OUT_OF_STOCK'
                    ELSE 'LOW_STOCK'
                END,
                CASE 
                    WHEN @NewStock = 0 
                    THEN 'Product "' + @ProductName + '" is OUT OF STOCK!'
                    ELSE 'Product "' + @ProductName + '" is running low. Current stock: ' 
                         + CAST(@NewStock AS NVARCHAR(10)) + ', Reorder level: ' 
                         + CAST(@ReorderLevel AS NVARCHAR(10))
                END,
                @NewStock,
                @ReorderLevel
            );
        END
    END
END;
GO

-- ========================================================================
-- STEP 5: CREATE VIEWS
-- ========================================================================

/*
  VIEW: Low Stock Products
  ------------------------
  Shows all products where current stock is at or below reorder level
  Useful for quick inventory checks
*/
CREATE VIEW vw_LowStockProducts
AS
SELECT 
    p.ProductID,
    p.ProductCode,
    p.ProductName,
    c.CategoryName,
    s.SupplierName,
    p.CurrentStock,
    p.ReorderLevel,
    (p.ReorderLevel - p.CurrentStock) AS UnitsNeeded,
    p.CostPrice,
    p.SellingPrice,
    p.Unit,
    CASE 
        WHEN p.CurrentStock = 0 THEN 'OUT OF STOCK'
        WHEN p.CurrentStock <= p.ReorderLevel / 2 THEN 'CRITICAL'
        ELSE 'LOW'
    END AS StockStatus
FROM Products p
INNER JOIN Categories c ON p.CategoryID = c.CategoryID
INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID
WHERE p.CurrentStock <= p.ReorderLevel
  AND p.IsActive = 1;
GO

/*
  VIEW: Product Inventory Summary
  -------------------------------
  Comprehensive view of all products with their current status
*/
CREATE VIEW vw_ProductInventorySummary
AS
SELECT 
    p.ProductID,
    p.ProductCode,
    p.ProductName,
    p.Description,
    c.CategoryName,
    s.SupplierName,
    p.Unit,
    p.CostPrice,
    p.SellingPrice,
    (p.SellingPrice - p.CostPrice) AS ProfitMargin,
    p.CurrentStock,
    p.ReorderLevel,
    (p.CurrentStock * p.CostPrice) AS StockValue,
    CASE 
        WHEN p.CurrentStock = 0 THEN 'Out of Stock'
        WHEN p.CurrentStock <= p.ReorderLevel THEN 'Low Stock'
        ELSE 'In Stock'
    END AS StockStatus,
    p.IsActive,
    p.CreatedAt,
    p.UpdatedAt
FROM Products p
INNER JOIN Categories c ON p.CategoryID = c.CategoryID
INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID;
GO

/*
  VIEW: Monthly Sales Summary
  ---------------------------
  Aggregates sales data by month for trend analysis
*/
CREATE VIEW vw_MonthlySalesSummary
AS
SELECT 
    YEAR(s.SaleDate) AS SaleYear,
    MONTH(s.SaleDate) AS SaleMonth,
    DATENAME(MONTH, s.SaleDate) AS MonthName,
    COUNT(DISTINCT s.SaleID) AS TotalTransactions,
    SUM(s.Quantity) AS TotalUnitsSold,
    SUM(s.TotalAmount) AS TotalRevenue,
    AVG(s.TotalAmount) AS AverageTransactionValue
FROM Sales s
GROUP BY 
    YEAR(s.SaleDate),
    MONTH(s.SaleDate),
    DATENAME(MONTH, s.SaleDate);
GO

/*
  VIEW: Supplier Performance
  --------------------------
  Shows supplier metrics for performance evaluation
*/
CREATE VIEW vw_SupplierPerformance
AS
SELECT 
    s.SupplierID,
    s.SupplierName,
    s.ContactPerson,
    s.Email,
    s.Phone,
    COUNT(DISTINCT p.ProductID) AS TotalProducts,
    SUM(p.CurrentStock) AS TotalStockSupplied,
    SUM(p.CurrentStock * p.CostPrice) AS TotalInventoryValue,
    COUNT(DISTINCT pur.PurchaseID) AS TotalPurchaseOrders,
    SUM(pur.TotalCost) AS TotalPurchaseValue,
    s.IsActive
FROM Suppliers s
LEFT JOIN Products p ON s.SupplierID = p.SupplierID
LEFT JOIN Purchases pur ON s.SupplierID = pur.SupplierID
GROUP BY 
    s.SupplierID,
    s.SupplierName,
    s.ContactPerson,
    s.Email,
    s.Phone,
    s.IsActive;
GO

-- ========================================================================
-- STEP 6: CREATE STORED PROCEDURES
-- ========================================================================

/*
  STORED PROCEDURE: Get Dead Stock Products
  -----------------------------------------
  Returns products that have not been sold in the last N days (default 90)
  These are considered "dead stock" and may need clearance sales
*/
CREATE PROCEDURE sp_GetDeadStock
    @DaysWithoutSale INT = 90
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName,
        s.SupplierName,
        p.CurrentStock,
        p.CostPrice,
        p.SellingPrice,
        (p.CurrentStock * p.CostPrice) AS DeadStockValue,
        MAX(sa.SaleDate) AS LastSaleDate,
        DATEDIFF(DAY, MAX(sa.SaleDate), GETDATE()) AS DaysSinceLastSale
    FROM Products p
    INNER JOIN Categories c ON p.CategoryID = c.CategoryID
    INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID
    LEFT JOIN Sales sa ON p.ProductID = sa.ProductID
    WHERE p.IsActive = 1
      AND p.CurrentStock > 0
    GROUP BY 
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName,
        s.SupplierName,
        p.CurrentStock,
        p.CostPrice,
        p.SellingPrice
    HAVING 
        MAX(sa.SaleDate) IS NULL  -- Never sold
        OR DATEDIFF(DAY, MAX(sa.SaleDate), GETDATE()) >= @DaysWithoutSale
    ORDER BY DaysSinceLastSale DESC;
END;
GO

/*
  STORED PROCEDURE: Get Monthly Sales Analysis
  --------------------------------------------
  Returns detailed monthly sales breakdown
*/
CREATE PROCEDURE sp_GetMonthlySalesAnalysis
    @Year INT = NULL,
    @Month INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Default to current year if not provided
    IF @Year IS NULL
        SET @Year = YEAR(GETDATE());
    
    SELECT 
        YEAR(s.SaleDate) AS SaleYear,
        MONTH(s.SaleDate) AS SaleMonth,
        DATENAME(MONTH, s.SaleDate) AS MonthName,
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName,
        SUM(s.Quantity) AS UnitsSold,
        SUM(s.TotalAmount) AS Revenue,
        SUM(s.Quantity * p.CostPrice) AS Cost,
        SUM(s.TotalAmount) - SUM(s.Quantity * p.CostPrice) AS Profit
    FROM Sales s
    INNER JOIN Products p ON s.ProductID = p.ProductID
    INNER JOIN Categories c ON p.CategoryID = c.CategoryID
    WHERE YEAR(s.SaleDate) = @Year
      AND (@Month IS NULL OR MONTH(s.SaleDate) = @Month)
    GROUP BY 
        YEAR(s.SaleDate),
        MONTH(s.SaleDate),
        DATENAME(MONTH, s.SaleDate),
        p.ProductID,
        p.ProductCode,
        p.ProductName,
        c.CategoryName
    ORDER BY 
        SaleYear,
        SaleMonth,
        Revenue DESC;
END;
GO

/*
  STORED PROCEDURE: Calculate Supplier Performance Score
  ------------------------------------------------------
  Calculates a performance score for each supplier based on:
  - Number of products supplied
  - Total inventory value
  - Purchase consistency
*/
CREATE PROCEDURE sp_GetSupplierPerformanceScore
AS
BEGIN
    SET NOCOUNT ON;
    
    ;WITH SupplierMetrics AS (
        SELECT 
            s.SupplierID,
            s.SupplierName,
            COUNT(DISTINCT p.ProductID) AS ProductCount,
            ISNULL(SUM(p.CurrentStock * p.CostPrice), 0) AS InventoryValue,
            COUNT(DISTINCT pur.PurchaseID) AS PurchaseCount,
            ISNULL(SUM(pur.TotalCost), 0) AS TotalPurchaseValue,
            -- Calculate months since first purchase
            DATEDIFF(MONTH, MIN(pur.PurchaseDate), GETDATE()) AS MonthsActive
        FROM Suppliers s
        LEFT JOIN Products p ON s.SupplierID = p.SupplierID AND p.IsActive = 1
        LEFT JOIN Purchases pur ON s.SupplierID = pur.SupplierID
        WHERE s.IsActive = 1
        GROUP BY s.SupplierID, s.SupplierName
    ),
    ScoredSuppliers AS (
        SELECT 
            *,
            -- Calculate composite score (0-100)
            CAST(
                (
                    -- Product variety score (max 30 points)
                    CASE 
                        WHEN ProductCount >= 10 THEN 30
                        WHEN ProductCount >= 5 THEN 20
                        WHEN ProductCount >= 1 THEN 10
                        ELSE 0
                    END
                    +
                    -- Inventory value score (max 30 points)
                    CASE 
                        WHEN InventoryValue >= 100000 THEN 30
                        WHEN InventoryValue >= 50000 THEN 20
                        WHEN InventoryValue >= 10000 THEN 10
                        ELSE 5
                    END
                    +
                    -- Purchase frequency score (max 20 points)
                    CASE 
                        WHEN PurchaseCount >= 20 THEN 20
                        WHEN PurchaseCount >= 10 THEN 15
                        WHEN PurchaseCount >= 5 THEN 10
                        ELSE 5
                    END
                    +
                    -- Relationship longevity score (max 20 points)
                    CASE 
                        WHEN MonthsActive >= 24 THEN 20
                        WHEN MonthsActive >= 12 THEN 15
                        WHEN MonthsActive >= 6 THEN 10
                        ELSE 5
                    END
                ) AS DECIMAL(5,2)
            ) AS PerformanceScore
        FROM SupplierMetrics
    )
    SELECT 
        SupplierID,
        SupplierName,
        ProductCount,
        InventoryValue,
        PurchaseCount,
        TotalPurchaseValue,
        MonthsActive,
        PerformanceScore,
        CASE 
            WHEN PerformanceScore >= 80 THEN 'Excellent'
            WHEN PerformanceScore >= 60 THEN 'Good'
            WHEN PerformanceScore >= 40 THEN 'Average'
            ELSE 'Needs Improvement'
        END AS PerformanceRating
    FROM ScoredSuppliers
    ORDER BY PerformanceScore DESC;
END;
GO

-- ========================================================================
-- STEP 7: INSERT SAMPLE DATA
-- ========================================================================

-- Insert sample categories
INSERT INTO Categories (CategoryName, Description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Food & Beverages', 'Consumable food items and drinks'),
('Office Supplies', 'Stationery and office equipment'),
('Home & Garden', 'Household items and gardening supplies');
GO

-- Insert sample suppliers
INSERT INTO Suppliers (SupplierName, ContactPerson, Email, Phone, Address, City, Country) VALUES
('TechWorld Distributors', 'John Smith', 'john@techworld.com', '+1-555-0101', '123 Tech Street', 'San Francisco', 'USA'),
('Fashion Forward Inc', 'Emily Davis', 'emily@fashionforward.com', '+1-555-0102', '456 Style Avenue', 'New York', 'USA'),
('Fresh Foods Co', 'Michael Brown', 'michael@freshfoods.com', '+1-555-0103', '789 Farm Road', 'Chicago', 'USA'),
('Office Pro Supplies', 'Sarah Wilson', 'sarah@officepro.com', '+1-555-0104', '321 Business Blvd', 'Boston', 'USA'),
('Home Essentials Ltd', 'David Lee', 'david@homeessentials.com', '+1-555-0105', '654 Home Lane', 'Seattle', 'USA');
GO

-- Insert sample products
INSERT INTO Products (ProductCode, ProductName, Description, CategoryID, SupplierID, Unit, CostPrice, SellingPrice, CurrentStock, ReorderLevel) VALUES
-- Electronics
('ELEC-001', 'Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 1, 1, 'pieces', 15.00, 29.99, 50, 10),
('ELEC-002', 'USB-C Hub', '7-in-1 USB-C hub with HDMI', 1, 1, 'pieces', 25.00, 49.99, 30, 8),
('ELEC-003', 'Bluetooth Headphones', 'Over-ear noise cancelling headphones', 1, 1, 'pieces', 45.00, 89.99, 5, 10), -- Low stock
('ELEC-004', 'Laptop Stand', 'Adjustable aluminum laptop stand', 1, 1, 'pieces', 20.00, 39.99, 0, 5), -- Out of stock

-- Clothing
('CLTH-001', 'Cotton T-Shirt', 'Premium cotton unisex t-shirt', 2, 2, 'pieces', 8.00, 19.99, 100, 20),
('CLTH-002', 'Denim Jeans', 'Classic fit denim jeans', 2, 2, 'pieces', 25.00, 59.99, 40, 15),
('CLTH-003', 'Winter Jacket', 'Warm insulated winter jacket', 2, 2, 'pieces', 50.00, 129.99, 15, 10),

-- Food & Beverages
('FOOD-001', 'Organic Coffee Beans', '1kg premium organic coffee', 3, 3, 'kg', 12.00, 24.99, 80, 25),
('FOOD-002', 'Green Tea Pack', 'Pack of 100 green tea bags', 3, 3, 'packs', 5.00, 12.99, 60, 20),
('FOOD-003', 'Honey Jar', '500g pure natural honey', 3, 3, 'jars', 8.00, 18.99, 3, 10), -- Low stock

-- Office Supplies
('OFFC-001', 'Notebook Pack', 'Pack of 5 spiral notebooks', 4, 4, 'packs', 4.00, 9.99, 150, 30),
('OFFC-002', 'Pen Set', 'Set of 12 ballpoint pens', 4, 4, 'sets', 3.00, 7.99, 200, 50),
('OFFC-003', 'Desk Organizer', 'Wooden desk organizer', 4, 4, 'pieces', 15.00, 34.99, 25, 8),

-- Home & Garden
('HOME-001', 'Plant Pot Set', 'Set of 3 ceramic plant pots', 5, 5, 'sets', 18.00, 39.99, 35, 10),
('HOME-002', 'Garden Tools Kit', '5-piece garden tool set', 5, 5, 'kits', 22.00, 49.99, 20, 8),
('HOME-003', 'LED Desk Lamp', 'Adjustable LED desk lamp', 5, 5, 'pieces', 14.00, 32.99, 45, 12);
GO

-- Insert sample purchases (this will trigger stock updates)
INSERT INTO Purchases (ProductID, SupplierID, Quantity, UnitCost, ReferenceNumber, Notes, CreatedBy) VALUES
(1, 1, 30, 15.00, 'PO-2024-001', 'Initial stock order', 'Admin'),
(2, 1, 20, 25.00, 'PO-2024-002', 'Initial stock order', 'Admin'),
(5, 2, 50, 8.00, 'PO-2024-003', 'Spring collection restock', 'Admin'),
(8, 3, 40, 12.00, 'PO-2024-004', 'Monthly coffee supply', 'Admin'),
(11, 4, 100, 4.00, 'PO-2024-005', 'Office supplies restock', 'Admin');
GO

-- Insert sample sales (for analytics - spread across last 4 months)
-- Note: These will trigger stock decreases and potential alerts

-- December sales
INSERT INTO Sales (ProductID, Quantity, UnitPrice, SaleDate, CustomerName, InvoiceNumber, CreatedBy) VALUES
(1, 5, 29.99, DATEADD(MONTH, -2, GETDATE()), 'ABC Corp', 'INV-2024-001', 'Sales Team'),
(5, 10, 19.99, DATEADD(MONTH, -2, GETDATE()), 'XYZ Ltd', 'INV-2024-002', 'Sales Team'),
(8, 8, 24.99, DATEADD(MONTH, -2, GETDATE()), 'Coffee Shop A', 'INV-2024-003', 'Sales Team'),
(11, 20, 9.99, DATEADD(MONTH, -2, GETDATE()), 'Office Plus', 'INV-2024-004', 'Sales Team');
GO

-- January sales
INSERT INTO Sales (ProductID, Quantity, UnitPrice, SaleDate, CustomerName, InvoiceNumber, CreatedBy) VALUES
(1, 8, 29.99, DATEADD(MONTH, -1, GETDATE()), 'Tech Solutions', 'INV-2024-005', 'Sales Team'),
(2, 5, 49.99, DATEADD(MONTH, -1, GETDATE()), 'Digital Agency', 'INV-2024-006', 'Sales Team'),
(6, 12, 59.99, DATEADD(MONTH, -1, GETDATE()), 'Fashion Store', 'INV-2024-007', 'Sales Team'),
(9, 15, 12.99, DATEADD(MONTH, -1, GETDATE()), 'Tea House', 'INV-2024-008', 'Sales Team'),
(12, 30, 7.99, DATEADD(MONTH, -1, GETDATE()), 'School Supply Co', 'INV-2024-009', 'Sales Team');
GO

-- Recent sales (this month)
INSERT INTO Sales (ProductID, Quantity, UnitPrice, SaleDate, CustomerName, InvoiceNumber, CreatedBy) VALUES
(1, 10, 29.99, DATEADD(DAY, -5, GETDATE()), 'New Client A', 'INV-2024-010', 'Sales Team'),
(3, 3, 89.99, DATEADD(DAY, -3, GETDATE()), 'Audio Pro', 'INV-2024-011', 'Sales Team'),
(5, 15, 19.99, DATEADD(DAY, -2, GETDATE()), 'Retail Chain', 'INV-2024-012', 'Sales Team'),
(14, 8, 39.99, DATEADD(DAY, -1, GETDATE()), 'Garden Center', 'INV-2024-013', 'Sales Team');
GO

-- ========================================================================
-- STEP 8: VERIFICATION QUERIES
-- ========================================================================

-- View all products with stock status
SELECT * FROM vw_ProductInventorySummary;

-- View low stock products
SELECT * FROM vw_LowStockProducts;

-- View unresolved alerts
SELECT * FROM InventoryAlerts WHERE IsResolved = 0;

-- View monthly sales summary
SELECT * FROM vw_MonthlySalesSummary ORDER BY SaleYear DESC, SaleMonth DESC;

-- Execute dead stock detection
EXEC sp_GetDeadStock @DaysWithoutSale = 90;

-- Execute supplier performance scoring
EXEC sp_GetSupplierPerformanceScore;

-- ========================================================================
-- END OF DATABASE SCRIPT
-- ========================================================================

PRINT 'Database setup completed successfully!';
PRINT 'Tables created: Categories, Suppliers, Products, Purchases, Sales, StockLedger, InventoryAlerts';
PRINT 'Views created: vw_LowStockProducts, vw_ProductInventorySummary, vw_MonthlySalesSummary, vw_SupplierPerformance';
PRINT 'Stored Procedures created: sp_GetDeadStock, sp_GetMonthlySalesAnalysis, sp_GetSupplierPerformanceScore';
PRINT 'Triggers created: trg_AfterPurchaseInsert, trg_AfterSaleInsert';
GO
