import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/admin";

function Rides() {
  const [rides, setRides] = useState([]);
  const [stats, setStats] = useState({
    totalRides: 0,
    activeRides: 0,
    completedRides: 0,
    cancelledRides: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRides = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/rides`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Rides fetch nahi hui");
      }

      setRides(data.rides || []);

      setStats({
        totalRides: data.stats?.totalRides || 0,
        activeRides: data.stats?.activeRides || 0,
        completedRides: data.stats?.completedRides || 0,
        cancelledRides: data.stats?.cancelledRides || 0,
      });
    } catch (error) {
      console.error("Fetch Rides Error:", error);
      setError(error.message || "Server se rides load nahi ho rahi hain.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Scheduled";

      case "ongoing":
        return "Ongoing";

      case "completed":
        return "Completed";

      case "cancelled_by_driver":
        return "Cancelled by Driver";

      case "cancelled_by_passenger":
        return "Cancelled by Passenger";

      default:
        return status || "Unknown";
    }
  };

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Rides</h1>
          <p>Manage all RidePartner rides</p>
        </div>

        <div className="admin-profile">👤 Admin</div>
      </header>

      {/* ================= STATS ================= */}

      <section className="stats-grid">
        <div className="stat-card">
          <span>🚗</span>

          <div>
            <p>Total Rides</p>
            <h2>{stats.totalRides}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>🟢</span>

          <div>
            <p>Active Rides</p>
            <h2>{stats.activeRides}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>✅</span>

          <div>
            <p>Completed</p>
            <h2>{stats.completedRides}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>❌</span>

          <div>
            <p>Cancelled</p>
            <h2>{stats.cancelledRides}</h2>
          </div>
        </div>
      </section>

      {/* ================= ALL RIDES ================= */}

      <section className="dashboard-card">
        <div className="card-header">
          <div>
            <h2>All Rides</h2>

            <p style={{ marginTop: "5px", color: "#777" }}>
              {rides.length} ride(s) found
            </p>
          </div>

          <button onClick={fetchRides}>🔄 Refresh</button>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="empty-state">
            <div>⏳</div>
            <h3>Loading rides...</h3>
            <p>Please wait.</p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="empty-state">
            <div>⚠️</div>

            <h3>Unable to load rides</h3>

            <p>{error}</p>

            <button onClick={fetchRides} style={retryButton}>
              Try Again
            </button>
          </div>
        )}

        {/* NO DATA */}

        {!loading && !error && rides.length === 0 && (
          <div className="empty-state">
            <div>🚗</div>

            <h3>No rides found</h3>

            <p>There are currently no ride records in the database.</p>
          </div>
        )}

        {/* RIDES TABLE */}

        {!loading && !error && rides.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr>
                  <th style={tableHead}>Ride ID</th>
                  <th style={tableHead}>Driver</th>
                  <th style={tableHead}>From</th>
                  <th style={tableHead}>To</th>
                  <th style={tableHead}>Date & Time</th>
                  <th style={tableHead}>Fare</th>
                  <th style={tableHead}>Seats</th>
                  <th style={tableHead}>Status</th>
                </tr>
              </thead>

              <tbody>
                {rides.map((ride) => (
                  <tr key={ride._id}>
                    <td style={tableCell}>
                      {ride._id
                        ? String(ride._id).slice(-8)
                        : "N/A"}
                    </td>

                    <td style={tableCell}>
                      {ride.driver?.name || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {ride.fromDistrict || ride.pickupLocation || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {ride.toDistrict || ride.dropLocation || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {formatDate(ride.departureTime)}
                    </td>

                    <td style={tableCell}>
                      ₹{ride.farePerSeat || 0}
                    </td>

                    <td style={tableCell}>
                      {ride.availableSeats ?? 0} /{" "}
                      {ride.totalSeats ?? 0}
                    </td>

                    <td style={tableCell}>
                      <strong>
                        {getStatusText(ride.status)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

const tableHead = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "2px solid #eee",
  whiteSpace: "nowrap",
};

const tableCell = {
  padding: "14px",
  borderBottom: "1px solid #eee",
  whiteSpace: "nowrap",
};

const retryButton = {
  marginTop: "15px",
  background: "#f97316",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "7px",
  cursor: "pointer",
};

export default Rides;