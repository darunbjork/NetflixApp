# NetflixApp

## Project Overview

NetflixApp is a full-stack web application designed to provide users with a platform to browse movies, view details, manage favorites, and handle user authentication. The application features a dynamic frontend built with HTML, CSS, and JavaScript, consuming data from a robust Node.js backend API.

## Features

-   **User Authentication**: Secure registration, login, and logout functionalities.
-   **Movie Browsing**: View a comprehensive list of movies with details such as title, genre, year, director, rating, and description.
-   **Dynamic Carousels**: Engaging carousels on the homepage to showcase the latest movies.
-   **Premiere Listings**: Dedicated page to display upcoming movie premieres.
-   **Favorite Movies**: Users can add and remove movies from their personal favorites list.
-   **Responsive Design**: Optimized for various screen sizes, from desktop to mobile.
-   **Dark Mode Toggle**: User-friendly option to switch between light and dark themes.

## Technologies Used

### Frontend

-   **HTML5**: Structure of the web pages.
-   **CSS3**: Styling and responsive design.
-   **JavaScript (ES6+)**: Dynamic content, API interactions, and client-side logic.

### Backend

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web application framework for building RESTful APIs.
-   **MongoDB**: NoSQL database for storing movie and user data.
-   **Mongoose**: MongoDB object data modeling (ODM) for Node.js.
-   **bcryptjs**: For password hashing and security.
-   **jsonwebtoken**: For user authentication (JWTs).
-   **dotenv**: For managing environment variables.
-   **cors**: Middleware for enabling Cross-Origin Resource Sharing.

## Setup and Installation (Local Development)

To get a local copy of the project up and running, follow these steps:

### Prerequisites

-   Node.js (LTS version recommended)
-   npm (Node Package Manager)
-   MongoDB (local instance or cloud service like MongoDB Atlas)
-   Git

### 1. Clone the Repository

```bash
git clone https://github.com/darunbjork/NetflixApp.git
cd NetflixApp
```

### 2. Backend Setup

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the **root directory** of the project (i.e., `NetflixApp/.env`) with your MongoDB connection string and JWT secrets. Replace placeholders with your actual values:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

Start the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:3000`.

### 3. Frontend Setup

The frontend is served statically by the backend. Ensure your `frontend/js/api.js` is configured to point to your local backend:

```javascript
// frontend/js/api.js
const API_BASE_URL = '/api/movies'; // For local development
```

Open `frontend/index.html` in your browser, or access it via `http://localhost:3000` once the backend is running.

## Deployment

This application is designed for deployment on platforms that support Node.js web services and static site hosting.

### Backend Deployment (Render.com)

The backend is deployed as a Web Service on [Render.com](https://render.com/).

**Key Configuration on Render:**

-   **Service Type**: Web Service
-   **Root Directory**: `backend/`
-   **Runtime**: Node
-   **Build Command**: `npm install`
-   **Start Command**: `npm start`
-   **Environment Variables**: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `JWT_COOKIE_EXPIRE` (configured in Render dashboard, not from `.env` file directly).

### Frontend Deployment (Render Static Site or GitHub Pages)

The frontend can be deployed as a Static Site on Render or other static hosting providers (e.g., GitHub Pages).

**Key Configuration for Frontend:**

-   **Root Directory**: `frontend/`
-   **Publish Directory**: `./` (or `build/` if a build step is introduced).
-   **API_BASE_URL**: The `frontend/js/api.js` file must be updated to point to the public URL of the deployed backend service (e.g., `https://your-backend-service.onrender.com/api/movies`).

## API Endpoints

### Authentication

-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Log in a user.
-   `GET /api/auth/me`: Get current user details (protected).
-   `GET /api/auth/logout`: Log out a user.
-   `PUT /api/auth/favorites/:movieId`: Add movie to favorites (protected).
-   `DELETE /api/auth/favorites/:movieId`: Remove movie from favorites (protected).

### Movies

-   `GET /api/movies`: Get all movies (supports filtering, sorting, pagination).
-   `GET /api/movies/:id`: Get a single movie by ID.
-   `POST /api/movies`: Create a new movie (requires authentication/authorization).
-   `PUT /api/movies/:id`: Update a movie by ID (requires authentication/authorization).
-   `DELETE /api/movies/:id`: Delete a movie by ID (requires authentication/authorization).

## Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit a pull request with your improvements.

## License

This project is licensed under the ISC License.

## Contact

For any inquiries or feedback, please contact [darunbjork](mailto:your.email@example.com).
