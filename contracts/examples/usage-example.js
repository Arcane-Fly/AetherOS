/**
 * Example: Using MCP Contract Validators in Your Service
 * 
 * This example demonstrates how to integrate contract validation
 * into your microservices for runtime safety.
 */

const { 
  validatePineconeUpsertRequest,
  validateSupabaseSqlRequest,
  validateGitHubSearchIssuesRequest,
  validator
} = require('../validators/schema-validator');

/**
 * Example 1: Pinecone Upsert with Validation
 */
async function safeUpsertVectors(namespace, vectors) {
  // Construct request object
  const request = {
    namespace,
    vectors,
    batchSize: 100
  };
  
  // Validate request before sending to Pinecone
  const validation = validatePineconeUpsertRequest(request);
  
  if (!validation.valid) {
    throw new Error(JSON.stringify({
      error: {
        code: "INVALID_INPUT",
        message: validator.formatErrors(validation.errors),
        retriable: false,
        details: { validationErrors: validation.errors }
      }
    }));
  }
  
  console.log('✅ Request validated successfully');
  
  // Now safe to call actual Pinecone API
  // const result = await pineconeClient.upsert(request);
  // return result;
  
  return { success: true };
}

/**
 * Example 2: Supabase SQL with Validation Wrapper
 */
async function executeSafeQuery(query, params = []) {
  // Validate request
  const request = { query, params, readOnly: true };
  
  try {
    validator.validateOrThrow('supabase/sql.request.json', request);
  } catch (error) {
    console.error('Validation failed:', error.message);
    throw error;
  }
  
  console.log('✅ SQL query validated');
  
  // Execute query
  // const result = await supabase.query(query, params);
  
  // Validate response
  const response = {
    rows: [{ id: 1, name: "Test" }],
    rowCount: 1,
    executionTime: 25.5
  };
  
  const responseValidation = validator.validate('supabase/sql.response.json', response);
  
  if (!responseValidation.valid) {
    throw new Error(JSON.stringify({
      error: {
        code: "UPSTREAM_ERROR",
        message: "Invalid response from database",
        retriable: false,
        details: { validationErrors: responseValidation.errors }
      }
    }));
  }
  
  console.log('✅ Response validated successfully');
  return response;
}

/**
 * Example 3: GitHub Search with Error Handling
 */
async function searchIssues(query, options = {}) {
  const request = {
    query,
    sort: options.sort || 'created',
    order: options.order || 'desc',
    perPage: options.perPage || 30,
    page: options.page || 1
  };
  
  // Validate using convenience function
  const validation = validateGitHubSearchIssuesRequest(request);
  
  if (!validation.valid) {
    const errorMessage = validator.formatErrors(validation.errors);
    console.error('❌ Invalid search parameters:', errorMessage);
    
    return {
      error: {
        code: "INVALID_INPUT",
        message: errorMessage,
        retriable: false
      }
    };
  }
  
  console.log('✅ Search request validated');
  
  // Make API call to GitHub
  // const result = await githubClient.searchIssues(request);
  // return result;
  
  return {
    totalCount: 0,
    items: [],
    incompleteResults: false
  };
}

/**
 * Example 4: Express Middleware for Validation
 */
function validateRequest(schemaPath) {
  return (req, res, next) => {
    const validation = validator.validate(schemaPath, req.body);
    
    if (!validation.valid) {
      return res.status(400).json({
        error: {
          code: "INVALID_INPUT",
          message: validator.formatErrors(validation.errors),
          retriable: false,
          details: { validationErrors: validation.errors }
        }
      });
    }
    
    next();
  };
}

/**
 * Example 5: Using in Express Routes
 * 
 * const express = require('express');
 * const router = express.Router();
 * 
 * router.post('/api/vectors/upsert', 
 *   validateRequest('pinecone/upsert.request.json'),
 *   async (req, res) => {
 *     try {
 *       const result = await safeUpsertVectors(req.body.namespace, req.body.vectors);
 *       res.json(result);
 *     } catch (error) {
 *       res.status(500).json(JSON.parse(error.message));
 *     }
 *   }
 * );
 */

// Run examples
async function runExamples() {
  console.log('🎯 MCP Contract Validation Examples\n');
  console.log('='.repeat(60));
  
  try {
    // Example 1: Valid Pinecone request
    console.log('\n📦 Example 1: Pinecone Upsert');
    console.log('-'.repeat(60));
    await safeUpsertVectors('production', [
      { id: 'doc1', values: [0.1, 0.2, 0.3] }
    ]);
    
    // Example 2: Valid SQL query
    console.log('\n📦 Example 2: Supabase SQL Query');
    console.log('-'.repeat(60));
    await executeSafeQuery('SELECT * FROM users WHERE id = $1', [123]);
    
    // Example 3: Valid GitHub search
    console.log('\n📦 Example 3: GitHub Issue Search');
    console.log('-'.repeat(60));
    await searchIssues('is:issue state:open', { perPage: 50 });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All examples completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runExamples();
}

module.exports = {
  safeUpsertVectors,
  executeSafeQuery,
  searchIssues,
  validateRequest
};
