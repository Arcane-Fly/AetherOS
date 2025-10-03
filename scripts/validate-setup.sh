#!/bin/bash

###############################################################################
# AetherOS Setup Validation Script
# 
# This script validates that the development environment is properly configured
# with all required tools and standards in place.
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        AetherOS Setup Validation Script               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

###############################################################################
# 1. Check Node.js
###############################################################################
echo -e "\n${BLUE}[1] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -ge 20 ]; then
        print_success "Node.js $NODE_VERSION (required: >= 20.0.0)"
    else
        print_error "Node.js version $NODE_VERSION is too old (required: >= 20.0.0)"
    fi
else
    print_error "Node.js is not installed"
fi

###############################################################################
# 2. Check Corepack
###############################################################################
echo -e "\n${BLUE}[2] Checking Corepack...${NC}"
if command -v corepack &> /dev/null; then
    COREPACK_VERSION=$(corepack --version)
    print_success "Corepack $COREPACK_VERSION is available"
else
    print_error "Corepack is not available (run: corepack enable)"
fi

###############################################################################
# 3. Check Yarn
###############################################################################
echo -e "\n${BLUE}[3] Checking Yarn...${NC}"
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    if [[ "$YARN_VERSION" == 4.* ]]; then
        print_success "Yarn $YARN_VERSION (Yarn 4.x detected)"
    else
        print_warning "Yarn version $YARN_VERSION (recommended: 4.9.2+)"
    fi
else
    print_error "Yarn is not installed"
fi

###############################################################################
# 4. Check Git
###############################################################################
echo -e "\n${BLUE}[4] Checking Git...${NC}"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    print_success "Git $GIT_VERSION"
else
    print_error "Git is not installed"
fi

###############################################################################
# 5. Check Configuration Files
###############################################################################
echo -e "\n${BLUE}[5] Checking configuration files...${NC}"

# Root configuration
if [ -f "package.json" ]; then
    print_success "package.json exists"
else
    print_error "package.json not found"
fi

if [ -f ".yarnrc.yml" ]; then
    print_success ".yarnrc.yml exists"
else
    print_error ".yarnrc.yml not found"
fi

# Frontend configuration
if [ -f "frontend/package.json" ]; then
    print_success "frontend/package.json exists"
else
    print_error "frontend/package.json not found"
fi

if [ -f "frontend/.eslintrc.json" ]; then
    print_success "frontend/.eslintrc.json exists"
else
    print_error "frontend/.eslintrc.json not found"
fi

if [ -f "frontend/.prettierrc" ]; then
    print_success "frontend/.prettierrc exists"
else
    print_error "frontend/.prettierrc not found"
fi

if [ -f "frontend/tsconfig.json" ]; then
    print_success "frontend/tsconfig.json exists"
else
    print_error "frontend/tsconfig.json not found"
fi

###############################################################################
# 6. Check Husky
###############################################################################
echo -e "\n${BLUE}[6] Checking Husky pre-commit hooks...${NC}"
if [ -f ".husky/pre-commit" ]; then
    print_success ".husky/pre-commit exists"
    if [ -x ".husky/pre-commit" ]; then
        print_success "pre-commit hook is executable"
    else
        print_warning "pre-commit hook is not executable (run: chmod +x .husky/pre-commit)"
    fi
else
    print_error ".husky/pre-commit not found"
fi

###############################################################################
# 7. Check Documentation
###############################################################################
echo -e "\n${BLUE}[7] Checking documentation...${NC}"
if [ -f "docs/SETUP.md" ]; then
    print_success "docs/SETUP.md exists"
else
    print_warning "docs/SETUP.md not found"
fi

if [ -f "docs/development-standards.md" ]; then
    print_success "docs/development-standards.md exists"
else
    print_warning "docs/development-standards.md not found"
fi

if [ -f "docs/python-standards.md" ]; then
    print_success "docs/python-standards.md exists"
else
    print_warning "docs/python-standards.md not found"
fi

###############################################################################
# 8. Check Dependencies
###############################################################################
echo -e "\n${BLUE}[8] Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    print_success "node_modules directory exists"
else
    print_warning "node_modules not found (run: yarn install)"
fi

if [ -d "frontend/node_modules" ]; then
    print_success "frontend/node_modules exists"
else
    print_warning "frontend/node_modules not found (run: yarn install)"
fi

###############################################################################
# 9. Check Yarn Workspaces
###############################################################################
echo -e "\n${BLUE}[9] Checking Yarn workspaces...${NC}"
if yarn workspaces list &> /dev/null; then
    WORKSPACE_COUNT=$(yarn workspaces list 2>/dev/null | wc -l)
    print_success "Yarn workspaces configured ($WORKSPACE_COUNT workspaces)"
else
    print_error "Yarn workspaces not working properly"
fi

###############################################################################
# 10. Optional Checks
###############################################################################
echo -e "\n${BLUE}[10] Optional checks...${NC}"

# Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    print_success "Docker $DOCKER_VERSION (optional)"
else
    print_info "Docker not installed (optional for production deployment)"
fi

# Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | awk '{print $4}' | sed 's/,//')
    print_success "Docker Compose $COMPOSE_VERSION (optional)"
else
    print_info "Docker Compose not installed (optional for production deployment)"
fi

###############################################################################
# Summary
###############################################################################
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   Validation Summary                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Passed:   $PASSED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Failed:   $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "  1. Run 'yarn install' if dependencies are missing"
    echo "  2. Run 'cd frontend && yarn dev' to start development server"
    echo "  3. Review docs/SETUP.md for detailed instructions"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some critical checks failed!${NC}"
    echo ""
    echo -e "${BLUE}Please fix the errors above and run this script again.${NC}"
    echo ""
    echo -e "${BLUE}Common fixes:${NC}"
    echo "  - Install Node.js 20+: https://nodejs.org/"
    echo "  - Enable Corepack: corepack enable"
    echo "  - Activate Yarn 4.9.2: corepack prepare yarn@4.9.2 --activate"
    echo "  - Install dependencies: yarn install"
    echo ""
    echo "See docs/SETUP.md for detailed troubleshooting"
    echo ""
    exit 1
fi
