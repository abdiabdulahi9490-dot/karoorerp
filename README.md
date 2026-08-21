# Karoor ERP - Scaffold

This repository contains a production-ready scaffold for a modern ERP built with Node.js, Express and MySQL tailored for Plesk Node.js hosting.

Requirements
- Node.js 20+
- MySQL 8+
- Plesk Node.js support

Quick start

1. Copy .env.example to .env and edit values.
2. Install dependencies:

   npm install

3. Create database and run the SQL in db.sql.
4. Start the app:

   npm start

Plesk configuration
- Application Root: erp (root of this project)
- Application Startup File: app.js
- Application Mode: production
- Use the PORT variable provided by Plesk (process.env.PORT)

Security notes
- Replace the default session store (MemoryStore) with a production-ready store (Redis, MySQL-backed, etc.) in Plesk environment.
- Use strong SESSION_SECRET and secure DB credentials.

Development notes
- This scaffold uses CommonJS modules and requires no build step.
- Do not add dummy data to the database.

