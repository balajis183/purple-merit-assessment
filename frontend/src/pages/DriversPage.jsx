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
  const [formData, setFormData] = useState({ name: '', currentShiftHours: 0 });
  const [pastHoursInputString, setPastHoursInputString] = useState('');

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
      });
      setPastHoursInputString(driver.past7DayWorkHours.join(', '));
    } else {
      setCurrentDriver(null);
      setFormData({ name: '', currentShiftHours: 0 });
      setPastHoursInputString('');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDriver(null);
    setFormData({ name: '', currentShiftHours: 0 });
    setPastHoursInputString('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pastHoursInputString') {
      setPastHoursInputString(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const pastHoursArray = pastHoursInputString
      .split(',')
      .filter(item => item.trim() !== '')
      .map(Number);

    if (pastHoursArray.length !== 7) {
      setError('Past 7 Day Work Hours must contain exactly 7 values.');
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem('authToken');
    const method = currentDriver ? 'PUT' : 'POST';
    const url = currentDriver ? `${BASE_URL}/${currentDriver._id}` : BASE_URL;

    try {
      const payload = {
        ...formData,
        past7DayWorkHours: pastHoursArray
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Action failed.');
      }

      fetchDrivers();
      closeModal();
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
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
      } catch (err) {
        setError(err.message || 'An error occurred.');
      } finally {
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
        <h2>Driver Management ✇</h2>
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
                <label htmlFor="pastHoursInputString">Past 7 Day Work Hours (comma separated, exactly 7 values)</label>
                <input
                  type="text"
                  id="pastHoursInputString"
                  name="pastHoursInputString"
                  value={pastHoursInputString}
                  onChange={handleFormChange}
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

export default DriversPage;