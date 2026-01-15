/**
 * Database Connection Utility
 * ==========================
 * 
 * This file handles all database connections using the mysql2 package.
 * Using MySQL connection pool for efficient connection management.
 */

import mysql from 'mysql2/promise';

/**
 * Database configuration object
 */
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE || 'SmartInventoryDB',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

/**
 * Global variable to store the connection pool
 * We use globalThis to persist the pool across hot reloads in development
 */
let globalPool = globalThis.mysqlPool;

/**
 * Get a connection pool
 * Creates the pool if it doesn't exist yet
 * 
 * @returns {Promise<mysql.Pool>} A connection pool instance
 * 
 * USAGE:
 *   const pool = await getConnection();
 *   const [rows] = await pool.query('SELECT * FROM Products');
 */
export async function getConnection() {
  try {
    // If we already have a pool, return it
    if (globalPool) {
      return globalPool;
    }

    // Create a new pool
    console.log('Creating new MySQL connection pool...');
    console.log('Connecting to:', config.host + ':' + config.port);
    console.log('Database:', config.database);
    
    globalPool = mysql.createPool(config);
    
    // Test the connection
    const connection = await globalPool.getConnection();
    console.log('MySQL database connected successfully!');
    connection.release();
    
    // Store in globalThis for persistence across hot reloads
    globalThis.mysqlPool = globalPool;
    
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
 * @param {string} queryText - The SQL query to execute (use ? for placeholders)
 * @param {Object|Array} params - Parameters as object (named) or array (positional)
 * @returns {Promise<Object>} The query result with recordset property
 * 
 * USAGE:
 *   // Using named parameters (will be converted to positional)
 *   const result = await executeQuery(
 *     'SELECT * FROM Products WHERE CategoryID = ?',
 *     { categoryId: 1 }
 *   );
 *   
 *   // Using positional parameters
 *   const result = await executeQuery(
 *     'SELECT * FROM Products WHERE CategoryID = ?',
 *     [1]
 *   );
 */
export async function executeQuery(queryText, params = {}) {
  try {
    // Get a connection from the pool
    const pool = await getConnection();
    
    // Convert named parameters to positional if params is an object
    let paramArray = [];
    let processedQuery = queryText;
    
    if (params && typeof params === 'object' && !Array.isArray(params)) {
      // Replace @paramName with ? and build parameter array in order of appearance
      const regex = /@(\w+)/g;
      let match;
      const foundParams = [];
      
      while ((match = regex.exec(queryText)) !== null) {
        foundParams.push(match[1]);
      }
      
      // Build parameter array based on order of appearance
      for (const paramName of foundParams) {
        if (params.hasOwnProperty(paramName)) {
          paramArray.push(params[paramName]);
        }
      }
      
      // Replace all @paramName with ?
      processedQuery = queryText.replace(/@\w+/g, '?');
    } else if (Array.isArray(params)) {
      paramArray = params;
    }
    
    // Execute the query
    const [rows, fields] = await pool.query(processedQuery, paramArray);
    
    // Return in a format compatible with the existing code
    return {
      recordset: Array.isArray(rows) ? rows : [rows],
      rowsAffected: [rows.affectedRows || rows.length || 0],
    };
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
 * @returns {Promise<Object>} The procedure result
 * 
 * USAGE:
 *   const result = await executeStoredProcedure('sp_GetDeadStock', { DaysWithoutSale: 90 });
 */
export async function executeStoredProcedure(procedureName, params = {}) {
  try {
    const pool = await getConnection();
    
    // Build the CALL statement with parameters
    const paramKeys = Object.keys(params);
    const placeholders = paramKeys.map(() => '?').join(', ');
    const paramValues = paramKeys.map(key => params[key]);
    
    const callStatement = paramKeys.length > 0
      ? `CALL ${procedureName}(${placeholders})`
      : `CALL ${procedureName}()`;
    
    const [results] = await pool.query(callStatement, paramValues);
    
    // MySQL stored procedures return results in nested arrays
    return {
      recordset: Array.isArray(results[0]) ? results[0] : results,
      rowsAffected: [results.affectedRows || 0],
    };
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
      await globalPool.end();
      globalPool = null;
      globalThis.mysqlPool = null;
      console.log('Database connection closed.');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}

// Export mysql for type access if needed
export { mysql };
