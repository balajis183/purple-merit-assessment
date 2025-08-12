# GreenCart Logistics API Documentation

This document provides details on the API endpoints for managing resources within the GreenCart Logistics system.

**Base URL**: `http://localhost:5000/api`

---

## Driver Management

Endpoints for creating, reading, updating, and deleting drivers.

### 1. Get All Drivers

Retrieves a list of all drivers in the system.

-   **Endpoint**: `/drivers`
-   **Method**: `GET`
-   **Body**: None
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: An array of driver objects.
    ```json
    [
        {
            "_id": "689b656e0d92abcde0f1f725",
            "name": "Virat Kohli",
            "currentShiftHours": 7,
            "past7DayWorkHours": [8, 8, 8, 7, 8, 0, 0],
            "__v": 0
        },
        {
            "_id": "689b656e0d92abcde0f1f726",
            "name": "Priya Sharma",
            "currentShiftHours": 6,
            "past7DayWorkHours": [10, 9, 6, 6, 6, 7, 7],
            "__v": 0
        }
    ]
    ```

---

### 2. Get Single Driver by ID

Retrieves a specific driver by their unique MongoDB `_id`.

-   **Endpoint**: `/drivers/:id`
-   **Method**: `GET`
-   **URL Params**:
    -   `id`=[string] **Required**. The ID of the driver to retrieve.
-   **Body**: None
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: The requested driver object.
    ```json
    {
        "_id": "689b656e0d92abcde0f1f725",
        "name": "Virat Kohli",
        "currentShiftHours": 7,
        "past7DayWorkHours": [8, 8, 8, 7, 8, 0, 0],
        "__v": 0
    }
    ```
-   **Error Response**:
    -   **Code**: `404 Not Found` (If driver with that ID doesn't exist)
    -   **Code**: `400 Bad Request` (If the provided ID is not a valid ObjectId format)

---

### 3. Create a New Driver

Adds a new driver to the system.

-   **Endpoint**: `/drivers`
-   **Method**: `POST`
-   **Headers**:
    -   `Content-Type: application/json`
-   **Body**:
    ```json
    {
        "name": "Ravi Kumar",
        "currentShiftHours": 0,
        "past7DayWorkHours": [8, 8, 8, 8, 8, 0, 0]
    }
    ```
-   **Success Response**:
    -   **Code**: `201 Created`
    -   **Content**: The newly created driver object, including its database `_id`.
    ```json
    {
        "_id": "689b657e0d92abcde0f1f73a",
        "name": "Ravi Kumar",
        "currentShiftHours": 0,
        "past7DayWorkHours": [8, 8, 8, 8, 8, 0, 0],
        "__v": 0
    }
    ```

---

### 4. Update an Existing Driver

Updates the information for a specific driver. You can send any combination of fields to update.

-   **Endpoint**: `/drivers/:id`
-   **Method**: `PUT`
-   **Headers**:
    -   `Content-Type: application/json`
-   **URL Params**:
    -   `id`=[string] **Required**. The ID of the driver to update.
-   **Body**:
    ```json
    {
        "name": "Virat Kohli Sharma",
        "currentShiftHours": 2
    }
    ```
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: The complete, updated driver object.
    ```json
    {
        "_id": "689b656e0d92abcde0f1f725",
        "name": "Virat Kohli Sharma",
        "currentShiftHours": 2,
        "past7DayWorkHours": [8, 8, 8, 7, 8, 0, 0],
        "__v": 0
    }
    ```

---

### 5. Delete a Driver

Removes a driver from the system permanently.

-   **Endpoint**: `/drivers/:id`
-   **Method**: `DELETE`
-   **URL Params**:
    -   `id`=[string] **Required**. The ID of the driver to delete.
-   **Body**: None
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: A success message.
    ```json
    {
        "message": "Driver removed successfully"
    }
    ```
