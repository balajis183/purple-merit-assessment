# GreenCart Logistics - Delivery Simulation & KPI Dashboard

Welcome to the GreenCart Logistics project, a full-stack web application designed to simulate delivery operations and analyze Key Performance Indicators (KPIs). This internal tool allows managers to experiment with staffing, schedules, and routing to optimize for profit and efficiency.

---

## Live Deployment Links

* **Frontend (Vercel)**: [`https://green-cart-dashboard.vercel.app/`](https://green-cart-dashboard.vercel.app/)
* **Backend (Render)**: [`https://purple-merit-assessment.onrender.com/`](https://purple-merit-assessment.onrender.com/)
* **GitHub Repository**: [`https://github.com/balajis183/purple-merit-assessment`](https://github.com/balajis183/purple-merit-assessment)

---

## Features

* **Secure Manager Authentication**: JWT-based authentication ensures only authorized managers can access the dashboard.
* **Dynamic Simulation**: Run delivery simulations with variable inputs like the number of drivers and max work hours.
* **KPI Dashboard**: View the results of the latest simulation, including Total Profit, Efficiency Score, and charts for delivery status and fuel costs.
* **Data Management**: Full CRUD (Create, Read, Update, Delete) functionality for managing Drivers, Routes, and Orders.
* **Simulation History**: A dedicated page to review the results and inputs of all past simulation runs.

---

## Tech Stack & Dependencies

### Frontend (React.js)

* **React**: Core UI library.
* **React Router (`react-router-dom`)**: For client-side routing and navigation.
* **Chart.js & `react-chartjs-2`**: For rendering dynamic charts on the dashboard.
* **React Icons**: For including icons in the UI.

### Backend (Node.js & Express)

* **Node.js**: JavaScript runtime environment.
* **Express.js**: Web framework for building the API.
* **MongoDB & Mongoose**: Database and Object Data Modeling (ODM) library.
* **JSON Web Token (`jsonwebtoken`)**: For user authentication.
* **bcryptjs**: For secure password hashing.
* **Dotenv**: For managing environment variables.
* **CORS**: For enabling cross-origin requests.
* **RBAC** Role based authentication - Checks manager along with JWT

---

## Local Setup and Installation

To run this project locally, follow these steps.

### Prerequisites

* Node.js and npm (or yarn) installed.
* Git installed.
* A MongoDB Atlas account (or a local MongoDB instance).

### 1. Clone the Repository

```bash
git clone https://github.com/balajis183/purple-merit-assessment.git
cd purple-merit-assessment
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the /backend root and add the following variables:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_super_secret_jwt_key
# PORT=5000

# Seed the database with initial data (optional but recommended)
npm run seed

# Start the backend server
npm run dev
```

The backend server will be running on `http://localhost:5000`.

### 3. Frontend Setup

```bash
# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend will be running on `http://localhost:3000` and will be connected to your local backend.

---

## API Documentation

The following documentation uses the live backend URL. All endpoints (except for login/register) are protected and require a `Bearer` token in the `Authorization` header.

**Base URL**: `https://purple-merit-assessment.onrender.com/api`

### Authentication (`/api/auth`)

| Method | Endpoint    | Description                   | Body                                                 |
| :----- | :---------- | :---------------------------- | :--------------------------------------------------- |
| `POST` | `/register` | Registers a new manager.      | `{ "username": "manager1", "password": "password123" }` |
| `POST` | `/login`    | Logs in a manager, returns JWT. | `{ "username": "manager1", "password": "password123" }` |

### Drivers (`/api/drivers`)

| Method   | Endpoint | Description          |
| :------- | :------- | :------------------- |
| `GET`    | `/`      | Get all drivers.     |
| `POST`   | `/`      | Create a new driver. |
| `GET`    | `/:id`   | Get a single driver. |
| `PUT`    | `/:id`   | Update a driver.     |
| `DELETE` | `/:id`   | Delete a driver.     |

### Routes (`/api/routes`)

| Method   | Endpoint | Description        |
| :------- | :------- | :----------------- |
| `GET`    | `/`      | Get all routes.    |
| `POST`   | `/`      | Create a new route.|
| `GET`    | `/:id`   | Get a single route.|
| `PUT`    | `/:id`   | Update a route.    |
| `DELETE` | `/:id`   | Delete a route.    |

### Orders (`/api/orders`)

| Method   | Endpoint | Description        |
| :------- | :------- | :----------------- |
| `GET`    | `/`      | Get all orders.    |
| `POST`   | `/`      | Create a new order.|
| `GET`    | `/:id`   | Get a single order.|
| `PUT`    | `/:id`   | Update an order.   |
| `DELETE` | `/:id`   | Delete an order.   |

### Simulation (`/api/simulation`)

| Method | Endpoint   | Description                                  | Body                                                                     |
| :----- | :--------- | :------------------------------------------- | :----------------------------------------------------------------------- |
| `POST` | `/run`     | Runs the simulation and returns KPI results. | `{ "numberOfDrivers": 8, "routeStartTime": "09:00", "maxHoursPerDriver": 10 }` |
| `GET`  | `/history` | Gets a list of all past simulation results.  | (None)                                                                   |
