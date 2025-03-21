# Next.js with AWS RDS PostgreSQL

This is a Next.js application that connects to an AWS RDS PostgreSQL database.

## Getting Started

First, set up your environment variables:

1. Copy `.env.local.example` to `.env.local`:
   ```
   cp .env.local.example .env.local
   ```

2. Update the `DATABASE_URL` in `.env.local` with your AWS RDS PostgreSQL credentials.
   
   **Important Note About Special Characters in Passwords:**
   
   If your database password contains special characters, they need to be URL-encoded in the connection string:
   
   - `#` should be encoded as `%23`
   - `!` should be encoded as `%21`
   - `@` should be encoded as `%40`
   - `?` should be encoded as `%3F`
   - `:` should be encoded as `%3A`
   - `/` should be encoded as `%2F`
   - `%` should be encoded as `%25`
   - ` ` (space) should be encoded as `%20`
   
   Example: If your password is `p@ss#word`, your connection string should be:
   ```
   DATABASE_URL=postgres://username:p%40ss%23word@hostname:5432/database_name
   ```
   
   Alternatively, you can use individual environment variables:
   ```
   DB_USER=username
   DB_PASSWORD=p@ss#word
   DB_HOST=hostname
   DB_PORT=5432
   DB_NAME=database_name
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Setting Up AWS RDS PostgreSQL

### 1. Create an AWS RDS PostgreSQL Instance

1. Go to the [AWS RDS Console](https://console.aws.amazon.com/rds/).
2. Click "Create database".
3. Choose "PostgreSQL" as the engine.
4. Select the appropriate DB instance size for your needs.
5. Configure connectivity settings:
   - Make sure to create in a VPC with appropriate security groups.
   - For development, you might want to make it publicly accessible.
6. Configure authentication and create a master username and password.
7. Create the database.

### 2. Configure Security Group

1. Make sure your RDS instance's security group allows incoming connections on port 5432 from your application's IP address.
2. For development, you might set the source to `0.0.0.0/0` (not recommended for production).

### 3. Connect to Your Database

1. Use a PostgreSQL client like pgAdmin or psql to connect to your database.
2. Run the SQL schema from `src/lib/db/schema.sql` to create the necessary tables.

### 4. Update Application Configuration

Update your `.env.local` file with the correct connection details:

```
DATABASE_URL=postgres://username:password@your-rds-endpoint:5432/database_name
```

Or use individual environment variables:

```
DB_USER=username
DB_PASSWORD=password
DB_HOST=your-rds-endpoint
DB_PORT=5432
DB_NAME=database_name
```

## Database Operations

This application includes a simple model for user operations in `src/lib/db/models/user.ts`, demonstrating how to:

- Retrieve all users
- Get a user by ID
- Create a user
- Update a user
- Delete a user

You can use these as examples for building your own database operations.

## Testing the Connection

The application includes a simple UI for testing the database connection. Click the "Test Database Connection" button on the homepage to verify if your application can connect to the AWS RDS PostgreSQL database.

## Production Deployment

For production deployment, make sure to:

1. Set up appropriate security groups for your RDS instance.
2. Configure environment variables in your deployment platform.
3. Use SSL for database connections for production environments.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)


