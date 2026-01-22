# Auth Service API Documentation

## Overview

The Auth Service handles all authentication-related operations including user login, logout, token validation, and token
refresh. It uses JWT (JSON Web Tokens) for stateless authentication.

**Base URL:** `/api/v1/auth` (via Gateway at port 8222)  
**Direct URL:** `http://localhost:8000/api/v1/auth`  
**Service Port:** 8000

---

## Endpoints

### 1. Login

Authenticates a user and returns JWT tokens.

| Property           | Value                |
|--------------------|----------------------|
| **Method**         | `POST`               |
| **Endpoint**       | `/api/v1/auth/login` |
| **Authentication** | None                 |

#### Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

| Field      | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| `email`    | string | Yes      | User's email address |
| `password` | string | Yes      | User's password      |

#### Response

**Success (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Login successful",
  "result": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

**Note:** The refresh token is set as an HTTP-only cookie named `refreshToken`.

#### Response Cookies

| Cookie Name    | HttpOnly | Description                       |
|----------------|----------|-----------------------------------|
| `refreshToken` | Yes      | JWT refresh token (7 days expiry) |

**Error Responses:**

| Status | Message             |
|--------|---------------------|
| 401    | Invalid credentials |
| 400    | Validation error    |

---

### 2. Logout

Invalidates the current access and refresh tokens.

| Property           | Value                   |
|--------------------|-------------------------|
| **Method**         | `POST`                  |
| **Endpoint**       | `/api/v1/auth/logout`   |
| **Authentication** | Required (Bearer Token) |

#### Request Headers

| Header          | Value                  | Required |
|-----------------|------------------------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes      |

#### Request Cookies

| Cookie         | Required |
|----------------|----------|
| `refreshToken` | Yes      |

#### Response

**Success (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Logout successful"
}
```

---

### 3. Introspect Token

Validates an access token and checks if it's still valid.

| Property           | Value                     |
|--------------------|---------------------------|
| **Method**         | `POST`                    |
| **Endpoint**       | `/api/v1/auth/introspect` |
| **Authentication** | Required (Bearer Token)   |

#### Request Headers

| Header          | Value                  | Required |
|-----------------|------------------------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes      |

#### Response

**Success (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Token is valid",
  "result": {
    "valid": true
  }
}
```

**Invalid Token (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Token is invalid",
  "result": {
    "valid": false
  }
}
```

---

### 4. Refresh Token

Generates a new access token using a valid refresh token.

| Property           | Value                  |
|--------------------|------------------------|
| **Method**         | `POST`                 |
| **Endpoint**       | `/api/v1/auth/refresh` |
| **Authentication** | Refresh Token Cookie   |

#### Request Cookies

| Cookie         | Required |
|----------------|----------|
| `refreshToken` | Yes      |

#### Response

**Success (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "result": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

**Note:** A new refresh token is also set as an HTTP-only cookie, and the old one is blacklisted.

**Error Responses:**

| Status | Message                             |
|--------|-------------------------------------|
| 401    | Refresh token is invalid or expired |
| 400    | No refresh token provided           |

---

## Data Models

### AuthRequest

```json
{
  "email": "string",
  "password": "string"
}
```

### AuthResponse

```json
{
  "accessToken": "string"
}
```

### ApiResponse<T>

```json
{
  "timestamp": "number (epoch milliseconds)",
  "statusCode": "number",
  "message": "string",
  "result": "T (optional)"
}
```

---

## JWT Token Structure

### Access Token Payload

```json
{
  "sub": "user@email.com",
  "role": "ADMIN|TEACHER|STUDENT",
  "fullName": "User Full Name",
  "iat": 1705920000,
  "exp": 1705920900
}
```

### Token Configuration

| Property             | Value      |
|----------------------|------------|
| Algorithm            | HS256      |
| Access Token Expiry  | 15 minutes |
| Refresh Token Expiry | 7 days     |

---

## Error Codes

| Code                       | HTTP Status | Message                   |
|----------------------------|-------------|---------------------------|
| `AUTH_INVALID_CREDENTIALS` | 401         | Invalid email or password |
| `AUTH_TOKEN_EXPIRED`       | 401         | Token has expired         |
| `AUTH_TOKEN_INVALID`       | 401         | Token is invalid          |
| `AUTH_USER_NOT_FOUND`      | 404         | User not found            |
| `AUTH_TOKEN_BLACKLISTED`   | 401         | Token has been revoked    |

---

## Security Features

1. **Password Encoding**: BCrypt with strength 10
2. **Token Blacklisting**: Both access and refresh tokens are blacklisted on logout
3. **HTTP-Only Cookies**: Refresh tokens stored in HTTP-only cookies to prevent XSS attacks
4. **Token Rotation**: Old refresh tokens are invalidated when new ones are issued
5. **Scheduled Cleanup**: Expired blacklisted tokens are automatically cleaned up daily at 1 AM
