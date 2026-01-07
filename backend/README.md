# MediTrack Backend

## Overview
This is the backend API for MediTrack, built with Node.js, Express, and MongoDB.

## Features
- RESTful API for patient records, users, appointments, and notifications
- JWT authentication and role-based access control
- File upload support
- Notification system

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with MongoDB URI and JWT secret:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
3. Start the server:
   ```bash
   npm run dev
   ``` 