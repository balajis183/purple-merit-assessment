import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import Table from '../components/Table';
import '../styles/DriversPage.css';
import '../styles/Table.css';
import '../styles/Modal.css';

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [formData, setFormData] = useState({ name: '', currentShiftHours: 0, past7DayWorkHours: [] });

  const BASE_URL = 'https://purple-merit-assessment.onrender.com/api/drivers';

  const fetchDrivers = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to view drivers.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(BASE_URL, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch drivers.');
      }
      const data = await response.json();
      setDrivers(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching drivers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openModal = (driver = null) => {
    setIsModalOpen(true);
    if (driver) {
      setCurrentDriver(driver);
      setFormData({ 
        name: driver.name,
        currentShiftHours: driver.currentShiftHours,
        past7DayWorkHours: driver.past7DayWorkHours,
      });
    } else {
      setCurrentDriver(null);
      setFormData({ name: '', currentShiftHours: 0, past7DayWorkHours: [] });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDriver(null);
    setFormData({ name: '', currentShiftHours: 0, past7DayWorkHours: [] });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'past7DayWorkHours' ? value.split(',').map(Number) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('authToken');
    const method = currentDriver ? 'PUT' : 'POST';
    const url = currentDriver ? `${BASE_URL}/${currentDriver._id}` : BASE_URL;

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
        throw new Error('Action failed.');
      }

      fetchDrivers();
      closeModal();
    } catch (err) {
      setError(err.message || 'An error occurred.');
      setLoading(false);
    }
  };

  const handleDelete = async (driverId) => {
    const token = localStorage.getItem('authToken');
    if (window.confirm('Are you sure you want to delete this driver?')) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/${driverId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to delete driver.');
        }

        setDrivers(drivers.filter(d => d._id !== driverId));
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred.');
        setLoading(false);
      }
    }
  };

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Current Shift (Hrs)', key: 'currentShiftHours' },
    {
      header: 'Past 7 Day Work (Hrs)',
      key: 'past7DayWorkHours',
      render: (row) => (row.past7DayWorkHours || []).join(', '),
    },
  ];

  const actions = (row) => (
    <>
      <button onClick={() => openModal(row)}><FaEdit size={20} /></button>
      <button onClick={() => handleDelete(row._id)}><FaTrashAlt size={20} /></button>
    </>
  );

  return (
    <div className="drivers-page-container">
      <header className="page-header">
        <h2>Driver Management 🧑‍✈️</h2>
        <button className="add-button" onClick={() => openModal()}>
          <FaPlus size={20} /> Add Driver
        </button>
      </header>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading drivers...</p>
        </div>
      ) : (
        <Table columns={columns} data={drivers} actions={actions} />
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeModal}>&times;</button>
            <h3>{currentDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="currentShiftHours">Current Shift Hours</label>
                <input
                  type="number"
                  id="currentShiftHours"
                  name="currentShiftHours"
                  value={formData.currentShiftHours}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="past7DayWorkHours">Past 7 Day Work Hours (comma separated)</label>
                <input
                  type="text"
                  id="past7DayWorkHours"
                  name="past7DayWorkHours"
                  value={formData.past7DayWorkHours.join(', ')}
                  onChange={handleFormChange}
                />
              </div>
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

export default DriversPage;