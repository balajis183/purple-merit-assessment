# GreenCart Logistics API Documentation

This document provides details on the API endpoints for managing resources within the GreenCart Logistics system.

**Base URL**: `http://localhost:5000/api`

---

## Order Management

Endpoints for creating, reading, updating, and deleting customer orders. A key feature of these endpoints is that they automatically populate the `assignedRoute` field with the full details of the route.

### 1. Get All Orders

Retrieves a list of all orders in the system.

-   **Endpoint**: `/orders`
-   **Method**: `GET`
-   **Body**: None
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: An array of order objects. Note how `assignedRoute` contains the full route document.
    ```json
    [
        {
            "_id": "689b5e0f49694ac551274c5b",
            "orderID": "1",
            "valueInRs": 2594,
            "assignedRoute": {
                "_id": "689b5e0f49694ac551274c4d",
                "routeID": "7",
                "distanceInKm": 20,
                "trafficLevel": "Medium",
                "baseTimeInMinutes": 100,
                "__v": 0
            },
            "deliveryTimestamp": null,
            "__v": 0
        },
        {
            "_id": "689b5e0f49694ac551274c5c",
            "orderID": "2",
            "valueInRs": 1835,
            "assignedRoute": {
                "_id": "689b5e0f49694ac551274c4c",
                "routeID": "6",
                "distanceInKm": 15,
                "trafficLevel": "Low",
                "baseTimeInMinutes": 75,
                "__v": 0
            },
            "deliveryTimestamp": null,
            "__v": 0
        }
    ]
    ```

---

### 2. Get Single Order by ID

Retrieves a specific order by its unique MongoDB `_id`.

-   **Endpoint**: `/orders/:id`
-   **Method**: `GET`
-   **URL Params**:
    -   `id`=[string] **Required**. The ID of the order to retrieve.
-   **Body**: None
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: The requested order object, with the `assignedRoute` populated.
    ```json
    {
        "_id": "689b8124d050d9c0486283b1",
        "orderID": "51",
        "valueInRs": 1850,
        "assignedRoute": {
            "_id": "689b5e0f49694ac551274c4b",
            "routeID": "9",
            "distanceInKm": 9,
            "trafficLevel": "Low",
            "baseTimeInMinutes": 45,
            "__v": 0
        },
        "deliveryTimestamp": null,
        "__v": 0
    }
    ```

---

### 3. Create a New Order

Adds a new order to the system. You must provide the `_id` of an existing route for the `assignedRoute` field.

-   **Endpoint**: `/orders`
-   **Method**: `POST`
-   **Headers**:
    -   `Content-Type: application/json`
-   **Body**:
    ```json
    {
        "orderID": "51",
        "valueInRs": 1850,
        "assignedRoute": "689b5e0f49694ac551274c4b"
    }
    ```
-   **Success Response**:
    -   **Code**: `201 Created`
    -   **Content**: The newly created order object.
    ```json
    {
        "orderID": "51",
        "valueInRs": 1850,
        "assignedRoute": "689b5e0f49694ac551274c4b",
        "deliveryTimestamp": null,
        "_id": "689b8124d050d9c0486283b1",
        "__v": 0
    }
    ```

---

### 4. Update an Existing Order

Updates the information for a specific order.

-   **Endpoint**: `/orders/:id`
-   **Method**: `PUT`
-   **Headers**:
    -   `Content-Type: application/json`
-   **URL Params**:
    -   `id`=[string] **Required**. The ID of the order to update.
-   **Body**:
    ```json
    {
        "valueInRs": 2000
    }
    ```
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: The complete, updated order object.
    ```json
    {
        "_id": "689b8124d050d9c0486283b1",
        "orderID": "51",
        "valueInRs": 2000,
        "assignedRoute": "689b5e0f49694ac551274c4b",
        "deliveryTimestamp": null,
        "__v": 0
    }
    ```

---

### 5. Delete an Order

Removes an order from the system permanently.

-   **Endpoint**: `/orders/:id`
-   **Method**: `DELETE`
-   **URL Params**:
    -   `id`=[string] **Required**. The ID of the order to delete.
-   **Body**: None
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: A success message.
    ```json
    {
        "message": "Order removed successfully"
    }
    ```
