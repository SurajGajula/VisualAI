import { query } from '..';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '24h';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}

export async function ensureAuthTable() {
  try {
    console.log("Checking if auth_users table exists...");
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'auth_users'
      )
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log("Auth table exists:", tableExists);
    
    if (!tableExists) {
      console.log("Creating auth_users table...");
      await query(`
        CREATE TABLE auth_users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Created auth_users table successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring auth table:', error);
    throw new Error(`Database error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function register(username: string, email: string, password: string) {
  try {
    await ensureAuthTable();
    
    console.log("Checking if user already exists...");
    const userCheck = await query('SELECT * FROM auth_users WHERE email = $1', [email]);
    
    if (userCheck.rows.length > 0) {
      console.log("User with this email already exists");
      throw new Error('User with this email already exists');
    }
    
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log("Inserting new user...");
    const result = await query(
      'INSERT INTO auth_users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
    
    const user = result.rows[0];
    console.log("User created successfully:", { username: user.username });
    
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    return { user, token };
  } catch (error) {
    console.error("Error during registration:", error);
    if (error instanceof Error) {
      throw error; // Rethrow the existing error
    } else {
      throw new Error(`Registration failed: ${String(error)}`);
    }
  }
}

export async function login(email: string, password: string) {
  try {
    console.log("Ensuring auth table exists before login...");
    await ensureAuthTable();
    
    console.log("Finding user by email...");
    const result = await query('SELECT * FROM auth_users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      console.log("No user found with this email");
      throw new Error('Invalid credentials');
    }
    
    const user = result.rows[0];
    console.log("User found, verifying password...");
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("Password does not match");
      throw new Error('Invalid credentials');
    }
    
    console.log("Password verified, generating token...");
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    console.log("Login successful for user:", { username: user.username });
    return { 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      }, 
      token 
    };
  } catch (error) {
    console.error("Error during login:", error);
    if (error instanceof Error) {
      throw error; // Rethrow the existing error
    } else {
      throw new Error(`Login failed: ${String(error)}`);
    }
  }
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error('Invalid token');
  }
}

export async function getUserById(id: number) {
  try {
    console.log("Getting user by ID:", id);
    const result = await query(
      'SELECT id, username, email, created_at FROM auth_users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length) {
      console.log("User found by ID");
      return result.rows[0];
    } else {
      console.log("No user found with this ID");
      return null;
    }
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw new Error(`Database error: ${error instanceof Error ? error.message : String(error)}`);
  }
} 