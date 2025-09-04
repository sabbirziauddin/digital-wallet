# Digital Wallet API

[![Deployment](https://img.shields.io/badge/Vercel-Live-brightgreen)](https://digital-wallet-eta.vercel.app/)

A robust and secure RESTful API for a digital wallet system, built with Node.js, Express, and TypeScript. This backend service provides core functionalities for user management, wallet operations, and transaction handling.

## Features

-   **User Management**: User registration and profile updates.
-   **Authentication**: Secure login with JWT (Access and Refresh tokens).
-   **Role-Based Access Control (RBAC)**: Differentiated permissions for `USER`, `AGENT`, and `ADMIN` roles.
-   **Wallet Operations**: Deposit, withdraw, transfer, and balance inquiries.
-   **Agent-Specific Actions**: `cash-in` and `cash-out` functionalities for agents.
-   **Admin Capabilities**: Block/unblock wallets and view all system transactions.
-   **Transaction History**: Users can view their own transaction history.
-   **Input Validation**: Robust request validation using Zod.
-   **Secure Password Handling**: Passwords are hashed using bcrypt.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Language**: TypeScript
-   **Database**: MongoDB with Mongoose ODM
-   **Validation**: Zod
-   **Authentication**: JSON Web Tokens (JWT)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) (local instance or a cloud-hosted solution like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <https://github.com/sabbirziauddin/digital-wallet.git>
    cd digital-wallet
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```sh
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in the required values (especially your database URL and JWT secrets).

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (default is 5000).

---

## Environment Variables

The following environment variables are required for the application to run.

| Variable                 | Description                                                              | Example                                           |
| ------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------- |
| `NODE_ENV`               | The application environment.                                             | `development`                                     |
| `PORT`                   | The port on which the server will run.                                   | `5000`                                            |
| `DB_URL`                 | The connection string for your MongoDB database.                         | `mongodb://localhost:27017/digital-wallet`        |
| `JWT_SECRET`             | Secret key for signing JWT access tokens.                                | `your-super-secret-jwt-token`                     |
| `JWT_EXPIRED_IN`         | Expiration time for access tokens (e.g., `1d`, `1h`).                    | `1d`                                              |
| `JWT_REFRESH_SECRET`     | Secret key for signing JWT refresh tokens.                               | `your-super-secret-jwt-refresh-token`             |
| `JWT_REFRESH_EXPIRED_IN` | Expiration time for refresh tokens.                                      | `7d`                                              |
| `BCRYPT_SALT_ROUNDS`     | The number of salt rounds for bcrypt password hashing.                   | `12`                                              |
| `SUPER_ADMIN_EMAIL`      | Default email for the initial super admin account.                       | `admin@example.com`                               |
| `SUPER_ADMIN_PASSWORD`   | Default password for the initial super admin account.                    | `super-secret-password`                           |

---

## API Documentation

The base URL for all API endpoints is `/api/v1`.

### Auth Module

#### `POST /auth/login`
Authenticates a user and returns JWT access and refresh tokens.

-   **Authorization**: `Public`
-   **Request Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
        "success": true,
        "statusCode": 200,
        "message": "User logged in successfully",
        "data": {
            "accessToken": "...",
            "user": {
                "_id": "...",
                "name": "Test User",
                "email": "user@example.com",
                "role": "USER"
            }
        }
    }
    ```
    *(The `refreshToken` is sent in an `httpOnly` cookie).*

---

### User Module

#### `POST /user/register`
Registers a new user. The default role is `USER`.

-   **Authorization**: `Public`
-   **Request Body**:
    ```json
    {
        "name": "Test User",
        "email": "test.user@example.com",
        "password": "Password@123",
        "role": "USER" // Optional
    }
    ```
    *Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.*

-   **Success Response (201 Created)**:
    ```json
    {
        "success": true,
        "statusCode": 201,
        "message": "User created successfully",
        "data": {
            // User object without password
        }
    }
    ```

#### `GET /user/allusers`
Retrieves a list of all users.

-   **Authorization**: `ADMIN`, `SUPER_ADMIN`
-   **Success Response (200 OK)**:
    ```json
    {
        "success": true,
        "statusCode": 200,
        "message": "Users retrieved successfully",
        "data": [
            // Array of user objects
        ]
    }
    ```

#### `PATCH /user/:id`
Updates a user's details.

-   **Authorization**: `ADMIN`, `SUPER_ADMIN`
-   **Request Body**:
    ```json
    {
        "name": "Updated Name",
        "email": "updated.email@example.com"
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
        "success": true,
        "statusCode": 200,
        "message": "User updated successfully",
        "data": {
            // Updated user object
        }
    }
    ```

---

### Wallet Module

#### `POST /wallet/deposit`
Deposits money into the user's own wallet.

-   **Authorization**: `USER`, `AGENT`, `ADMIN`, `SUPER_ADMIN`
-   **Request Body**:
    ```json
    {
        "amount": 100
    }
    ```

#### `POST /wallet/withdraw`
Withdraws money from the user's own wallet.

-   **Authorization**: `USER`, `AGENT`, `ADMIN`, `SUPER_ADMIN`
-   **Request Body**:
    ```json
    {
        "amount": 50
    }
    ```

#### `POST /wallet/transfer`
Transfers money from the user's wallet to another user's wallet.

-   **Authorization**: `USER`, `AGENT`, `ADMIN`, `SUPER_ADMIN`
-   **Request Body**:
    ```json
    {
        "toUserId": "receiver_user_id",
        "amount": 25
    }
    ```

#### `POST /wallet/cash-in`
Agent-facilitated deposit into a user's account.

-   **Authorization**: `AGENT`
-   **Request Body**:
    ```json
    {
        "userId": "target_user_id",
        "amount": 100
    }
    ```

#### `POST /wallet/cash-out`
Agent-facilitated withdrawal from a user's account.

-   **Authorization**: `AGENT`
-   **Request Body**:
    ```json
    {
        "userId": "target_user_id",
        "amount": 50
    }
    ```

#### `PATCH /wallet/block-wallet/:walletId`
Blocks a specific wallet.

-   **Authorization**: `ADMIN`, `SUPER_ADMIN`

#### `PATCH /wallet/unblock-wallet/:walletId`
Unblocks a specific wallet.

-   **Authorization**: `ADMIN`, `SUPER_ADMIN`

---

### Transaction Module

#### `GET /transaction/me`
Retrieves the transaction history for the currently authenticated user.

-   **Authorization**: `USER`, `AGENT`, `ADMIN`, `SUPER_ADMIN`
-   **Success Response (200 OK)**:
    ```json
    {
        "success": true,
        "statusCode": 200,
        "message": "Transactions retrieved successfully",
        "data": [
            // Array of transaction objects
        ]
    }
    ```

#### `GET /transaction/all`
Retrieves all transactions in the system.

-   **Authorization**: `ADMIN`, `SUPER_ADMIN`
-   **Success Response (200 OK)**:
    ```json
    {
        "success": true,
        "statusCode": 200,
        "message": "All transactions retrieved successfully",
        "data": [
            // Array of all transaction objects
        ]
    }
    ```

---

## Project Structure

The project follows a modular architecture to keep the codebase organized and scalable.

```
src/
├── app/
│   ├── config/         # Environment variables
│   ├── errorHelpers/   # Custom error classes
│   ├── interfaces/     # Global TypeScript interfaces
│   ├── middlewares/    # Express middlewares (auth, validation, errors)
│   ├── modules/        # Core feature modules (user, auth, wallet)
│   │   └── [module]/
│   │       ├── [module].controller.ts
│   │       ├── [module].interface.ts
│   │       ├── [module].model.ts
│   │       ├── [module].route.ts
│   │       └── [module].service.ts
│   ├── routes/         # Main API router
│   └── utils/          # Utility functions (JWT, response handlers)
├── app.ts              # Express app configuration
└── server.ts           # Server initialization
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find a bug or have a feature request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
