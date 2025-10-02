#!/usr/bin/env node

/**
 * Test Schema Validators
 * 
 * Basic tests to ensure validators work correctly.
 */

const {
  validatePineconeUpsertRequest,
  validatePineconeQueryRequest,
  validateSupabaseSqlRequest,
  validateBrowserbaseNavigateRequest,
  validateGitHubSearchIssuesRequest,
  validateErrorEnvelope
} = require('../validators/schema-validator');

function testValidation(name, validator, validData, invalidData) {
  console.log(`\nTesting ${name}...`);
  
  // Test valid data
  const validResult = validator(validData);
  if (validResult.valid) {
    console.log(`  ✅ Valid data passed`);
  } else {
    console.log(`  ❌ Valid data failed: ${JSON.stringify(validResult.errors)}`);
    return false;
  }
  
  // Test invalid data
  const invalidResult = validator(invalidData);
  if (!invalidResult.valid) {
    console.log(`  ✅ Invalid data rejected`);
  } else {
    console.log(`  ❌ Invalid data passed when it should have failed`);
    return false;
  }
  
  return true;
}

function main() {
  console.log('🧪 Testing MCP Contract Validators\n');
  console.log('='.repeat(60));
  
  let passedTests = 0;
  let failedTests = 0;
  
  // Test Pinecone Upsert
  if (testValidation(
    'Pinecone Upsert Request',
    validatePineconeUpsertRequest,
    {
      namespace: "test",
      vectors: [{ id: "1", values: [0.1, 0.2] }]
    },
    {
      namespace: "",  // Invalid: empty namespace
      vectors: []      // Invalid: empty array
    }
  )) {
    passedTests++;
  } else {
    failedTests++;
  }
  
  // Test Pinecone Query
  if (testValidation(
    'Pinecone Query Request',
    validatePineconeQueryRequest,
    {
      namespace: "test",
      vector: [0.1, 0.2, 0.3]
    },
    {
      namespace: "test"
      // Missing required 'vector' field
    }
  )) {
    passedTests++;
  } else {
    failedTests++;
  }
  
  // Test Supabase SQL
  if (testValidation(
    'Supabase SQL Request',
    validateSupabaseSqlRequest,
    {
      query: "SELECT * FROM users",
      params: [],
      readOnly: true
    },
    {
      query: "",  // Invalid: empty query
      timeout: 500  // Invalid: below minimum
    }
  )) {
    passedTests++;
  } else {
    failedTests++;
  }
  
  // Test Browserbase Navigate
  if (testValidation(
    'Browserbase Navigate Request',
    validateBrowserbaseNavigateRequest,
    {
      url: "https://example.com",
      waitUntil: "load"
    },
    {
      url: "not-a-url",  // Invalid: not a URI
      waitUntil: "invalid"  // Invalid: not in enum
    }
  )) {
    passedTests++;
  } else {
    failedTests++;
  }
  
  // Test GitHub Search Issues
  if (testValidation(
    'GitHub Search Issues Request',
    validateGitHubSearchIssuesRequest,
    {
      query: "is:issue state:open",
      perPage: 30
    },
    {
      query: "",  // Invalid: empty query
      perPage: 200  // Invalid: exceeds maximum
    }
  )) {
    passedTests++;
  } else {
    failedTests++;
  }
  
  // Test Error Envelope
  if (testValidation(
    'Error Envelope',
    validateErrorEnvelope,
    {
      error: {
        code: "INVALID_INPUT",
        message: "Test error",
        retriable: false
      }
    },
    {
      error: {
        code: "UNKNOWN_CODE",  // Invalid: not in enum
        message: "Test"
      }
    }
  )) {
    passedTests++;
  } else {
    failedTests++;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  
  if (failedTests > 0) {
    console.log('\n❌ Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  }
}

main();
