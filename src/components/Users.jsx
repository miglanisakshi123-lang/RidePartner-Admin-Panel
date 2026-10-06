import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/admin";

function Users() {
  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Users fetch nahi hue");
      }

      setUsers(data.users || []);

      setStats({
        totalUsers: data.stats?.totalUsers || 0,
        activeUsers: data.stats?.activeUsers || 0,
        blockedUsers: data.stats?.blockedUsers || 0,
      });
    } catch (error) {
      console.error("Fetch Users Error:", error);
      setError(
        error.message || "Server se users load nahi ho rahe hain."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Users</h1>
          <p>Manage RidePartner passengers</p>
        </div>

        <div className="admin-profile">👤 Admin</div>
      </header>

      {/* ================= STATS ================= */}

      <section className="stats-grid">
        <div className="stat-card">
          <span>👥</span>

          <div>
            <p>Total Users</p>
            <h2>{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>🟢</span>

          <div>
            <p>Active Users</p>
            <h2>{stats.activeUsers}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>🚫</span>

          <div>
            <p>Blocked Users</p>
            <h2>{stats.blockedUsers}</h2>
          </div>
        </div>
      </section>

      {/* ================= ALL USERS ================= */}

      <section className="dashboard-card">
        <div className="card-header">
          <div>
            <h2>All Users</h2>

            <p style={{ marginTop: "5px", color: "#777" }}>
              {users.length} user(s) found
            </p>
          </div>

          <button onClick={fetchUsers}>🔄 Refresh</button>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="empty-state">
            <div>⏳</div>
            <h3>Loading users...</h3>
            <p>Please wait.</p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="empty-state">
            <div>⚠️</div>

            <h3>Unable to load users</h3>

            <p>{error}</p>

            <button onClick={fetchUsers} style={retryButton}>
              Try Again
            </button>
          </div>
        )}

        {/* NO USERS */}

        {!loading && !error && users.length === 0 && (
          <div className="empty-state">
            <div>👥</div>

            <h3>No users found</h3>

            <p>There are currently no passenger records.</p>
          </div>
        )}

        {/* USERS TABLE */}

        {!loading && !error && users.length > 0 && (
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
                  <th style={tableHead}>Name</th>
                  <th style={tableHead}>Phone</th>
                  <th style={tableHead}>Email</th>
                  <th style={tableHead}>Age</th>
                  <th style={tableHead}>Gender</th>
                  <th style={tableHead}>Rating</th>
                  <th style={tableHead}>Joined</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={tableCell}>
                      {user.name || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {user.phone || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {user.email || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {user.age || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {user.gender || "N/A"}
                    </td>

                    <td style={tableCell}>
                      ⭐ {user.rating ?? 0}
                    </td>

                    <td style={tableCell}>
                      {formatDate(user.createdAt)}
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

export default Users;