/**
 * Schema Validator Utility
 * 
 * Provides runtime validation for MCP contract schemas using Ajv.
 * Validates both request and response payloads against JSON schemas.
 */

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

class SchemaValidator {
  constructor() {
    this.ajv = new Ajv({ 
      allErrors: true, 
      strict: false,  // Allow additional properties in schemas
      validateFormats: true,
      allowUnionTypes: true
    });
    addFormats(this.ajv);
    
    // Add support for JSON Schema draft 2020-12
    const addMetaSchema2020 = require('ajv/dist/refs/json-schema-2020-12');
    addMetaSchema2020.default.call(this.ajv, false);
    
    this.validators = new Map();
  }

  /**
   * Load and compile a schema from file
   * @param {string} schemaPath - Relative path to schema file from contracts directory
   * @returns {Function} Compiled validator function
   */
  loadSchema(schemaPath) {
    if (this.validators.has(schemaPath)) {
      return this.validators.get(schemaPath);
    }

    const fullPath = path.join(__dirname, '..', schemaPath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schemaContent = fs.readFileSync(fullPath, 'utf-8');
    const schema = JSON.parse(schemaContent);
    
    const validator = this.ajv.compile(schema);
    this.validators.set(schemaPath, validator);
    
    return validator;
  }

  /**
   * Validate data against a schema
   * @param {string} schemaPath - Path to schema file
   * @param {any} data - Data to validate
   * @returns {object} Validation result with { valid, errors }
   */
  validate(schemaPath, data) {
    const validator = this.loadSchema(schemaPath);
    const valid = validator(data);
    
    return {
      valid,
      errors: valid ? null : validator.errors
    };
  }

  /**
   * Validate and throw error if invalid
   * @param {string} schemaPath - Path to schema file
   * @param {any} data - Data to validate
   * @param {string} errorCode - Error code to use if validation fails
   * @throws {Error} If validation fails
   */
  validateOrThrow(schemaPath, data, errorCode = 'INVALID_INPUT') {
    const result = this.validate(schemaPath, data);
    
    if (!result.valid) {
      const errorMessage = this.ajv.errorsText(result.errors);
      throw new Error(JSON.stringify({
        error: {
          code: errorCode,
          message: errorMessage,
          retriable: false,
          details: { validationErrors: result.errors }
        }
      }));
    }
  }

  /**
   * Format validation errors as a human-readable string
   * @param {array} errors - Array of Ajv validation errors
   * @returns {string} Formatted error message
   */
  formatErrors(errors) {
    if (!errors || errors.length === 0) {
      return 'No errors';
    }
    return this.ajv.errorsText(errors, { separator: '; ' });
  }
}

// Export singleton instance
const validator = new SchemaValidator();

module.exports = {
  validator,
  SchemaValidator,
  
  // Convenience functions for common operations
  validatePineconeUpsertRequest: (data) => 
    validator.validate('pinecone/upsert.request.json', data),
  validatePineconeUpsertResponse: (data) => 
    validator.validate('pinecone/upsert.response.json', data),
  validatePineconeQueryRequest: (data) => 
    validator.validate('pinecone/query.request.json', data),
  validatePineconeQueryResponse: (data) => 
    validator.validate('pinecone/query.response.json', data),
  
  validateSupabaseSqlRequest: (data) => 
    validator.validate('supabase/sql.request.json', data),
  validateSupabaseSqlResponse: (data) => 
    validator.validate('supabase/sql.response.json', data),
  
  validateBrowserbaseNavigateRequest: (data) => 
    validator.validate('browserbase/navigate.request.json', data),
  validateBrowserbaseNavigateResponse: (data) => 
    validator.validate('browserbase/navigate.response.json', data),
  validateBrowserbaseScreenshotRequest: (data) => 
    validator.validate('browserbase/screenshot.request.json', data),
  validateBrowserbaseScreenshotResponse: (data) => 
    validator.validate('browserbase/screenshot.response.json', data),
  
  validateGitHubSearchIssuesRequest: (data) => 
    validator.validate('github/searchIssues.request.json', data),
  validateGitHubSearchIssuesResponse: (data) => 
    validator.validate('github/searchIssues.response.json', data),
  validateGitHubSearchPRsRequest: (data) => 
    validator.validate('github/searchPullRequests.request.json', data),
  validateGitHubSearchPRsResponse: (data) => 
    validator.validate('github/searchPullRequests.response.json', data),
  
  validateErrorEnvelope: (data) => 
    validator.validate('shared/error.envelope.json', data)
};
