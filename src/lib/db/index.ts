import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not defined. Database connection will fail.');
}

console.log('Database connection info:', {
  usingConnectionString: !!connectionString,
  ssl: true,
  env: process.env.NODE_ENV
});

let pool: Pool;

try {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
  
  console.log('Database pool created successfully');
} catch (error) {
  console.error('Failed to create database pool:', error);
  throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : String(error)}`);
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  let client;
  
  try {
    client = await pool.connect();
    console.log(`Connected to database. Executing query: ${text.substring(0, 50)}...`);
    
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    
    console.log('Query executed successfully', { 
      duration_ms: duration, 
      rows: res.rowCount 
    });
    
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('Error executing query', { 
      text, 
      params, 
      duration_ms: duration, 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await query('SELECT NOW()');
    console.log('Connection successful');
    return {
      success: true,
      message: 'Database connection successful',
      timestamp: result.rows[0].now
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error)
    };
  }
} 