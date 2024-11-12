
# EduProjectLog - Backend

## Project Overview

The backend for EduProjectLog handles project data storage, user authentication, and file uploads. It is built using Node.js, Express, and MongoDB.

## Features

- User authentication (JWT-based)
- CRUD operations for projects
- File uploads (Cloudinary integration)
- API endpoints for searching, filtering, and retrieving projects

## Tech Stack

- **Node.js**: JavaScript runtime for building the backend
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing project data
- **Mongoose**: ODM for MongoDB
- **Cloudinary**: For file upload and management
- **JWT**: For user authentication

## Getting Started

### Prerequisites

- Node.js installed on your system
- MongoDB instance running locally or on the cloud
- Cloudinary account for file uploads

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/EduProjectLog-backend.git
    cd EduProjectLog-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the project and add the following:

    ```bash
    PORT=4000
    MONGODB_URI=mongodb://localhost:27017/eduprojectlog
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4. Start the development server:
    ```bash
    npm start
    ```

The server will now run on `http://localhost:5000`.

## API Endpoints

| Method | Endpoint                  | Description                 |
|--------|---------------------------|-----------------------------|
| POST   | `/api/login`               | User login                  |
| POST   | `/api/projects`            | Add new project             |
| GET    | `/api/projects`            | Get all projects            |
| GET    | `/api/projects/:id`        | Get a project by ID         |
| PUT    | `/api/projects/:id`        | Update a project            |
| DELETE | `/api/projects/:id`        | Delete a project            |

## Folder Structure

```bash
├── Handlers
├── Schema
├── Module
├── index.js
├── router.js
└── .env
```

## Database Setup

The project uses MongoDB. To set up the database:

1. Install MongoDB locally or use a cloud solution like MongoDB Atlas.
2. Create a database called `eduprojectlog`.
3. Add your MongoDB connection URI in the `.env` file under `MONGODB_URI`.

## Security Features

- Passwords are hashed using bcrypt.
- JWT tokens are used for user authentication and are configured to expire after a set duration for security.

## Known Issues

- Large file uploads can occasionally time out due to network limits.
- Some older browsers may not fully support the file upload feature.
