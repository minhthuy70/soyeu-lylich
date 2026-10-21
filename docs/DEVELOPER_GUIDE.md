# Developer Guide

## Table of Contents
1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Setup](#setup)
4. [Backend Development](#backend-development)
5. [Frontend Development](#frontend-development)
6. [Database](#database)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Contributing](#contributing)

## Project Structure

```
soyeulylich/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── profile/         # Profile module
│   │   ├── project/         # Project module
│   │   ├── achievement/    # Achievement module
│   │   ├── integrations/    # Integrations module
│   │   ├── analytics/       # Analytics module
│   │   ├── security-audit/  # Security audit module
│   │   ├── error-tracking/   # Error tracking module
│   │   ├── web-vitals/       # Web Vitals module
│   │   ├── webhooks/        # Webhooks module
│   │   ├── middleware/      # Custom middleware
│   │   ├── prisma/          # Prisma schema
│   │   └── app.module.ts     # Main app module
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── test/                 # Test files
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example          # Environment variables template
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom hooks
│   │   ├── contexts/         # React contexts
│   │   ├── i18n/             # Translations
│   │   ├── styles/           # Global styles
│   │   └── App.jsx           # Main app component
│   ├── public/
│   ├── package.json
│   ├── vite.config.js        # Vite configuration
│   ├── Dockerfile
│   └── nginx.conf            # Nginx configuration
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
├── k8s/                     # Kubernetes manifests
├── monitoring/              # Monitoring configuration
├── .github/                 # GitHub Actions workflows
├── docker-compose.yml        # Docker Compose for local dev
└── SOYEULYLICH_FEATURES.md  # Feature inventory
```

## Prerequisites

### Required Software
- Node.js 18 or higher
- npm or yarn
- PostgreSQL 15 or higher
- Git
- Docker (optional, for containerization)
- Docker Compose (optional)

### Optional Software
- VS Code or other IDE
- Postman or similar API testing tool
- pgAdmin (PostgreSQL GUI)

## Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd soyeulylich
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npx prisma generate
npx prisma db push
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Using Docker Compose
```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## Backend Development

### Adding a New Module
```bash
nest g module <module-name>
nest g controller <module-name>
nest g service <module-name>
```

### Database Schema Changes
1. Edit `backend/prisma/schema.prisma`
2. Run migration:
```bash
npx prisma db push
npx prisma generate
```

### Adding API Endpoints
1. Create DTO in `src/<module>/dto/`
2. Add method in controller
3. Implement logic in service
4. Register in module

### Authentication
Most endpoints require JWT authentication. Include in headers:
```
Authorization: Bearer <token>
```

### Middleware
Custom middleware in `src/middleware/`:
- CORS
- CSRF
- Rate Limiting
- Request Logging
- Compression
- Cache Control

## Frontend Development

### Component Structure
```
components/
├── ProfilePage.jsx          # Main profile page
├── AnalyticsDashboard.jsx   # Analytics dashboard
├── IntegrationsPage.jsx    # Integrations management
├── Modal.jsx               # Reusable modal
├── FormWizard.jsx          # Multi-step form
└── ...                     # Other components
```

### Creating a New Component
```jsx
import React from 'react';

export default function NewComponent({ prop1, prop2 }) {
  return (
    <div className="new-component">
      {/* Component content */}
    </div>
  );
}
```

### API Service
Create service in `src/services/`:
```javascript
import { API_BASE } from './config';

export const apiService = {
  async getData() {
    const response = await fetch(`${API_BASE}/endpoint`);
    return response.json();
  },
};
```

### Custom Hooks
Create hook in `src/hooks/`:
```javascript
import { useState, useEffect } from 'react';

export function useCustomHook() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Hook logic
  }, []);

  return data;
}
```

### Styling
- Use CSS modules or component-specific CSS files
- Follow naming convention: `ComponentName.css`
- Support light/dark themes via CSS variables

## Database

### Prisma ORM
Prisma is used for database access.

### Common Operations
```typescript
// Create
await prisma.model.create({ data: {...} });

// Read
await prisma.model.findMany({ where: {...} });

// Update
await prisma.model.update({ where: {id}, data: {...} });

// Delete
await prisma.model.delete({ where: {id} });
```

### Migrations
Use Prisma migrations for schema changes:
```bash
npx prisma migrate dev --name <migration-name>
npx prisma migrate deploy
```

## Testing

### Backend Testing
```bash
cd backend
npm test              # Run all tests
npm run test:cov      # Run with coverage
npm run test:e2e      # End-to-end tests
```

### Frontend Testing
```bash
cd frontend
npm test              # Run all tests
npm run test:coverage # Run with coverage
```

### Test Structure
```
backend/
└── src/
    └── <module>/
        ├── <module>.controller.spec.ts
        └── <module>.service.spec.ts
```

## Deployment

### Using Docker
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Using Kubernetes
```bash
# Apply manifests
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Check status
kubectl get pods
kubectl get services
```

### CI/CD
GitHub Actions workflow in `.github/workflows/ci-cd.yml`:
- Runs tests on push
- Builds Docker images
- Pushes to Docker Hub
- Deploys to production on main branch

### Environment Variables
Required environment variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- And more (see .env.example)

## Contributing

### Code Style
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Write tests for new features

### Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Adding tests

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request
6. Address review feedback

### Code Review
- All PRs require review
- At least one approval required
- CI must pass
- Tests must pass

## Performance Optimization

### Backend
- Use Prisma query optimization
- Implement caching where appropriate
- Use database indexes
- Optimize N+1 queries

### Frontend
- Use lazy loading for heavy components
- Implement code splitting
- Optimize images
- Use React.memo for expensive components
- Debounce user input

## Security

### Best Practices
- Never commit secrets
- Use environment variables
- Validate all inputs
- Sanitize all outputs
- Use HTTPS in production
- Implement rate limiting
- Enable CORS only for trusted origins

### Authentication
- JWT-based authentication
- OAuth2 for social login
- Two-factor authentication available
- Session timeout management

## Troubleshooting

### Common Issues

**Prisma Client Generation Error**
```bash
npx prisma generate
```

**Database Connection Error**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check firewall settings

**Frontend Build Error**
- Clear node_modules and reinstall
- Check Node.js version
- Verify dependencies in package.json

**Docker Build Fails**
- Check Dockerfile syntax
- Verify Docker daemon is running
- Check network connectivity

## Resources

### Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vite Documentation](https://vitejs.dev/)

### Community
- GitHub Issues
- Discord server (if available)
- Stack Overflow

## License
This project is licensed under the MIT License.
