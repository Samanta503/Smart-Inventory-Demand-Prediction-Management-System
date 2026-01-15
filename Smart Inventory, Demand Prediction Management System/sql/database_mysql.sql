/*
==========================================================================
  SMART INVENTORY & DEMAND PREDICTION MANAGEMENT SYSTEM
  FULL DATABASE (13 TABLES) - MySQL 8.0+
==========================================================================
  Tables:
   1) Categories
   2) Suppliers
   3) Products
   4) Customers
   5) Users
   6) Warehouses
   7) ProductStocks        (WEAK / associative)
   8) PurchaseHeaders
   9) PurchaseItems        (WEAK / associative)
  10) SalesHeaders
  11) SalesItems           (WEAK / associative)
  12) StockLedger
  13) InventoryAlerts
==========================================================================
*/

-- =========================================================
-- STEP 1: DATABASE
-- =========================================================
DROP DATABASE IF EXISTS SmartInventoryDB;
CREATE DATABASE SmartInventoryDB
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE SmartInventoryDB;

-- =========================================================
-- STEP 2: MASTER TABLES
-- =========================================================

CREATE TABLE Categories (
  CategoryID INT PRIMARY KEY AUTO_INCREMENT,
  CategoryName VARCHAR(100) NOT NULL UNIQUE,
  Description VARCHAR(500),
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE Suppliers (
  SupplierID INT PRIMARY KEY AUTO_INCREMENT,
  SupplierName VARCHAR(200) NOT NULL,
  ContactPerson VARCHAR(100),
  Email VARCHAR(100),
  Phone VARCHAR(30),
  Address VARCHAR(500),
  City VARCHAR(100),
  Country VARCHAR(100),
  IsActive TINYINT(1) DEFAULT 1,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE Products (
  ProductID INT PRIMARY KEY AUTO_INCREMENT,
  ProductCode VARCHAR(50) NOT NULL UNIQUE,
  ProductName VARCHAR(200) NOT NULL,
  Description VARCHAR(1000),
  CategoryID INT NOT NULL,
  SupplierID INT NOT NULL,
  Unit VARCHAR(20) DEFAULT 'pieces',
  CostPrice DECIMAL(10,2) NOT NULL CHECK (CostPrice >= 0),
  SellingPrice DECIMAL(10,2) NOT NULL CHECK (SellingPrice >= 0),
  -- total stock across all warehouses (we maintain this by triggers)
  CurrentStock INT DEFAULT 0 CHECK (CurrentStock >= 0),
  ReorderLevel INT DEFAULT 10 CHECK (ReorderLevel >= 0),
  IsActive TINYINT(1) DEFAULT 1,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryID)
    REFERENCES Categories(CategoryID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT FK_Products_Suppliers FOREIGN KEY (SupplierID)
    REFERENCES Suppliers(SupplierID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT CHK_Price CHECK (SellingPrice >= CostPrice)
) ENGINE=InnoDB;

CREATE TABLE Customers (
  CustomerID INT PRIMARY KEY AUTO_INCREMENT,
  CustomerName VARCHAR(200) NOT NULL,
  Email VARCHAR(100),
  Phone VARCHAR(30),
  Address VARCHAR(500),
  City VARCHAR(100),
  Country VARCHAR(100),
  IsActive TINYINT(1) DEFAULT 1,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE Users (
  UserID INT PRIMARY KEY AUTO_INCREMENT,
  FullName VARCHAR(200) NOT NULL,
  Username VARCHAR(100) NOT NULL UNIQUE,
  PasswordHash VARCHAR(255) NOT NULL,
  Role ENUM('ADMIN','MANAGER','SALES','WAREHOUSE') DEFAULT 'SALES',
  IsActive TINYINT(1) DEFAULT 1,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE Warehouses (
  WarehouseID INT PRIMARY KEY AUTO_INCREMENT,
  WarehouseName VARCHAR(200) NOT NULL UNIQUE,
  Address VARCHAR(500),
  City VARCHAR(100),
  Country VARCHAR(100),
  IsActive TINYINT(1) DEFAULT 1,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- STEP 3: WEAK / ASSOCIATIVE TABLES (M:N broken into 1:N + N:1)
-- =========================================================

-- Products <-> Warehouses  (M:N) resolved by ProductStocks
CREATE TABLE ProductStocks (
  ProductID INT NOT NULL,
  WarehouseID INT NOT NULL,
  OnHandQty INT NOT NULL DEFAULT 0 CHECK (OnHandQty >= 0),
  ReservedQty INT NOT NULL DEFAULT 0 CHECK (ReservedQty >= 0),
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ProductID, WarehouseID),
  CONSTRAINT FK_ProductStocks_Product FOREIGN KEY (ProductID)
    REFERENCES Products(ProductID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT FK_ProductStocks_Warehouse FOREIGN KEY (WarehouseID)
    REFERENCES Warehouses(WarehouseID) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Purchases
CREATE TABLE PurchaseHeaders (
  PurchaseID INT PRIMARY KEY AUTO_INCREMENT,
  SupplierID INT NOT NULL,
  WarehouseID INT NOT NULL,
  PurchaseDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  ReferenceNumber VARCHAR(50),
  Status ENUM('DRAFT','COMPLETED','CANCELLED') DEFAULT 'COMPLETED',
  CreatedByUserID INT NOT NULL,
  Notes VARCHAR(500),
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT FK_PurchaseHeaders_Supplier FOREIGN KEY (SupplierID)
    REFERENCES Suppliers(SupplierID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT FK_PurchaseHeaders_Warehouse FOREIGN KEY (WarehouseID)
    REFERENCES Warehouses(WarehouseID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT FK_PurchaseHeaders_User FOREIGN KEY (CreatedByUserID)
    REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- PurchaseHeaders <-> Products (M:N) resolved by PurchaseItems
CREATE TABLE PurchaseItems (
  PurchaseItemID INT PRIMARY KEY AUTO_INCREMENT,
  PurchaseID INT NOT NULL,
  ProductID INT NOT NULL,
  Quantity INT NOT NULL CHECK (Quantity > 0),
  UnitCost DECIMAL(10,2) NOT NULL CHECK (UnitCost >= 0),
  LineTotal DECIMAL(12,2) GENERATED ALWAYS AS (Quantity * UnitCost) STORED,
  Notes VARCHAR(500),

  CONSTRAINT FK_PurchaseItems_Header FOREIGN KEY (PurchaseID)
    REFERENCES PurchaseHeaders(PurchaseID) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT FK_PurchaseItems_Product FOREIGN KEY (ProductID)
    REFERENCES Products(ProductID) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Sales
CREATE TABLE SalesHeaders (
  SaleID INT PRIMARY KEY AUTO_INCREMENT,
  CustomerID INT NOT NULL,
  WarehouseID INT NOT NULL,
  SaleDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  InvoiceNumber VARCHAR(50),
  Status ENUM('DRAFT','COMPLETED','CANCELLED') DEFAULT 'COMPLETED',
  CreatedByUserID INT NOT NULL,
  Notes VARCHAR(500),
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT FK_SalesHeaders_Customer FOREIGN KEY (CustomerID)
    REFERENCES Customers(CustomerID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT FK_SalesHeaders_Warehouse FOREIGN KEY (WarehouseID)
    REFERENCES Warehouses(WarehouseID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT FK_SalesHeaders_User FOREIGN KEY (CreatedByUserID)
    REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- SalesHeaders <-> Products (M:N) resolved by SalesItems
CREATE TABLE SalesItems (
  SaleItemID INT PRIMARY KEY AUTO_INCREMENT,
  SaleID INT NOT NULL,
  ProductID INT NOT NULL,
  Quantity INT NOT NULL CHECK (Quantity > 0),
  UnitPrice DECIMAL(10,2) NOT NULL CHECK (UnitPrice >= 0),
  LineTotal DECIMAL(12,2) GENERATED ALWAYS AS (Quantity * UnitPrice) STORED,
  Notes VARCHAR(500),

  CONSTRAINT FK_SalesItems_Header FOREIGN KEY (SaleID)
    REFERENCES SalesHeaders(SaleID) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT FK_SalesItems_Product FOREIGN KEY (ProductID)
    REFERENCES Products(ProductID) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================================
-- STEP 4: STOCK LEDGER + ALERTS
-- =========================================================

CREATE TABLE StockLedger (
  LedgerID INT PRIMARY KEY AUTO_INCREMENT,
  ProductID INT NOT NULL,
  WarehouseID INT NOT NULL,
  TransactionType ENUM('IN','OUT') NOT NULL,
  Quantity INT NOT NULL CHECK (Quantity > 0),
  PreviousStock INT NOT NULL,
  NewStock INT NOT NULL,
  ReferenceType ENUM('Purchase','Sale') NOT NULL,
  ReferenceID INT NOT NULL,
  TransactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  CreatedByUserID INT,
  Notes VARCHAR(500),

  CONSTRAINT FK_StockLedger_Product FOREIGN KEY (ProductID)
    REFERENCES Products(ProductID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT FK_StockLedger_Warehouse FOREIGN KEY (WarehouseID)
    REFERENCES Warehouses(WarehouseID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT FK_StockLedger_User FOREIGN KEY (CreatedByUserID)
    REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE InventoryAlerts (
  AlertID INT PRIMARY KEY AUTO_INCREMENT,
  ProductID INT NOT NULL,
  WarehouseID INT NOT NULL,
  AlertType ENUM('LOW_STOCK','OUT_OF_STOCK','DEAD_STOCK') NOT NULL,
  Message VARCHAR(500) NOT NULL,
  CurrentStock INT NOT NULL,
  ReorderLevel INT NOT NULL,
  IsResolved TINYINT(1) DEFAULT 0,
  ResolvedAt DATETIME NULL,
  ResolvedByUserID INT NULL,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT FK_Alerts_Product FOREIGN KEY (ProductID)
    REFERENCES Products(ProductID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT FK_Alerts_Warehouse FOREIGN KEY (WarehouseID)
    REFERENCES Warehouses(WarehouseID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT FK_Alerts_User FOREIGN KEY (ResolvedByUserID)
    REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================================================
-- STEP 5: INDEXES (PERFORMANCE)
-- =========================================================
CREATE INDEX IX_Products_CategoryID ON Products(CategoryID);
CREATE INDEX IX_Products_SupplierID ON Products(SupplierID);

CREATE INDEX IX_PurchaseHeaders_SupplierID ON PurchaseHeaders(SupplierID);
CREATE INDEX IX_PurchaseHeaders_WarehouseID ON PurchaseHeaders(WarehouseID);

CREATE INDEX IX_SalesHeaders_CustomerID ON SalesHeaders(CustomerID);
CREATE INDEX IX_SalesHeaders_WarehouseID ON SalesHeaders(WarehouseID);

CREATE INDEX IX_ProductStocks_WarehouseID ON ProductStocks(WarehouseID);

CREATE INDEX IX_StockLedger_ProductID ON StockLedger(ProductID);
CREATE INDEX IX_StockLedger_WarehouseID ON StockLedger(WarehouseID);

CREATE INDEX IX_Alerts_Unresolved ON InventoryAlerts(IsResolved);

-- =========================================================
-- STEP 6: TRIGGERS (AUTO STOCK UPDATE + LEDGER + ALERTS)
-- =========================================================
DELIMITER $$

-- Helper: Ensure ProductStocks row exists
CREATE TRIGGER trg_EnsureProductStockRow_OnPurchaseItem
BEFORE INSERT ON PurchaseItems
FOR EACH ROW
BEGIN
  DECLARE v_WarehouseID INT;

  SELECT WarehouseID INTO v_WarehouseID
  FROM PurchaseHeaders
  WHERE PurchaseID = NEW.PurchaseID;

  INSERT IGNORE INTO ProductStocks(ProductID, WarehouseID, OnHandQty, ReservedQty)
  VALUES (NEW.ProductID, v_WarehouseID, 0, 0);
END$$

CREATE TRIGGER trg_EnsureProductStockRow_OnSalesItem
BEFORE INSERT ON SalesItems
FOR EACH ROW
BEGIN
  DECLARE v_WarehouseID INT;

  SELECT WarehouseID INTO v_WarehouseID
  FROM SalesHeaders
  WHERE SaleID = NEW.SaleID;

  INSERT IGNORE INTO ProductStocks(ProductID, WarehouseID, OnHandQty, ReservedQty)
  VALUES (NEW.ProductID, v_WarehouseID, 0, 0);
END$$

-- PurchaseItem insert => stock IN
CREATE TRIGGER trg_AfterPurchaseItemInsert
AFTER INSERT ON PurchaseItems
FOR EACH ROW
BEGIN
  DECLARE v_WarehouseID INT;
  DECLARE v_UserID INT;
  DECLARE v_Prev INT;
  DECLARE v_New INT;

  SELECT WarehouseID, CreatedByUserID INTO v_WarehouseID, v_UserID
  FROM PurchaseHeaders
  WHERE PurchaseID = NEW.PurchaseID;

  SELECT OnHandQty INTO v_Prev
  FROM ProductStocks
  WHERE ProductID = NEW.ProductID AND WarehouseID = v_WarehouseID;

  SET v_New = v_Prev + NEW.Quantity;

  UPDATE ProductStocks
  SET OnHandQty = v_New
  WHERE ProductID = NEW.ProductID AND WarehouseID = v_WarehouseID;

  UPDATE Products
  SET CurrentStock = CurrentStock + NEW.Quantity
  WHERE ProductID = NEW.ProductID;

  INSERT INTO StockLedger(
    ProductID, WarehouseID, TransactionType, Quantity,
    PreviousStock, NewStock, ReferenceType, ReferenceID, CreatedByUserID, Notes
  ) VALUES (
    NEW.ProductID, v_WarehouseID, 'IN', NEW.Quantity,
    v_Prev, v_New, 'Purchase', NEW.PurchaseID, v_UserID, 'Stock increased (purchase)'
  );
END$$

-- SalesItem insert => stock OUT (with validation)
CREATE TRIGGER trg_BeforeSalesItemInsert_CheckStock
BEFORE INSERT ON SalesItems
FOR EACH ROW
BEGIN
  DECLARE v_WarehouseID INT;
  DECLARE v_OnHand INT;

  SELECT WarehouseID INTO v_WarehouseID
  FROM SalesHeaders
  WHERE SaleID = NEW.SaleID;

  SELECT OnHandQty INTO v_OnHand
  FROM ProductStocks
  WHERE ProductID = NEW.ProductID AND WarehouseID = v_WarehouseID;

  IF v_OnHand IS NULL THEN
    SET v_OnHand = 0;
  END IF;

  IF v_OnHand < NEW.Quantity THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Insufficient stock in warehouse for this sale item.';
  END IF;
END$$

CREATE TRIGGER trg_AfterSalesItemInsert
AFTER INSERT ON SalesItems
FOR EACH ROW
BEGIN
  DECLARE v_WarehouseID INT;
  DECLARE v_UserID INT;
  DECLARE v_Prev INT;
  DECLARE v_New INT;
  DECLARE v_Reorder INT;
  DECLARE v_ProductName VARCHAR(200);
  DECLARE v_Exists INT;

  SELECT WarehouseID, CreatedByUserID INTO v_WarehouseID, v_UserID
  FROM SalesHeaders
  WHERE SaleID = NEW.SaleID;

  SELECT OnHandQty INTO v_Prev
  FROM ProductStocks
  WHERE ProductID = NEW.ProductID AND WarehouseID = v_WarehouseID;

  SET v_New = v_Prev - NEW.Quantity;

  UPDATE ProductStocks
  SET OnHandQty = v_New
  WHERE ProductID = NEW.ProductID AND WarehouseID = v_WarehouseID;

  UPDATE Products
  SET CurrentStock = CurrentStock - NEW.Quantity
  WHERE ProductID = NEW.ProductID;

  INSERT INTO StockLedger(
    ProductID, WarehouseID, TransactionType, Quantity,
    PreviousStock, NewStock, ReferenceType, ReferenceID, CreatedByUserID, Notes
  ) VALUES (
    NEW.ProductID, v_WarehouseID, 'OUT', NEW.Quantity,
    v_Prev, v_New, 'Sale', NEW.SaleID, v_UserID, 'Stock decreased (sale)'
  );

  -- Alert logic (warehouse-level)
  SELECT ReorderLevel, ProductName INTO v_Reorder, v_ProductName
  FROM Products WHERE ProductID = NEW.ProductID;

  IF v_New <= v_Reorder THEN
    SELECT COUNT(*) INTO v_Exists
    FROM InventoryAlerts
    WHERE ProductID = NEW.ProductID
      AND WarehouseID = v_WarehouseID
      AND IsResolved = 0
      AND AlertType IN ('LOW_STOCK','OUT_OF_STOCK');

    IF v_Exists = 0 THEN
      INSERT INTO InventoryAlerts(ProductID, WarehouseID, AlertType, Message, CurrentStock, ReorderLevel)
      VALUES (
        NEW.ProductID,
        v_WarehouseID,
        CASE WHEN v_New = 0 THEN 'OUT_OF_STOCK' ELSE 'LOW_STOCK' END,
        CASE WHEN v_New = 0
          THEN CONCAT('Product "', v_ProductName, '" is OUT OF STOCK in this warehouse!')
          ELSE CONCAT('Product "', v_ProductName, '" is LOW STOCK. Stock: ', v_New, ', Reorder: ', v_Reorder)
        END,
        v_New,
        v_Reorder
      );
    END IF;
  END IF;
END$$

DELIMITER ;

-- =========================================================
-- STEP 7: VIEWS (OPTIONAL, but useful)
-- =========================================================

CREATE VIEW vw_LowStockProducts AS
SELECT
  p.ProductID, p.ProductCode, p.ProductName,
  w.WarehouseID, w.WarehouseName,
  ps.OnHandQty AS CurrentStock,
  p.ReorderLevel,
  (p.ReorderLevel - ps.OnHandQty) AS UnitsNeeded
FROM ProductStocks ps
JOIN Products p ON p.ProductID = ps.ProductID
JOIN Warehouses w ON w.WarehouseID = ps.WarehouseID
WHERE ps.OnHandQty <= p.ReorderLevel
  AND p.IsActive = 1
  AND w.IsActive = 1;

CREATE VIEW vw_ProductInventorySummary AS
SELECT
  p.ProductID, p.ProductCode, p.ProductName,
  c.CategoryName, s.SupplierName,
  p.CostPrice, p.SellingPrice,
  (p.SellingPrice - p.CostPrice) AS ProfitMargin,
  p.CurrentStock, p.ReorderLevel,
  (p.CurrentStock * p.CostPrice) AS StockValue
FROM Products p
JOIN Categories c ON c.CategoryID = p.CategoryID
JOIN Suppliers s ON s.SupplierID = p.SupplierID;

-- =========================================================
-- STEP 8: DUMMY DATA (A LOT)
-- =========================================================

-- Categories
INSERT INTO Categories(CategoryName, Description) VALUES
('Electronics','Electronic devices and accessories'),
('Clothing','Fashion and apparel'),
('Food & Beverages','Consumables'),
('Office Supplies','Stationery and office equipment'),
('Home & Garden','Home and garden products');

-- Suppliers
INSERT INTO Suppliers(SupplierName, ContactPerson, Email, Phone, City, Country) VALUES
('TechWorld Distributors','John Smith','john@techworld.com','+1-555-0101','San Francisco','USA'),
('Fashion Forward Inc','Emily Davis','emily@fashionforward.com','+1-555-0102','New York','USA'),
('Fresh Foods Co','Michael Brown','michael@freshfoods.com','+1-555-0103','Chicago','USA'),
('Office Pro Supplies','Sarah Wilson','sarah@officepro.com','+1-555-0104','Boston','USA'),
('Home Essentials Ltd','David Lee','david@homeessentials.com','+1-555-0105','Seattle','USA');

-- Users (passwordhash is just dummy text here)
INSERT INTO Users(FullName, Username, PasswordHash, Role) VALUES
('System Admin','admin','hash_admin_123','ADMIN'),
('Sales User 1','sales1','hash_sales1_123','SALES'),
('Warehouse Manager','wh1','hash_wh1_123','WAREHOUSE'),
('Manager 1','manager1','hash_mgr_123','MANAGER');

-- Customers
INSERT INTO Customers(CustomerName, Email, Phone, City, Country) VALUES
('John Doe','john@example.com','+1-700-0001','Dallas','USA'),
('Jane Smith','jane@example.com','+1-700-0002','Miami','USA'),
('ABC Corp','contact@abccorp.com','+1-700-0100','New York','USA'),
('Retail Chain Ltd','orders@retailchain.com','+1-700-0200','Chicago','USA'),
('Coffee Shop XYZ','coffee@xyz.com','+1-700-0300','Seattle','USA');

-- Warehouses
INSERT INTO Warehouses(WarehouseName, Address, City, Country) VALUES
('Main Warehouse','10 Central Rd','Boston','USA'),
('West Warehouse','50 West St','Los Angeles','USA'),
('South Warehouse','77 South Ave','Houston','USA');

-- Products (CurrentStock will be updated by purchase triggers)
INSERT INTO Products(ProductCode, ProductName, Description, CategoryID, SupplierID, Unit, CostPrice, SellingPrice, CurrentStock, ReorderLevel) VALUES
('ELEC-001','Wireless Mouse','Ergonomic wireless mouse',1,1,'pieces',15.00,29.99,0,10),
('ELEC-002','USB-C Hub','7-in-1 USB-C hub',1,1,'pieces',25.00,49.99,0,8),
('ELEC-003','Bluetooth Headphones','Noise cancelling headphones',1,1,'pieces',45.00,89.99,0,5),
('CLTH-001','Cotton T-Shirt','Premium cotton t-shirt',2,2,'pieces',8.00,19.99,0,20),
('CLTH-002','Denim Jeans','Classic fit denim jeans',2,2,'pieces',25.00,59.99,0,15),
('FOOD-001','Organic Coffee Beans','1kg organic coffee beans',3,3,'kg',12.00,24.99,0,10),
('FOOD-002','Green Tea Pack','Pack of tea bags',3,3,'packs',5.00,12.99,0,20),
('OFFC-001','Notebook Pack','Pack of notebooks',4,4,'packs',4.00,9.99,0,30),
('OFFC-002','Pen Set','Set of pens',4,4,'sets',3.00,7.99,0,50),
('HOME-001','Plant Pot Set','Set of ceramic pots',5,5,'sets',18.00,39.99,0,10);

-- Initialize ProductStocks rows for all products in all warehouses (optional but nice)
INSERT IGNORE INTO ProductStocks(ProductID, WarehouseID, OnHandQty, ReservedQty)
SELECT p.ProductID, w.WarehouseID, 0, 0
FROM Products p CROSS JOIN Warehouses w;

-- PURCHASES (headers + items) => will auto increase stock
INSERT INTO PurchaseHeaders(SupplierID, WarehouseID, ReferenceNumber, CreatedByUserID, Notes)
VALUES
(1, 1, 'PO-2026-001', 1, 'Initial stock main warehouse'),
(2, 1, 'PO-2026-002', 1, 'Clothing initial stock'),
(3, 3, 'PO-2026-003', 4, 'Food stock for south'),
(4, 2, 'PO-2026-004', 3, 'Office supplies for west');

INSERT INTO PurchaseItems(PurchaseID, ProductID, Quantity, UnitCost, Notes) VALUES
(1, 1, 60, 15.00, 'Mouse stock'),
(1, 2, 40, 25.00, 'Hub stock'),
(1, 3, 25, 45.00, 'Headphones stock'),
(2, 4, 200, 8.00, 'T-shirts'),
(2, 5, 120, 25.00, 'Jeans'),
(3, 6, 80, 12.00, 'Coffee beans'),
(3, 7, 150, 5.00, 'Tea packs'),
(4, 8, 300, 4.00, 'Notebooks'),
(4, 9, 400, 3.00, 'Pens');

-- SALES (headers + items) => will auto decrease stock + alerts if low
INSERT INTO SalesHeaders(CustomerID, WarehouseID, InvoiceNumber, CreatedByUserID, Notes)
VALUES
(1, 1, 'INV-2026-001', 2, 'Walk-in'),
(3, 1, 'INV-2026-002', 2, 'Corporate order'),
(5, 3, 'INV-2026-003', 2, 'Coffee shop order'),
(2, 2, 'INV-2026-004', 2, 'Online order west');

INSERT INTO SalesItems(SaleID, ProductID, Quantity, UnitPrice, Notes) VALUES
(1, 1, 5, 29.99, 'Mouse sold'),
(1, 2, 2, 49.99, 'Hub sold'),
(2, 4, 30, 19.99, 'T-shirt bulk'),
(2, 5, 10, 59.99, 'Jeans bulk'),
(3, 6, 10, 24.99, 'Coffee beans'),
(3, 7, 20, 12.99, 'Tea packs'),
(4, 8, 50, 9.99, 'Notebooks'),
(4, 9, 60, 7.99, 'Pens');

-- =========================================================
-- STEP 9: QUICK VERIFICATION
-- =========================================================
SELECT 'DB READY ✅' AS Status;

SELECT 'Tables' AS Type, COUNT(*) AS Count
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA='SmartInventoryDB' AND TABLE_TYPE='BASE TABLE';

SELECT 'Low Stock View Sample' AS Info;
SELECT * FROM vw_LowStockProducts LIMIT 20;

SELECT 'Stock Ledger Count' AS Info, COUNT(*) AS LedgerRows FROM StockLedger;

SELECT 'Alerts Unresolved' AS Info;
SELECT * FROM InventoryAlerts WHERE IsResolved=0 ORDER BY CreatedAt DESC;
