# Python Development Standards for AetherOS

## Overview

This document establishes Python development standards for AetherOS backend services and scripts, following PEP 8 guidelines and industry best practices.

## Prerequisites

- **Python**: >= 3.9
- **pip**: Latest version

## Installation

### Setting up Python Linting Tools

```bash
# Install Python linting and formatting tools
pip install pylint black flake8 mypy

# Or using requirements-dev.txt
pip install -r requirements-dev.txt
```

## Naming Conventions

### Files
- **Modules**: `snake_case.py` (e.g., `user_service.py`, `database_helper.py`)
- **Packages**: `snake_case/` (e.g., `auth_service/`, `api_helpers/`)

### Code Elements

#### Variables and Functions
```python
# Variables: snake_case
user_name = "John Doe"
total_count = 0
api_response = {}

# Functions: snake_case
def fetch_user_data():
    pass

def calculate_total_amount(items):
    pass

def is_valid_email(email):
    pass
```

#### Classes
```python
# Classes: PascalCase
class UserAccount:
    pass

class DatabaseConnection:
    pass

class ApiClient:
    pass
```

#### Constants
```python
# Constants: UPPER_SNAKE_CASE
API_BASE_URL = "https://api.example.com"
MAX_RETRY_ATTEMPTS = 3
DEFAULT_TIMEOUT_SECONDS = 30
DATABASE_CONNECTION_POOL_SIZE = 10
```

#### Private Members
```python
# Private variables/functions: prefix with underscore
class MyClass:
    def __init__(self):
        self._private_variable = None
    
    def _private_method(self):
        pass
    
    def public_method(self):
        return self._private_method()
```

## Code Style

### Formatting with Black

Black is the uncompromising Python code formatter. It ensures consistent formatting across the codebase.

**Configuration**: `.black.toml` or `pyproject.toml`

```toml
[tool.black]
line-length = 100
target-version = ['py39']
include = '\.pyi?$'
exclude = '''
/(
    \.git
  | \.venv
  | build
  | dist
)/
'''
```

**Usage**:
```bash
# Format a file
black path/to/file.py

# Format entire directory
black .

# Check formatting without making changes
black --check .
```

### Linting with Pylint

Pylint checks code quality and enforces PEP 8 compliance.

**Configuration**: `.pylintrc`

```ini
[MASTER]
# Add paths to sys.path
init-hook='import sys; sys.path.append(".")'

[MESSAGES CONTROL]
# Disable specific warnings
disable=C0114,C0115,C0116,W0212,R0903,R0913

[FORMAT]
# Maximum line length
max-line-length=100

# String used for indentation
indent-string='    '

[BASIC]
# Naming conventions
module-naming-style=snake_case
class-naming-style=PascalCase
function-naming-style=snake_case
method-naming-style=snake_case
attr-naming-style=snake_case
argument-naming-style=snake_case
variable-naming-style=snake_case
const-naming-style=UPPER_CASE

[DESIGN]
# Maximum number of arguments
max-args=7

# Maximum number of attributes
max-attributes=10
```

**Usage**:
```bash
# Lint a file
pylint path/to/file.py

# Lint entire directory
pylint src/

# Generate a .pylintrc file
pylint --generate-rcfile > .pylintrc
```

### Type Checking with mypy

mypy provides static type checking for Python.

**Configuration**: `mypy.ini` or `pyproject.toml`

```ini
[mypy]
python_version = 3.9
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = False
check_untyped_defs = True

[mypy-tests.*]
disallow_untyped_defs = False
```

**Usage**:
```bash
# Type check a file
mypy path/to/file.py

# Type check entire directory
mypy src/
```

## Example Python Module

### Sample Service Module

**File**: `backend/services/user_service.py`

```python
"""
User Service Module

This module provides functions for user management operations
including fetching, creating, and updating user data.
"""

from typing import Optional, Dict, List
import logging
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

# Constants
DEFAULT_USER_ROLE = "user"
MAX_USERNAME_LENGTH = 50
MIN_PASSWORD_LENGTH = 8


class UserData:
    """
    User data model class
    
    Attributes:
        user_id: Unique identifier for the user
        username: User's username
        email: User's email address
        created_at: Timestamp when user was created
    """
    
    def __init__(
        self,
        user_id: str,
        username: str,
        email: str,
        created_at: datetime
    ):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.created_at = created_at
    
    def to_dict(self) -> Dict:
        """Convert user data to dictionary"""
        return {
            'user_id': self.user_id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }


def fetch_user_by_id(user_id: str) -> Optional[UserData]:
    """
    Fetch user data by user ID
    
    Args:
        user_id: Unique identifier for the user
        
    Returns:
        UserData object if found, None otherwise
        
    Raises:
        ValueError: If user_id is empty or invalid
    """
    if not user_id:
        raise ValueError("user_id cannot be empty")
    
    try:
        # Example database query (pseudocode)
        # user_record = database.query("SELECT * FROM users WHERE id = ?", user_id)
        # if user_record:
        #     return UserData(**user_record)
        
        logger.info(f"Fetching user with ID: {user_id}")
        return None
    except Exception as error:
        logger.error(f"Error fetching user: {error}")
        return None


def create_user(username: str, email: str, password: str) -> Optional[UserData]:
    """
    Create a new user
    
    Args:
        username: Desired username
        email: User's email address
        password: User's password (will be hashed)
        
    Returns:
        UserData object if created successfully, None otherwise
        
    Raises:
        ValueError: If validation fails
    """
    # Validate inputs
    if not username or len(username) > MAX_USERNAME_LENGTH:
        raise ValueError(f"Username must be 1-{MAX_USERNAME_LENGTH} characters")
    
    if not email or '@' not in email:
        raise ValueError("Invalid email address")
    
    if len(password) < MIN_PASSWORD_LENGTH:
        raise ValueError(f"Password must be at least {MIN_PASSWORD_LENGTH} characters")
    
    try:
        # Hash password
        hashed_password = _hash_password(password)
        
        # Create user in database (pseudocode)
        # user_id = database.insert("users", {
        #     'username': username,
        #     'email': email,
        #     'password': hashed_password,
        #     'created_at': datetime.now()
        # })
        
        logger.info(f"Created user: {username}")
        return None  # Would return actual UserData object
    except Exception as error:
        logger.error(f"Error creating user: {error}")
        return None


def update_user_email(user_id: str, new_email: str) -> bool:
    """
    Update user's email address
    
    Args:
        user_id: User's unique identifier
        new_email: New email address
        
    Returns:
        True if updated successfully, False otherwise
    """
    if not user_id or not new_email:
        return False
    
    if '@' not in new_email:
        logger.warning(f"Invalid email format: {new_email}")
        return False
    
    try:
        # Update database (pseudocode)
        # database.update("users", {'email': new_email}, {'id': user_id})
        
        logger.info(f"Updated email for user {user_id}")
        return True
    except Exception as error:
        logger.error(f"Error updating email: {error}")
        return False


def get_users_by_role(role: str = DEFAULT_USER_ROLE) -> List[UserData]:
    """
    Get all users with a specific role
    
    Args:
        role: User role to filter by
        
    Returns:
        List of UserData objects
    """
    try:
        # Query database (pseudocode)
        # users = database.query("SELECT * FROM users WHERE role = ?", role)
        # return [UserData(**user) for user in users]
        
        logger.info(f"Fetching users with role: {role}")
        return []
    except Exception as error:
        logger.error(f"Error fetching users by role: {error}")
        return []


def _hash_password(password: str) -> str:
    """
    Hash password using secure algorithm
    
    This is a private helper function.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    # In production, use bcrypt or similar
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()


# Module-level validation function
def is_valid_username(username: str) -> bool:
    """
    Check if username is valid
    
    Args:
        username: Username to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not username:
        return False
    
    if len(username) > MAX_USERNAME_LENGTH:
        return False
    
    # Check for valid characters (alphanumeric and underscore)
    return username.replace('_', '').isalnum()
```

## Project Structure

### Recommended Structure for Python Modules

```
backend/services/
├── auth_service/
│   ├── src/
│   │   ├── __init__.py
│   │   ├── controllers/
│   │   │   ├── __init__.py
│   │   │   ├── auth_controller.py
│   │   │   └── user_controller.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   └── token_service.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user_model.py
│   │   │   └── session_model.py
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── validators.py
│   │   │   └── helpers.py
│   │   └── config/
│   │       ├── __init__.py
│   │       └── settings.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_auth_controller.py
│   │   └── test_auth_service.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── .pylintrc
│   └── pyproject.toml
```

## Best Practices

### 1. Documentation

Always include docstrings for modules, classes, and functions:

```python
def function_name(param1: str, param2: int) -> bool:
    """
    Brief description of what the function does.
    
    More detailed explanation if needed.
    
    Args:
        param1: Description of param1
        param2: Description of param2
        
    Returns:
        Description of return value
        
    Raises:
        ValueError: When validation fails
    """
    pass
```

### 2. Type Hints

Use type hints for better code clarity and IDE support:

```python
from typing import List, Dict, Optional, Union

def process_data(data: Dict[str, str]) -> List[int]:
    pass

def get_user(user_id: str) -> Optional[UserData]:
    pass
```

### 3. Error Handling

Always handle exceptions appropriately:

```python
import logging

logger = logging.getLogger(__name__)

def safe_operation():
    try:
        # Risky operation
        result = perform_operation()
        return result
    except SpecificException as error:
        logger.error(f"Specific error occurred: {error}")
        # Handle specific error
    except Exception as error:
        logger.error(f"Unexpected error: {error}")
        # Handle generic error
    finally:
        # Cleanup code
        pass
```

### 4. Logging

Use Python's logging module instead of print statements:

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Use appropriate log levels
logger.debug("Debug information")
logger.info("Informational message")
logger.warning("Warning message")
logger.error("Error message")
logger.critical("Critical error")
```

### 5. Configuration

Keep configuration separate from code:

```python
# config/settings.py
import os
from typing import Optional

class Settings:
    """Application settings"""
    
    # API Configuration
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:3000")
    API_TIMEOUT: int = int(os.getenv("API_TIMEOUT", "30"))
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://localhost/aetheros")
    DATABASE_POOL_SIZE: int = int(os.getenv("DATABASE_POOL_SIZE", "10"))
    
    # Security
    JWT_SECRET: Optional[str] = os.getenv("JWT_SECRET")
    
    @classmethod
    def validate(cls):
        """Validate required settings"""
        if not cls.JWT_SECRET:
            raise ValueError("JWT_SECRET must be set")

settings = Settings()
settings.validate()
```

## Development Workflow

### 1. Before Committing

```bash
# Format code with Black
black .

# Lint with Pylint
pylint src/

# Type check with mypy
mypy src/

# Run tests
pytest tests/
```

### 2. CI/CD Integration

Add these checks to your CI pipeline:

```yaml
# Example GitHub Actions workflow
- name: Format check
  run: black --check .

- name: Lint
  run: pylint src/

- name: Type check
  run: mypy src/

- name: Run tests
  run: pytest tests/ --cov=src/
```

## Testing

### Unit Testing with pytest

```python
# tests/test_user_service.py
import pytest
from src.services.user_service import (
    is_valid_username,
    create_user,
    UserData
)

def test_is_valid_username():
    """Test username validation"""
    assert is_valid_username("john_doe") is True
    assert is_valid_username("") is False
    assert is_valid_username("a" * 51) is False

def test_create_user_with_invalid_email():
    """Test user creation with invalid email"""
    with pytest.raises(ValueError):
        create_user("john", "invalid-email", "password123")

@pytest.fixture
def sample_user():
    """Fixture for sample user data"""
    from datetime import datetime
    return UserData(
        user_id="123",
        username="john_doe",
        email="john@example.com",
        created_at=datetime.now()
    )

def test_user_to_dict(sample_user):
    """Test UserData to_dict method"""
    user_dict = sample_user.to_dict()
    assert user_dict['user_id'] == "123"
    assert user_dict['username'] == "john_doe"
```

## Summary

Following these Python standards ensures:
- **Consistent code style** across all Python modules
- **Better maintainability** with clear naming conventions
- **Improved code quality** through linting and type checking
- **Professional documentation** with proper docstrings
- **Robust error handling** and logging

For more information:
- [PEP 8 Style Guide](https://peps.python.org/pep-0008/)
- [Black Documentation](https://black.readthedocs.io/)
- [Pylint Documentation](https://pylint.readthedocs.io/)
- [mypy Documentation](https://mypy.readthedocs.io/)
