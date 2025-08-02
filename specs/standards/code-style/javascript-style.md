# JavaScript Code Style Guide

## Language-Specific Standards for AetherOS

### Function Declarations

**Prefer function expressions for consistency:**
```javascript
// Good
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Good (for more complex functions)
const processOrder = async (order) => {
  const validatedOrder = await validateOrder(order);
  const processedOrder = await processPayment(validatedOrder);
  return processedOrder;
};

// Avoid (unless hoisting is needed)
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Object and Array Handling

**Use destructuring for cleaner code:**
```javascript
// Good
const { username, email, preferences } = user;
const [first, second, ...rest] = items;

// Good
const userProfile = {
  ...existingProfile,
  lastUpdated: new Date(),
};

// Good
const updatedItems = [...items, newItem];
```

### Async/Await vs Promises

**Prefer async/await for readability:**
```javascript
// Good
const fetchUserData = async (userId) => {
  try {
    const user = await api.getUser(userId);
    const preferences = await api.getUserPreferences(userId);
    return { user, preferences };
  } catch (error) {
    logger.error('Failed to fetch user data:', error);
    throw new Error('User data unavailable');
  }
};

// Avoid (unless chaining is clearer)
const fetchUserData = (userId) => {
  return api.getUser(userId)
    .then(user => api.getUserPreferences(userId)
      .then(preferences => ({ user, preferences })))
    .catch(error => {
      logger.error('Failed to fetch user data:', error);
      throw new Error('User data unavailable');
    });
};
```

### Error Handling

**Use descriptive error messages and proper error types:**
```javascript
// Good
const validateUser = (user) => {
  if (!user.email) {
    throw new ValidationError('Email is required');
  }
  if (!isValidEmail(user.email)) {
    throw new ValidationError('Invalid email format');
  }
  return true;
};

// Good
const processApiCall = async (endpoint, data) => {
  try {
    return await api.call(endpoint, data);
  } catch (error) {
    if (error.status === 429) {
      throw new RateLimitError('API rate limit exceeded');
    }
    if (error.status >= 500) {
      throw new ServiceError('External service unavailable');
    }
    throw error;
  }
};
```

### Module Imports/Exports

**Use clear, organized imports:**
```javascript
// Good - Group imports logically
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Button, Input } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { validateForm } from '../utils/validation';

import './component.css';

// Good - Named exports for utilities
export const formatDate = (date) => {
  return date.toLocaleDateString();
};

export const calculateAge = (birthDate) => {
  return new Date().getFullYear() - birthDate.getFullYear();
};

// Good - Default export for main component
export default UserProfile;
```

### Variable Declarations

**Use const by default, let when reassignment is needed:**
```javascript
// Good
const API_BASE_URL = 'https://api.aetheros.dev';
const users = await fetchUsers();

// Good
let currentUser = null;
if (authToken) {
  currentUser = await validateToken(authToken);
}

// Avoid
var message = 'Hello'; // Never use var
```

### Comments and Documentation

**Write meaningful comments:**
```javascript
// Good - Explains business logic
const calculateSubscriptionPrice = (plan, discountCode) => {
  // Apply enterprise discount for organizations with 50+ users
  if (plan.userCount >= 50 && plan.type === 'enterprise') {
    return plan.basePrice * 0.8;
  }
  
  // Standard discount code processing
  return applyDiscountCode(plan.basePrice, discountCode);
};

// Good - JSDoc for public APIs
/**
 * Generates code using OpenAI API with retry logic
 * @param {string} prompt - Natural language prompt
 * @param {Object} options - Generation options
 * @param {string} options.language - Target programming language
 * @param {number} options.maxTokens - Maximum tokens to generate
 * @returns {Promise<GenerationResult>} Generated code and metadata
 */
const generateCode = async (prompt, options = {}) => {
  // Implementation
};
```

### Performance Considerations

**Optimize for common use cases:**
```javascript
// Good - Memoize expensive calculations
const expensiveCalculation = useMemo(() => {
  return complexDataProcessing(largeDataset);
}, [largeDataset]);

// Good - Debounce user input
const debouncedSearch = useCallback(
  debounce((query) => {
    performSearch(query);
  }, 300),
  []
);

// Good - Use object lookups instead of switch/if chains
const STATUS_MESSAGES = {
  pending: 'Processing your request...',
  success: 'Operation completed successfully',
  error: 'An error occurred',
};

const getStatusMessage = (status) => STATUS_MESSAGES[status] || 'Unknown status';
```

### Testing Considerations

**Write testable code:**
```javascript
// Good - Pure functions are easy to test
const calculateTax = (amount, rate) => {
  return Math.round(amount * rate * 100) / 100;
};

// Good - Dependency injection for external services
const createUserService = (database, emailService) => ({
  async createUser(userData) {
    const user = await database.create(userData);
    await emailService.sendWelcomeEmail(user.email);
    return user;
  }
});

// Good - Separate business logic from UI
const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  
  const addUser = useCallback(async (userData) => {
    const newUser = await userService.create(userData);
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);
  
  return { users, addUser };
};
```