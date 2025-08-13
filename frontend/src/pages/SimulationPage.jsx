import React, { useState, useEffect } from 'react';
import '../styles/SimulationPage.css';

const SimulationPage = () => {
  const [formData, setFormData] = useState({
    numberOfDrivers: 0,
    routeStartTime: '09:00',
    maxHoursPerDriver: 7,
  });
  const [maxAvailableDrivers, setMaxAvailableDrivers] = useState(0);
  const [simulationResults, setSimulationResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const SIMULATION_URL = 'https://purple-merit-assessment.onrender.com/api/simulation/run';
  const DRIVERS_URL = 'https://purple-merit-assessment.onrender.com/api/drivers';

  useEffect(() => {
    const fetchMaxDrivers = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to fetch driver data.');
        return;
      }

      try {
        const response = await fetch(DRIVERS_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch available drivers.');
        }
        const drivers = await response.json();
        setMaxAvailableDrivers(drivers.length);
        // setFormData(prev => ({ ...prev, numberOfDrivers: drivers.length }));  //max drivers
      } catch (err) {
        setError(err.message || 'An error occurred while fetching drivers.');
      }
    };
    fetchMaxDrivers();
  }, []);

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
    setSimulationResults(null);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to run a simulation.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(SIMULATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Simulation failed.');
      }
      
      setSimulationResults(data.results);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulation-page-container">
      <header className="page-header">
        <h2>Run Simulation 🏎️</h2>
      </header>

      <div className="simulation-card">
        <form onSubmit={handleSubmit} className="simulation-form">
          <div className="form-group">
            <label htmlFor="numberOfDrivers">Number of Drivers (max: {maxAvailableDrivers})</label>
            <input
              type="number"
              id="numberOfDrivers"
              name="numberOfDrivers"
              value={formData.numberOfDrivers}
              onChange={handleFormChange}
              max={maxAvailableDrivers}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="routeStartTime">Route Start Time (HH:MM)</label>
            <input
              type="text"
              id="routeStartTime"
              name="routeStartTime"
              value={formData.routeStartTime}
              onChange={handleFormChange}
              placeholder="e.g., 09:00"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="maxHoursPerDriver">Max Hours per Driver</label>
            <input
              type="number"
              id="maxHoursPerDriver"
              name="maxHoursPerDriver"
              value={formData.maxHoursPerDriver}
              onChange={handleFormChange}
              required
            />
          </div>
          
          {/* --- WRAP THE BUTTON IN A DIV --- */}
          <div className="form-full-width">
            <button type="submit" className="run-simulation-button" disabled={loading || maxAvailableDrivers === 0}>
              {loading ? 'Running...' : 'Run Simulation'}
            </button>
          </div>
          {/* -------------------------------- */}

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      {simulationResults && (
        <div className="simulation-results-card">
          <h3 className="results-title">Simulation Results</h3>
          <div className="results-grid">
            <div className="result-item">
              <h4>Total Profit</h4>
              <p>₹ {simulationResults.totalProfit}</p>
            </div>
            <div className="result-item">
              <h4>Efficiency Score</h4>
              <p>{simulationResults.efficiencyScore} %</p>
            </div>
            <div className="result-item">
              <h4>On-time Deliveries</h4>
              <p>{simulationResults.onTimeDeliveries}</p>
            </div>
            <div className="result-item">
              <h4>Late Deliveries</h4>
              <p>{simulationResults.lateDeliveries}</p>
            </div>
            <div className="result-item">
              <h4>Total Fuel Cost</h4>
              <p>₹ {simulationResults.totalFuelCost}</p>
            </div>
            <div className="result-item">
              <h4>Unassigned Orders</h4>
              <p>{simulationResults.unassignedOrders}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationPage;
