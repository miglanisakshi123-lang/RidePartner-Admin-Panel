function Dashboard({ drivers }) {
  return (
    <>
      <header className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to RidePartner Admin Panel</p>
        </div>

        <div className="admin-profile">
          👤 Admin
        </div>
      </header>

      <section className="stats-grid">

        <div className="stat-card">
          <span>👨‍✈️</span>
          <div>
            <p>Total Drivers</p>
            <h2>{drivers.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>🚗</span>
          <div>
            <p>Total Rides</p>
            <h2>0</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>💰</span>
          <div>
            <p>Platform Revenue</p>
            <h2>₹0</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>🏦</span>
          <div>
            <p>Pending Withdrawals</p>
            <h2>0</h2>
          </div>
        </div>

      </section>

      <section className="dashboard-card">
        <div className="card-header">
          <h2>Recent Activity</h2>
          <button>View All</button>
        </div>

        <div className="empty-state">
          <div>📋</div>
          <h3>No activity yet</h3>
          <p>Admin activities will appear here.</p>
        </div>
      </section>
    </>
  );
}

export default Dashboard;