# Problem 5 ExpressJS + TypeScript CRUD API

This project contains a minimal backend server built with ExpressJS and TypeScript. It implements a fully functioning REST API with CRUD capabilities using a simple SQLite database for data persistence.

## Features

- **TypeScript Support**: Strongly typed codebase.
- **SQLite Database**: Lightweight disk-based persistence without complex setups.
- **CRUD Matrix**:
    - **Create Resource**: `POST /api/items`
    - **List Resources (w/ Filters)**: `GET /api/items?name=foo&minPrice=10&maxPrice=50`
    - **Get Resource**: `GET /api/items/:id`
    - **Update Resource**: `PUT /api/items/:id`
    - **Delete Resource**: `DELETE /api/items/:id`

## Requirements

- Node.js (Version 16+ Recommended)
- npm or yarn

## Installation

1. Navigate to the project directory:
   ```bash
   cd src/problem5
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

## Running the Application

To run the application in development mode (using `ts-node` to compile and run TypeScript on the fly), simply execute:

```bash
npm run dev
# OR 
npm start
```

The server will initialize the SQLite database table locally if it doesn't already exist and listen on port `3000`. You should see terminal logs indicating the database was connected and the server is running.

## Examples using `curl`

### 1. Create a Resource
```bash
curl -X POST http://localhost:3000/api/items \
-H "Content-Type: application/json" \
-d '{"name": "Gaming Mouse", "description": "Ergonomic 12000 DPI", "price": 49.99}'
```

### 2. List Resources (with Basic Filter)
```bash
# Fetch all
curl -X GET http://localhost:3000/api/items

# Fetch with query params
curl -X GET "http://localhost:3000/api/items?minPrice=20&maxPrice=100"
```

### 3. Get Resource Details
```bash
curl -X GET http://localhost:3000/api/items/1
```

### 4. Update Resource
```bash
curl -X PUT http://localhost:3000/api/items/1 \
-H "Content-Type: application/json" \
-d '{"price": 39.99}'
```

### 5. Delete a Resource
```bash
curl -X DELETE http://localhost:3000/api/items/1
```
