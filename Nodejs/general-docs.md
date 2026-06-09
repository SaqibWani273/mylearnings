Flow of a nodejs application endpoint

Request
  ↓
Logger Middleware                     -------|             
  ↓                                          |
Authentication Middleware                    |
  ↓                                          |  -> Middleware(s)
Authorization Middleware                     |
  ↓                                          |
Request Validation Middleware        --------|
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
  ↓
Service
  ↓
Controller
  ↓
Error Handler Middleware
  ↓
Response