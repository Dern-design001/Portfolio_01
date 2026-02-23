# Design Document: Portfolio MongoDB Vercel Deployment

## Overview

This design provides a comprehensive solution for deploying a React portfolio application with MongoDB Atlas backend to Vercel. The architecture leverages Vercel's serverless functions for the backend API, ensuring scalability and cost-effectiveness. The system implements secure credential management, efficient database connection pooling, and proper separation between frontend and backend concerns.

The deployment strategy focuses on:
- Serverless architecture for backend API endpoints
- Secure environment variable management
- Efficient MongoDB connection reuse in serverless context
- Automated deployment pipeline via GitHub integration
- Proper project structure for Vercel's build system

## Architecture

### High-Level Architecture

```mermaid
graph TB
    User[User Browser] --> Vercel[Vercel CDN]
    Vercel --> Frontend[React Frontend]
    Vercel --> API[Serverless API Functions]
    API --> MongoDB[(MongoDB Atlas)]
    GitHub[GitHub Repository] --> Vercel
    
    subgraph "Vercel Platform"
        Frontend
        API
    end
```

### Component Interaction Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Vercel
    participant API
    participant DB as MongoDB Atlas
    
    Browser->>Vercel: Request Page
    Vercel->>Browser: Serve React App
    Browser->>API: API Request (/api/projects)
    API->>DB: Query/Update Data
    DB->>API: Return Data
    API->>Browser: JSON Response
```

### Deployment Architecture

The application follows a monorepo structure where both frontend and backend code reside in the same repository:

- **Frontend**: React application built and served as static files from Vercel CDN
- **Backend**: Express.js API routes deployed as individual serverless functions
- **Database**: MongoDB Atlas cluster accessed via connection string
- **CI/CD**: Automatic deployments triggered by GitHub pushes

## Components and Interfaces

### 1. Database Connection Manager (`api/db.js`)

**Purpose**: Manages MongoDB Atlas connections with connection pooling optimized for serverless environments.

**Key Responsibilities**:
- Establish and cache MongoDB connection
- Handle connection reuse across function invocations
- Manage connection lifecycle in serverless context
- Provide error handling for connection failures

**Interface**:
```javascript
// Exports a function that returns a cached MongoDB connection
async function connectToDatabase() {
  // Returns: { db: MongoDatabase, client: MongoClient }
}
```

**Implementation Details**:
- Uses module-level caching to reuse connections across warm starts
- Implements connection pooling with appropriate pool size for serverless
- Reads `MONGODB_URI` from environment variables
- Handles cold starts gracefully

### 2. Mongoose Models (`api/models/`)

**Purpose**: Define data schemas and provide data validation for all entities.

**Models**:

**Profile Model** (`api/models/Profile.js`):
```javascript
{
  name: String (required),
  title: String (required),
  bio: String,
  email: String,
  phone: String,
  location: String,
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String
  },
  skills: [String],
  updatedAt: Date
}
```

**Project Model** (`api/models/Project.js`):
```javascript
{
  title: String (required),
  description: String (required),
  technologies: [String],
  imageUrl: String,
  projectUrl: String,
  githubUrl: String,
  featured: Boolean,
  category: String,
  startDate: Date,
  endDate: Date,
  createdAt: Date
}
```

**Venture Model** (`api/models/Venture.js`):
```javascript
{
  title: String (required),
  description: String (required),
  type: String (required), // e.g., "art", "music", "writing"
  imageUrl: String,
  externalUrl: String,
  featured: Boolean,
  createdAt: Date
}
```

**Milestone Model** (`api/models/Milestone.js`):
```javascript
{
  title: String (required),
  description: String,
  date: Date (required),
  category: String,
  icon: String,
  createdAt: Date
}
```

### 3. API Routes (`api/*.js`)

**Purpose**: Serverless functions handling HTTP requests for CRUD operations.

**Route Structure**:
- `api/profile.js` - GET/PUT profile data
- `api/projects.js` - GET/POST/PUT/DELETE projects
- `api/ventures.js` - GET/POST/PUT/DELETE ventures
- `api/milestones.js` - GET/POST/PUT/DELETE milestones

**Standard Route Pattern**:
```javascript
// Each route exports a handler function
module.exports = async (req, res) => {
  // 1. Connect to database
  // 2. Parse request method and body
  // 3. Perform database operation
  // 4. Return JSON response with appropriate status code
  // 5. Handle errors with try-catch
}
```

**HTTP Methods**:
- GET: Retrieve data (single or list)
- POST: Create new entity
- PUT: Update existing entity
- DELETE: Remove entity

**Response Format**:
```javascript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: "Error message" }
```

### 4. Vercel Configuration (`vercel.json`)

**Purpose**: Configure Vercel build and routing behavior.

**Configuration Structure**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

**Key Settings**:
- `builds`: Specifies how to build the React frontend
- `routes`: Defines URL routing (API routes vs static files)
- API routes automatically become serverless functions

### 5. Environment Configuration

**Local Development** (`.env`):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
NODE_ENV=development
```

**Vercel Environment Variables**:
- Set via Vercel Dashboard under Project Settings → Environment Variables
- Same variables as local .env
- Available to serverless functions at runtime

### 6. Git Configuration (`.gitignore`)

**Purpose**: Prevent sensitive files from being committed to version control.

**Key Exclusions**:
```
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.production

# Build outputs
build/
dist/
.vercel/

# IDE
.vscode/
.idea/

# OS
.DS_Store
```

## Data Models

### Entity Relationship

```mermaid
erDiagram
    PROFILE ||--o{ PROJECT : creates
    PROFILE ||--o{ VENTURE : creates
    PROFILE ||--o{ MILESTONE : achieves
    
    PROFILE {
        string name
        string title
        string bio
        object socialLinks
        array skills
    }
    
    PROJECT {
        string title
        string description
        array technologies
        string imageUrl
        string projectUrl
        boolean featured
    }
    
    VENTURE {
        string title
        string description
        string type
        string imageUrl
        boolean featured
    }
    
    MILESTONE {
        string title
        string description
        date date
        string category
    }
```

### Data Flow

1. **Read Operations**: Frontend → API Route → MongoDB Query → Response
2. **Write Operations**: Frontend → API Route → Validation → MongoDB Write → Response
3. **Connection Management**: API Route → Connection Manager → Cached Connection → MongoDB

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Environment Variable Connection

*For any* serverless function invocation, when the Connection_Manager initializes, it should successfully establish a MongoDB connection using only environment variables without any hardcoded credentials.

**Validates: Requirements 1.1, 1.4**

### Property 2: Connection Pooling Invariant

*For any* sequence of API requests, the number of active MongoDB connections should remain constant (connection reuse), demonstrating that the Connection_Manager properly pools connections rather than creating new ones for each request.

**Validates: Requirements 1.2**

### Property 3: Connection Failure Error Handling

*For any* invalid MongoDB connection configuration (wrong URI, invalid credentials, network failure), the Connection_Manager should return a descriptive error message and log the failure without crashing the application.

**Validates: Requirements 1.3, 8.5**

### Property 4: No Hardcoded Credentials

*For any* source code file in the repository, scanning for patterns matching connection strings, API keys, passwords, or other credentials should return zero matches, confirming all sensitive values are externalized to environment variables.

**Validates: Requirements 1.4, 4.1, 4.3, 4.4**

### Property 5: Cold Start Handling

*For any* simulated cold start scenario (new function instance), the Connection_Manager should successfully establish a connection within acceptable time limits and handle the first request correctly.

**Validates: Requirements 1.5**

### Property 6: Profile API CRUD Operations

*For any* valid profile data object, performing create/read/update operations via the `/api/profile` endpoint should correctly persist and retrieve the data, with the retrieved data matching the submitted data.

**Validates: Requirements 2.1**

### Property 7: Entity CRUD Operations

*For any* entity type (projects, ventures, milestones) and any valid entity data, performing create, read, update, and delete operations should work correctly, with data persisting accurately and deletions removing the entity completely.

**Validates: Requirements 2.2, 2.3, 2.4**

### Property 8: HTTP Error Status Codes

*For any* error condition (invalid request data → 400, resource not found → 404, server error → 500), the Backend_API should return the appropriate HTTP status code along with a descriptive error message.

**Validates: Requirements 2.5, 8.2, 8.3, 8.4**

### Property 9: Input Validation Before Database

*For any* invalid request data (missing required fields, wrong data types, malformed input), the Backend_API should reject the request with validation errors before attempting any database operations.

**Validates: Requirements 2.6**

### Property 10: Schema Validation

*For any* invalid data that violates Mongoose schema constraints (missing required fields, wrong types), attempting to save to MongoDB should fail with validation errors, preventing invalid data from being persisted.

**Validates: Requirements 7.5**

### Property 11: Database Error Logging

*For any* database operation failure (connection timeout, query error, write failure), the Backend_API should log detailed error information including the operation type, error message, and timestamp.

**Validates: Requirements 8.1, 8.4**

## Error Handling

### Error Categories

**1. Connection Errors**
- MongoDB connection failures
- Network timeouts
- Authentication failures
- **Handling**: Return 503 Service Unavailable, log error details, provide retry guidance

**2. Validation Errors**
- Missing required fields
- Invalid data types
- Schema constraint violations
- **Handling**: Return 400 Bad Request with specific field errors

**3. Not Found Errors**
- Requested resource doesn't exist
- Invalid entity ID
- **Handling**: Return 404 Not Found with resource identifier

**4. Server Errors**
- Unexpected exceptions
- Database query failures
- Internal logic errors
- **Handling**: Return 500 Internal Server Error, log full stack trace, hide internal details from client

### Error Response Format

```javascript
{
  success: false,
  error: {
    message: "Human-readable error message",
    code: "ERROR_CODE",
    details: {} // Optional additional context
  }
}
```

### Logging Strategy

- **Development**: Console logs with full error details
- **Production**: Structured logging with error levels (ERROR, WARN, INFO)
- **Sensitive Data**: Never log credentials or personal information
- **Context**: Include request ID, timestamp, user context (if available)

## Testing Strategy

### Dual Testing Approach

This project requires both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and integration points
- **Property tests**: Verify universal properties across randomized inputs

### Unit Testing

**Focus Areas**:
- Specific API endpoint examples (GET /api/profile returns expected structure)
- Edge cases (empty arrays, null values, boundary conditions)
- Error conditions (specific invalid inputs, connection failures)
- Integration between components (API route → Model → Database)

**Testing Framework**: Jest with Supertest for API testing

**Example Unit Tests**:
- Test GET /api/projects returns array of projects
- Test POST /api/projects with missing title returns 400
- Test DELETE /api/projects/:id removes the project
- Test connection manager handles null environment variable

### Property-Based Testing

**Focus Areas**:
- Universal properties that hold for all valid inputs
- CRUD operations work correctly for any valid entity data
- Error handling works correctly for any invalid input
- Connection pooling maintains invariants across any request sequence

**Testing Framework**: fast-check (JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: portfolio-mongodb-vercel-deployment, Property {N}: {property_text}**

**Example Property Tests**:
- For any valid project data, create then read should return equivalent data
- For any entity type, CRUD operations should maintain data integrity
- For any invalid connection string, connection should fail gracefully
- For any sequence of requests, connection count should remain constant

### Test Environment

**Local Testing**:
- Use MongoDB Memory Server for isolated database testing
- Mock environment variables for different scenarios
- Test both cold start and warm start scenarios

**CI/CD Testing**:
- Run full test suite on every commit
- Require all tests to pass before deployment
- Test against actual MongoDB Atlas test cluster for integration tests

### Coverage Goals

- **Code Coverage**: Minimum 80% line coverage
- **Property Coverage**: Every correctness property has a corresponding property test
- **Error Path Coverage**: All error handling paths tested
- **API Coverage**: All endpoints tested for success and failure cases
