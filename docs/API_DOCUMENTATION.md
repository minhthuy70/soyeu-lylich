# API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: `https://api.soyeulylich.com`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset-token",
  "newPassword": "NewSecurePassword123"
}
```

### Profile

#### GET /profile
Get current user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "title": "Software Engineer",
  "bio": "Experienced developer",
  "phone": "+1234567890",
  "address": "123 Main St",
  "website": "https://example.com"
}
```

#### PUT /profile
Update current user's profile.

**Request Body:**
```json
{
  "name": "John Doe",
  "title": "Senior Software Engineer",
  "bio": "Updated bio",
  "phone": "+1234567890",
  "address": "456 Oak Ave",
  "website": "https://newsite.com"
}
```

### Projects

#### GET /projects
Get all projects for current user.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Project A",
      "description": "Description",
      "startDate": "2024-01-01",
      "endDate": "2024-06-30",
      "technologies": ["React", "Node.js"],
      "status": "completed"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

#### POST /projects
Create a new project.

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "technologies": ["React", "TypeScript"],
  "status": "in-progress"
}
```

#### PUT /projects/:id
Update a project.

#### DELETE /projects/:id
Delete a project.

### Achievements

#### GET /achievements
Get all achievements for current user.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Certification",
      "description": "AWS Certified",
      "date": "2024-01-15",
      "issuer": "Amazon Web Services",
      "certificateUrl": "https://example.com/cert"
    }
  ]
}
```

#### POST /achievements
Create a new achievement.

### Analytics

#### POST /analytics/track
Track user behavior event.

**Request Body:**
```json
{
  "eventType": "click",
  "page": "/profile",
  "element": "save-button",
  "metadata": {
    "section": "personal-info"
  }
}
```

#### GET /analytics/dashboard
Get dashboard analytics summary.

**Query Parameters:**
- `startDate`: Start date (ISO format)
- `endDate`: End date (ISO format)

**Response:**
```json
{
  "behavior": {
    "totalEvents": 1000,
    "eventTypeCounts": {
      "click": 500,
      "scroll": 300,
      "form_submit": 200
    },
    "topPages": [
      {"page": "/profile", "views": 100},
      {"page": "/projects", "views": 50}
    ]
  },
  "sessions": {
    "totalSessions": 50,
    "averageDuration": 300,
    "bounceRate": "25.5"
  }
}
```

### Integrations

#### GET /integrations
Get all integrations for current user.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "provider": "github",
      "providerUserId": "github-user-id",
      "accessToken": "encrypted-token",
      "isActive": true
    }
  ]
}
```

#### POST /integrations
Connect a new integration.

**Request Body:**
```json
{
  "provider": "github",
  "code": "oauth-code",
  "redirectUri": "http://localhost:5173/auth/github/callback"
}
```

### Security Audit

#### GET /security-audit/recent
Get recent security audit logs.

**Query Parameters:**
- `limit`: Number of logs (default: 50)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "action": "LOGIN",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "severity": "INFO",
      "status": "SUCCESS",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Web Vitals

#### POST /web-vitals
Record Core Web Vitals metrics.

**Request Body:**
```json
{
  "name": "LCP",
  "value": 2500,
  "id": "lcp",
  "delta": 0,
  "rating": "good"
}
```

#### GET /web-vitals/average
Get average Web Vitals metrics.

**Response:**
```json
{
  "LCP": 2300,
  "FID": 50,
  "CLS": 0.05,
  "FCP": 1500,
  "TTFB": 500
}
```

## Error Responses

All endpoints may return error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "message": "Too many requests",
  "error": "TOO_MANY_REQUESTS",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Rate Limiting
- 100 requests per minute per IP
- Headers included: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Pagination
Most list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

## CORS
Allowed origins configured via environment variable `ALLOWED_ORIGINS`.

## CSRF Protection
State-changing requests require CSRF token in header:
```
X-CSRF-Token: <token>
```
Token available in cookie `_csrf`.
