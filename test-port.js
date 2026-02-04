#!/usr/bin/env node
const http = require('http');

// Try to connect to port 3000
const req = http.request({
  hostname: '127.0.0.1',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 5000
}, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes`);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.on('timeout', () => {
  console.error('Timeout');
  req.destroy();
});

req.end();