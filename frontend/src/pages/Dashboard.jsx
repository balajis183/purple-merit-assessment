
import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import '../styles/Dashboard.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const HISTORY_URL = 'https://purple-merit-assessment.onrender.com/api/simulation/history';

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to view the dashboard.');
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

        const history = await response.json();
        if (history.length > 0) {
          // Set the latest result (the first one in the sorted array)
          setLatestResult(history[0]);
        } else {
          setError('No simulation data found. Please run a simulation first.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data configuration
  const deliveryStatusData = {
    labels: ['On-time Deliveries', 'Late Deliveries'],
    datasets: [
      {
        label: 'Delivery Status',
        data: [
          latestResult?.onTimeDeliveries || 0,
          latestResult?.lateDeliveries || 0,
        ],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const fuelCostData = {
    labels: ['Fuel Cost Analysis'],
    datasets: [
        // Note: The backend provides totalFuelCost. For a breakdown, more detailed
        // data would be needed. Here, we're creating a sample breakdown for visualization.
      {
        label: 'Base Fuel Cost',
        data: [(latestResult?.totalFuelCost || 0) * 0.8], // Assuming 80% is base cost
        backgroundColor: '#3498db',
      },
      {
        label: 'High-Traffic Surcharge',
        data: [(latestResult?.totalFuelCost || 0) * 0.2], // Assuming 20% is surcharge
        backgroundColor: '#f1c40f',
      },
    ],
  };

  if (loading) {
    return <div className="loading-container"><h2>Loading Dashboard...</h2></div>;
  }

  if (error) {
    return <div className="error-container"><h2>{error}</h2></div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Key Performance Indicators from the last simulation.</p>
      </header>
      
      <div className="kpi-grid">
        <div className="kpi-card profit">
          <span className="kpi-icon">💰</span>
          <div className="kpi-info">
            <p>Total Profit</p>
            <h2>₹ {latestResult?.totalProfit?.toLocaleString() || 'N/A'}</h2>
          </div>
        </div>
        <div className="kpi-card efficiency">
          <span className="kpi-icon">📈</span>
          <div className="kpi-info">
            <p>Efficiency Score</p>
            <h2>{latestResult?.efficiencyScore?.toFixed(2) || 'N/A'} %</h2>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Delivery Status</h3>
          <Doughnut data={deliveryStatusData} />
        </div>
        <div className="chart-card">
          <h3>Fuel Cost Breakdown (Sample)</h3>
          <Bar data={fuelCostData} options={{ indexAxis: 'y', responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
