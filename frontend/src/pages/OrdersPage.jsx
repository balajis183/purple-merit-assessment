import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import Table from '../components/Table';
import '../styles/OrdersPage.css';
import '../styles/Table.css';
import '../styles/Modal.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]); // To populate the dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [formData, setFormData] = useState({ orderID: '', valueInRs: 0, assignedRoute: '' });

  const ORDERS_BASE_URL = 'https://purple-merit-assessment.onrender.com/api/orders';
  const ROUTES_BASE_URL = 'https://purple-merit-assessment.onrender.com/api/routes';

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to view orders.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(ORDERS_BASE_URL, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRoutes = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to fetch routes.');
      return;
    }
    try {
      const response = await fetch(ROUTES_BASE_URL, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch available routes.');
      }
      const data = await response.json();
      setAvailableRoutes(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching available routes.');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAvailableRoutes(); // Fetch routes when page loads
  }, []);

  const openModal = (order = null) => {
    setIsModalOpen(true);
    if (order) {
      setCurrentOrder(order);
      setFormData({
        orderID: order.orderID,
        valueInRs: order.valueInRs,
        assignedRoute: order.assignedRoute ? order.assignedRoute._id : '', // Use _id for dropdown
      });
    } else {
      setCurrentOrder(null);
      setFormData({ orderID: '', valueInRs: 0, assignedRoute: '' });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentOrder(null);
    setFormData({ orderID: '', valueInRs: 0, assignedRoute: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const token = localStorage.getItem('authToken');
    const method = currentOrder ? 'PUT' : 'POST';
    const url = currentOrder ? `${ORDERS_BASE_URL}/${currentOrder._id}` : ORDERS_BASE_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Action failed.');
      }

      fetchOrders();
      closeModal();
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    const token = localStorage.getItem('authToken');
    if (window.confirm('Are you sure you want to delete this order?')) {
      setLoading(true);
      try {
        const response = await fetch(`${ORDERS_BASE_URL}/${orderId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to delete order.');
        }

        setOrders(orders.filter(o => o._id !== orderId));
      } catch (err) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { header: 'Order ID', key: 'orderID' },
    { header: 'Value (Rs)', key: 'valueInRs' },
    {
      header: 'Assigned Route',
      key: 'assignedRoute',
      render: (row) => row.assignedRoute ? `${row.assignedRoute.routeID} (${row.assignedRoute.distanceInKm}km, ${row.assignedRoute.trafficLevel})` : 'N/A',
    },
    { header: 'Delivery Timestamp', key: 'deliveryTimestamp', render: (row) => row.deliveryTimestamp ? new Date(row.deliveryTimestamp).toLocaleString() : 'Not Delivered' },
  ];

  const actions = (row) => (
    <>
      <button onClick={() => openModal(row)}><FaEdit size={20} /></button>
      <button onClick={() => handleDelete(row._id)}><FaTrashAlt size={20} /></button>
    </>
  );

  return (
    <div className="orders-page-container">
      <header className="page-header">
        <h2>Order Management 📦</h2>
        <button className="add-button" onClick={() => openModal()}>
          <FaPlus size={20} /> Add Order
        </button>
      </header>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : (
        <Table columns={columns} data={orders} actions={actions} />
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeModal}>&times;</button>
            <h3>{currentOrder ? 'Edit Order' : 'Add New Order'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="orderID">Order ID</label>
                <input
                  type="text"
                  id="orderID"
                  name="orderID"
                  value={formData.orderID}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="valueInRs">Value (Rs)</label>
                <input
                  type="number"
                  id="valueInRs"
                  name="valueInRs"
                  value={formData.valueInRs}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="assignedRoute">Assigned Route</label>
                <select
                  id="assignedRoute"
                  name="assignedRoute"
                  value={formData.assignedRoute}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a Route</option>
                  {availableRoutes.map(route => (
                    <option key={route._id} value={route._id}>
                      {route.routeID} ({route.distanceInKm}km, {route.trafficLevel})
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;