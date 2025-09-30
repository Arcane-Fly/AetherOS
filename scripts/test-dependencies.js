#!/usr/bin/env node

/**
 * Dependency Testing Script for AetherOS
 * Validates that all essential dependencies are properly installed and can be loaded
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing AetherOS Dependencies...\n');

// Test function for loading dependencies
function testDependencies(serviceName, dependencies, basePath = '.') {
    console.log(`📦 Testing ${serviceName} dependencies...`);
    
    const errors = [];
    
    dependencies.forEach(dep => {
        try {
            // Change to service directory if specified
            if (basePath !== '.') {
                process.chdir(path.join(__dirname, '..', basePath));
            }
            
            require(dep);
            console.log(`  ✓ ${dep}`);
        } catch (error) {
            console.log(`  ✗ ${dep} - ${error.message}`);
            errors.push({ dependency: dep, error: error.message });
        }
    });
    
    if (errors.length === 0) {
        console.log(`  ✅ All ${serviceName} dependencies loaded successfully\n`);
        return true;
    } else {
        console.log(`  ❌ ${errors.length} ${serviceName} dependencies failed to load\n`);
        return false;
    }
}

// Reset to original directory
const originalDir = process.cwd();

let allTestsPassed = true;

// Test Root Dependencies
process.chdir(originalDir);
const rootSuccess = testDependencies('Root', ['pg', 'concurrently']);
allTestsPassed = allTestsPassed && rootSuccess;

// Test Frontend Dependencies  
process.chdir(path.join(originalDir, 'frontend'));
const frontendSuccess = testDependencies('Frontend', [
    'react', 
    'react-dom', 
    '@monaco-editor/react',
    'socket.io-client',
    'framer-motion'
]);
allTestsPassed = allTestsPassed && frontendSuccess;

// Test Auth Service Dependencies
process.chdir(path.join(originalDir, 'backend/services/auth-service'));
const authSuccess = testDependencies('Auth Service', [
    'express', 
    'bcrypt', 
    'jsonwebtoken', 
    'pg',
    'passport',
    'helmet',
    'cors'
]);
allTestsPassed = allTestsPassed && authSuccess;

// Test Generation Service Dependencies
process.chdir(path.join(originalDir, 'backend/services/generation-service'));
const genSuccess = testDependencies('Generation Service', [
    'express',
    'openai',
    'redis',
    'helmet',
    'cors',
    'joi'
]);
allTestsPassed = allTestsPassed && genSuccess;

// Test WebSocket Service Dependencies
process.chdir(path.join(originalDir, 'backend/services/websocket-service'));
const wsSuccess = testDependencies('WebSocket Service', [
    'express',
    'socket.io',
    'redis',
    'jsonwebtoken',
    'helmet',
    'cors'
]);
allTestsPassed = allTestsPassed && wsSuccess;

// Reset to original directory
process.chdir(originalDir);

// Final result
if (allTestsPassed) {
    console.log('🎉 All AetherOS dependencies are properly installed and accessible!');
    process.exit(0);
} else {
    console.log('❌ Some dependencies failed to load. Check the errors above.');
    process.exit(1);
}