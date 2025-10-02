#!/usr/bin/env node

/**
 * Validate Example Fixtures
 * 
 * Tests example fixtures against their corresponding schemas.
 */

const fs = require('fs');
const path = require('path');
const { validator } = require('../validators/schema-validator');

const examplesDir = path.join(__dirname, '..', 'examples');

const exampleSchemaMap = {
  'pinecone-upsert-valid.json': 'pinecone/upsert.request.json',
  'supabase-sql-valid.json': 'supabase/sql.request.json',
  'github-searchIssues-valid.json': 'github/searchIssues.request.json',
  'browserbase-navigate-valid.json': 'browserbase/navigate.request.json'
};

function main() {
  console.log('🔍 Validating Example Fixtures...\n');
  
  if (!fs.existsSync(examplesDir)) {
    console.log('⚠️  No examples directory found');
    process.exit(0);
  }
  
  const exampleFiles = fs.readdirSync(examplesDir)
    .filter(f => f.endsWith('.json'));
  
  if (exampleFiles.length === 0) {
    console.log('⚠️  No example files found');
    process.exit(0);
  }
  
  let totalExamples = 0;
  let validExamples = 0;
  let invalidExamples = 0;
  
  for (const fileName of exampleFiles) {
    const schemaPath = exampleSchemaMap[fileName];
    
    if (!schemaPath) {
      console.log(`⚠️  ${fileName} - No schema mapping found, skipping`);
      continue;
    }
    
    totalExamples++;
    
    try {
      const examplePath = path.join(examplesDir, fileName);
      const exampleContent = fs.readFileSync(examplePath, 'utf-8');
      const exampleData = JSON.parse(exampleContent);
      
      const result = validator.validate(schemaPath, exampleData);
      
      if (result.valid) {
        console.log(`✅ ${fileName}`);
        validExamples++;
      } else {
        console.log(`❌ ${fileName}`);
        console.log(`   Schema: ${schemaPath}`);
        console.log(`   Errors: ${validator.formatErrors(result.errors)}`);
        invalidExamples++;
      }
    } catch (error) {
      console.log(`❌ ${fileName}`);
      console.log(`   Error: ${error.message}`);
      invalidExamples++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`Total examples: ${totalExamples}`);
  console.log(`Valid: ${validExamples}`);
  console.log(`Invalid: ${invalidExamples}`);
  
  if (invalidExamples > 0) {
    console.log('\n❌ Example validation failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All examples are valid!');
    process.exit(0);
  }
}

main();
