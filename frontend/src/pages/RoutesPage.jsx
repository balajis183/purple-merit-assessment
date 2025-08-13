import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import Table from '../components/Table';
import '../styles/RoutesPage.css';
import '../styles/Table.css';
import '../styles/Modal.css';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [formData, setFormData] = useState({ routeID: '', distanceInKm: 0, trafficLevel: 'Low', baseTimeInMinutes: 0 });

  const BASE_URL = 'https://purple-merit-assessment.onrender.com/api/routes';

  const fetchRoutes = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to view routes.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(BASE_URL, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch routes.');
      }
      const data = await response.json();
      setRoutes(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching routes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const openModal = (route = null) => {
    setIsModalOpen(true);
    if (route) {
      setCurrentRoute(route);
      setFormData({
        routeID: route.routeID,
        distanceInKm: route.distanceInKm,
        trafficLevel: route.trafficLevel,
        baseTimeInMinutes: route.baseTimeInMinutes,
      });
    } else {
      setCurrentRoute(null);
      setFormData({ routeID: '', distanceInKm: 0, trafficLevel: 'Low', baseTimeInMinutes: 0 });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRoute(null);
    setFormData({ routeID: '', distanceInKm: 0, trafficLevel: 'Low', baseTimeInMinutes: 0 });
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
    const method = currentRoute ? 'PUT' : 'POST';
    const url = currentRoute ? `${BASE_URL}/${currentRoute._id}` : BASE_URL;

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

      fetchRoutes();
      closeModal();
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (routeId) => {
    const token = localStorage.getItem('authToken');
    if (window.confirm('Are you sure you want to delete this route?')) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/${routeId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to delete route.');
        }

        setRoutes(routes.filter(r => r._id !== routeId));
      } catch (err) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { header: 'Route ID', key: 'routeID' },
    { header: 'Distance (km)', key: 'distanceInKm' },
    { header: 'Traffic Level', key: 'trafficLevel' },
    { header: 'Base Time (min)', key: 'baseTimeInMinutes' },
  ];

  const actions = (row) => (
    <>
      <button onClick={() => openModal(row)}><FaEdit size={20} /></button>
      <button onClick={() => handleDelete(row._id)}><FaTrashAlt size={20} /></button>
    </>
  );

  return (
    <div className="routes-page-container">
      <header className="page-header">
        <h2>Route Management 🗺️</h2>
        <button className="add-button" onClick={() => openModal()}>
          <FaPlus size={20} /> Add Route
        </button>
      </header>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading routes...</p>
        </div>
      ) : (
        <Table columns={columns} data={routes} actions={actions} />
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeModal}>&times;</button>
            <h3>{currentRoute ? 'Edit Route' : 'Add New Route'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="routeID">Route ID</label>
                <input
                  type="text"
                  id="routeID"
                  name="routeID"
                  value={formData.routeID}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="distanceInKm">Distance (km)</label>
                <input
                  type="number"
                  id="distanceInKm"
                  name="distanceInKm"
                  value={formData.distanceInKm}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="trafficLevel">Traffic Level</label>
                <select
                  id="trafficLevel"
                  name="trafficLevel"
                  value={formData.trafficLevel}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="baseTimeInMinutes">Base Time (min)</label>
                <input
                  type="number"
                  id="baseTimeInMinutes"
                  name="baseTimeInMinutes"
                  value={formData.baseTimeInMinutes}
                  onChange={handleFormChange}
                  required
                />
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

export default RoutesPage;