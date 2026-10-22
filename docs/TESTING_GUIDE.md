# Testing Guide

## Overview
This document describes the testing strategy and how to run tests for the Sơ yếu lý lịch application.

## Backend Testing

### Unit Tests
Unit tests test individual functions and services in isolation.

**Run unit tests:**
```bash
cd backend
npm test
```

**Run unit tests with coverage:**
```bash
cd backend
npm run test:cov
```

**Run unit tests in watch mode:**
```bash
cd backend
npm run test:watch
```

### API/Integration Tests
API tests test the entire application from HTTP request to response.

**Run API tests:**
```bash
cd backend
npm run test:e2e
```

### Test Files Structure
```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.service.spec.ts       # Unit tests for AuthService
│   │   └── auth.controller.spec.ts    # Unit tests for AuthController
│   ├── profile/
│   │   └── profile.service.spec.ts    # Unit tests for ProfileService
│   ├── project/
│   │   └── project.service.spec.ts    # Unit tests for ProjectService
│   └── analytics/
│       └── analytics.service.spec.ts  # Unit tests for AnalyticsService
└── test/
    └── api.e2e-spec.ts                # API endpoint tests
```

### What's Tested
- **Authentication**: Login, register, password reset
- **Profile**: CRUD operations, validation
- **Projects**: CRUD operations, pagination
- **Analytics**: Event tracking, dashboard data
- **API Endpoints**: Request/response, error handling, authentication

## Frontend Testing

### Unit Tests
Unit tests test React components and hooks in isolation.

**Run unit tests:**
```bash
cd frontend
npm test
```

**Run unit tests with coverage:**
```bash
cd frontend
npm run test:coverage
```

**Run unit tests in watch mode:**
```bash
cd frontend
npm run test:watch
```

### Test Files Structure
```
frontend/
├── src/
│   ├── hooks/
│   │   ├── useAutoSave.test.js        # AutoSave hook tests
│   │   ├── useDebounce.test.js        # Debounce hook tests
│   │   └── usePerformance.test.js    # Performance hook tests
│   └── components/
│       ├── Modal.test.jsx             # Modal component tests
│       ├── FormWizard.test.jsx        # FormWizard component tests
│       ├── ProfilePage.test.jsx       # Form validation tests
│       └── ProfilePage.responsive.test.jsx  # Responsive design tests
```

### What's Tested
- **Hooks**: Auto-save, debounce, performance tracking
- **Components**: Modal, FormWizard, ProfilePage
- **Form Validation**: Required fields, email format, phone format, URL format, password strength
- **Responsive Design**: Mobile, tablet, desktop layouts, orientation changes
- **User Interactions**: Click events, form submissions, navigation

## Test Coverage Goals

### Backend
- Services: 80%+ coverage
- Controllers: 70%+ coverage
- Critical paths: 90%+ coverage

### Frontend
- Components: 70%+ coverage
- Hooks: 80%+ coverage
- Critical user flows: 90%+ coverage

## Writing Tests

### Backend Unit Test Example
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### Frontend Component Test Example
```jsx
import { render, screen } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  it('should render when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={jest.fn()} title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## CI/CD Integration

Tests run automatically on:
- Push to any branch
- Pull requests to main/develop

The CI/CD pipeline will:
1. Run backend tests
2. Run frontend tests
3. Build the application
4. Deploy if tests pass

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Test names should describe what they test
3. **Arrange-Act-Assert**: Structure tests with clear sections
4. **Mock External Dependencies**: Use mocks for databases, APIs
5. **Test Edge Cases**: Test both happy paths and error cases
6. **Keep Tests Fast**: Avoid slow operations in tests
7. **Review Coverage**: Regularly review coverage reports

## Troubleshooting

### Backend Tests Failing
- Check if database is running
- Verify environment variables
- Check for missing dependencies
- Review error messages in test output

### Frontend Tests Failing
- Check if all dependencies are installed
- Verify test configuration
- Check for missing setup files
- Review error messages in test output

### Coverage Low
- Identify untested code paths
- Add tests for critical functions
- Review edge cases
- Test error handling

## Resources
- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
