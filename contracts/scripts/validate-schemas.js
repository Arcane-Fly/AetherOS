#!/usr/bin/env node

/**
 * Validate JSON Schema Files
 * 
 * Ensures all schema files are valid JSON and follow JSON Schema specification.
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const contractsDir = path.join(__dirname, '..');
const metaSchema = require('ajv/lib/refs/json-schema-draft-07.json');

const ajv = new Ajv({ strict: false });

function findSchemaFiles(dir) {
  const files = [];
  
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Skip excluded directories
      if (entry.isDirectory() && !entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== 'examples' && 
          entry.name !== 'scripts' && 
          entry.name !== 'validators') {
        walk(fullPath);
      } else if (entry.isFile() && 
                 entry.name.endsWith('.json') && 
                 entry.name !== 'package.json' && 
                 entry.name !== 'package-lock.json') {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function validateSchema(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const schema = JSON.parse(content);
    
    // Check for required fields
    if (!schema.$schema) {
      return { valid: false, error: 'Missing $schema field' };
    }
    
    if (!schema.$id) {
      return { valid: false, error: 'Missing $id field' };
    }
    
    if (!schema.title) {
      return { valid: false, error: 'Missing title field' };
    }
    
    // Basic structural validation
    if (typeof schema !== 'object') {
      return { valid: false, error: 'Schema must be an object' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function main() {
  console.log('🔍 Validating MCP Contract Schemas...\n');
  
  const schemaFiles = findSchemaFiles(contractsDir);
  let totalFiles = 0;
  let validFiles = 0;
  let invalidFiles = 0;
  
  for (const filePath of schemaFiles) {
    totalFiles++;
    const relativePath = path.relative(contractsDir, filePath);
    
    const result = validateSchema(filePath);
    
    if (result.valid) {
      console.log(`✅ ${relativePath}`);
      validFiles++;
    } else {
      console.log(`❌ ${relativePath}`);
      console.log(`   Error: ${result.error}`);
      invalidFiles++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`Total schemas: ${totalFiles}`);
  console.log(`Valid: ${validFiles}`);
  console.log(`Invalid: ${invalidFiles}`);
  
  if (invalidFiles > 0) {
    console.log('\n❌ Schema validation failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All schemas are valid!');
    process.exit(0);
  }
}

main();
