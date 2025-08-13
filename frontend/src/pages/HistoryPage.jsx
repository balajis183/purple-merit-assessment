import React, { useState, useEffect } from 'react';
import '../styles/HistoryPage.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const HISTORY_URL = 'https://purple-merit-assessment.onrender.com/api/simulation/history';

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to view the simulation history.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(HISTORY_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch simulation history.');
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (isoString) => {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading-container"><h2>Loading History...</h2></div>;
  }

  if (error) {
    return <div className="error-container"><h2>{error}</h2></div>;
  }

  return (
    <div className="history-page-container">
      <header className="history-header">
        <h1>Simulation History</h1>
        <p>A log of all past simulation runs and their results.</p>
      </header>

      {history.length === 0 ? (
        <p className="no-history-message">No simulation history found. Run a new simulation to see results here.</p>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Drivers Used</th>
                <th>Max Hours</th>
                <th>Total Profit</th>
                <th>Efficiency Score</th>
              </tr>
            </thead>
            <tbody>
              {history.map((run) => (
                <tr key={run._id}>
                  <td>{formatDate(run.timestamp)}</td>
                  <td>{run.simulationInputs.numberOfDrivers}</td>
                  <td>{run.simulationInputs.maxHoursPerDriver}</td>
                  <td>₹ {run.totalProfit.toLocaleString()}</td>
                  <td>{run.efficiencyScore.toFixed(2)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
