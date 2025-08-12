# GreenCart Logistics API Documentation for Routes

This document provides details on the API endpoints for managing resources within the GreenCart Logistics system.

**Base URL**: `http://localhost:5000/api`

---

## Route Management

Endpoints for creating, reading, updating, and deleting delivery routes.

### 1. Get All Routes

Retrieves a list of all routes in the system.

-   **Endpoint**: `/routes`
-   **Method**: `GET`
-   **Body**: None
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: An array of route objects.
    ```json
    [
        {
            "_id": "689b5e0f49694ac551274c49",
            "routeID": "1",
            "distanceInKm": 25,
            "trafficLevel": "High",
            "baseTimeInMinutes": 125,
            "__v": 0
        },
        {
            "_id": "689b5e0f49694ac551274c4a",
            "routeID": "2",
            "distanceInKm": 12,
            "trafficLevel": "High",
            "baseTimeInMinutes": 48,
            "__v": 0
        }
    ]
    ```

---

### 2. Get Single Route by ID

Retrieves a specific route by its unique MongoDB `_id`.

-   **Endpoint**: `/routes/:id`
-   **Method**: `GET`
-   **URL Params**:
    -   `id`=[string] **Required**. The ID of the route to retrieve.
-   **Body**: None
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: The requested route object.
    ```json
    {
        "_id": "689b5e0f49694ac551274c49",
        "routeID": "1",
        "distanceInKm": 25,
        "trafficLevel": "High",
        "baseTimeInMinutes": 125,
        "__v": 0
    }
    ```
-   **Error Response**:
    -   **Code**: `404 Not Found` (If route with that ID doesn't exist)
    -   **Code**: `500 Internal Server Error` (If the provided ID is not a valid ObjectId format)

---

### 3. Create a New Route

Adds a new route to the system. The `routeID` must be unique.

-   **Endpoint**: `/routes`
-   **Method**: `POST`
-   **Headers**:
    -   `Content-Type: application/json`
-   **Body**:
    ```json
    {
        "routeID": "11",
        "distanceInKm": 30,
        "trafficLevel": "Medium",
        "baseTimeInMinutes": 90
    }
    ```
-   **Success Response**:
    -   **Code**: `201 Created`
    -   **Content**: The newly created route object, including its database `_id`.
    ```json
    {
        "_id": "689b6a0e0d92abcde0f1f74b",
        "routeID": "11",
        "distanceInKm": 30,
        "trafficLevel": "Medium",
        "baseTimeInMinutes": 90,
        "__v": 0
    }
    ```
-   **Error Response**:
    -   **Code**: `400 Bad Request` (If a route with the same `routeID` already exists)

---

### 4. Update an Existing Route

Updates the information for a specific route.

-   **Endpoint**: `/routes/:id`
-   **Method**: `PUT`
-   **Headers**:
    -   `Content-Type: application/json`
-   **URL Params**:
    -   `id`=[string] **Required**. The ID of the route to update.
-   **Body**:
    ```json
    {
        "trafficLevel": "High",
        "baseTimeInMinutes": 135
    }
    ```
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: The complete, updated route object.
    ```json
    {
        "_id": "689b5e0f49694ac551274c49",
        "routeID": "1",
        "distanceInKm": 25,
        "trafficLevel": "High",
        "baseTimeInMinutes": 135,
        "__v": 0
    }
    ```

---

### 5. Delete a Route

Removes a route from the system permanently.

-   **Endpoint**: `/routes/:id`
-   **Method**: `DELETE`
-   **URL Params**:
    -   `id`=[string] **Required**. The ID of the route to delete.
-   **Body**: None
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: A success message.
    ```json
    {
        "message": "Route removed successfully"
    }
    ```
