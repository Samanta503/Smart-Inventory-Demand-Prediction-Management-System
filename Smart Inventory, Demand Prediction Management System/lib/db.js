/**
 * Database Connection Utility
 * ==========================
 * 
 * This file handles all database connections using the mssql package.
 * It creates a connection pool that can be reused across API routes.
 * 
 * WHY USE A CONNECTION POOL?
 * - Creating a new connection for each request is slow and resource-intensive
 * - A pool maintains multiple connections that can be reused
 * - This improves performance significantly
 */

import sql from 'mssql';

/**
 * Database configuration object
 * Values are read from environment variables for security
 * Never hardcode credentials in your code!
 */
const config = {
  // Server address (localhost for local development)
  server: process.env.DB_SERVER || 'localhost',
  
  // Database name
  database: process.env.DB_DATABASE || 'SmartInventoryDB',
  
  // SQL Server authentication
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  
  // Port (default SQL Server port is 1433)
  port: parseInt(process.env.DB_PORT || '1433'),
  
  // Additional options
  options: {
    // Required for Azure SQL and recommended for local
    encrypt: false,
    
    // Trust the server certificate (for local development)
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    
    // Enable Multiple Active Result Sets
    enableArithAbort: true,
  },
  
  // Connection pool settings
  pool: {
    // Maximum connections in the pool
    max: 10,
    
    // Minimum connections to keep open
    min: 0,
    
    // How long to wait for a connection (in milliseconds)
    idleTimeoutMillis: 30000,
  },
};

/**
 * Global variable to store the connection pool
 * We use globalThis to persist the pool across hot reloads in development
 */
let globalPool = globalThis.sqlPool;

/**
 * Get a connection from the pool
 * Creates the pool if it doesn't exist yet
 * 
 * @returns {Promise<sql.ConnectionPool>} A connected pool instance
 * 
 * USAGE:
 *   const pool = await getConnection();
 *   const result = await pool.request().query('SELECT * FROM Products');
 */
export async function getConnection() {
  try {
    // If we already have a connected pool, return it
    if (globalPool && globalPool.connected) {
      return globalPool;
    }

    // Create a new pool and connect
    console.log('Creating new database connection pool...');
    globalPool = await sql.connect(config);
    
    // Store in globalThis for persistence across hot reloads
    globalThis.sqlPool = globalPool;
    
    console.log('Database connected successfully!');
    return globalPool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
}

/**
 * Execute a SQL query with parameters
 * This is a helper function to make queries easier
 * 
 * @param {string} queryText - The SQL query to execute
 * @param {Object} params - An object containing parameter names and values
 * @returns {Promise<sql.IResult>} The query result
 * 
 * USAGE:
 *   const result = await executeQuery(
 *     'SELECT * FROM Products WHERE CategoryID = @categoryId',
 *     { categoryId: 1 }
 *   );
 */
export async function executeQuery(queryText, params = {}) {
  try {
    // Get a connection from the pool
    const pool = await getConnection();
    
    // Create a new request
    const request = pool.request();
    
    // Add parameters to the request
    // This prevents SQL injection attacks!
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    
    // Execute the query and return the result
    const result = await request.query(queryText);
    return result;
  } catch (error) {
    console.error('Query execution failed:', error);
    console.error('Query:', queryText);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Execute a stored procedure
 * 
 * @param {string} procedureName - Name of the stored procedure
 * @param {Object} params - Parameters to pass to the procedure
 * @returns {Promise<sql.IResult>} The procedure result
 * 
 * USAGE:
 *   const result = await executeStoredProcedure('sp_GetDeadStock', { DaysWithoutSale: 90 });
 */
export async function executeStoredProcedure(procedureName, params = {}) {
  try {
    const pool = await getConnection();
    const request = pool.request();
    
    // Add parameters
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    
    // Execute stored procedure
    const result = await request.execute(procedureName);
    return result;
  } catch (error) {
    console.error('Stored procedure execution failed:', error);
    console.error('Procedure:', procedureName);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Close the database connection pool
 * Call this when shutting down the application
 */
export async function closeConnection() {
  try {
    if (globalPool) {
      await globalPool.close();
      globalPool = null;
      globalThis.sqlPool = null;
      console.log('Database connection closed.');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}

// Export the sql object for type access (e.g., sql.Int, sql.VarChar)
export { sql };
