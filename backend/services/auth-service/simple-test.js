require('dotenv').config();

console.log('Starting auth service test...');

try {
  const express = require('express');
  console.log('Express loaded');
  
  const { connectDB } = require('./src/models/database');
  console.log('Database module loaded');
  
  const app = express();
  console.log('Express app created');
  
  connectDB().then(() => {
    console.log('Database connected successfully');
    
    app.listen(3001, () => {
      console.log('Auth service started on port 3001');
    });
  }).catch(err => {
    console.error('Database connection failed:', err);
  });
  
} catch (error) {
  console.error('Error:', error);
}
