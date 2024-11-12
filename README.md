# EduProjectLog - Frontend

## Project Overview

EduProjectLog is a web application that allows teachers to log in, add, update, and delete student projects. The frontend is built using React.js and includes features like filtering projects, viewing project details, and uploading project-related documents.

## Features

- User authentication and login
- Add new projects (with project category, description, student details, and file uploads)
- Filter and search projects by year and category
- Download project-related documents
- Responsive design

## Tech Stack

- **React.js**: Frontend library for building the user interface
- **TailwindCSS**: Utility-first CSS framework for styling
- **React Router**: For handling page navigation
- **MUI DataGrid**: For displaying project data in a table format

## Getting Started

### Prerequisites

- Node.js installed on your system
- npm or yarn (package manager)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/EduProjectLog-frontend.git
    cd EduProjectLog-frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```


3. Create a `.env` file in the root of the project and add the following:

    ```bash
    DOMAIN_NAME=http://localhost:5000
    ```

4. Start the development server:
    ```bash
    npm start
    ```

The application should now be running on `http://localhost:5000`.

## Folder Structure

```bash
├── public
├── src
│   ├── components
│   ├── Handlers
│   ├── assets
│   ├── context
│   ├── main.jsx
│   └── App.jsx
├── index.html
├── .env
├── package.json
└── tailwind.config.js
```

## Known Issues

- Large file uploads can occasionally time out due to network limits.
- Some older browsers may not fully support the file upload feature.
