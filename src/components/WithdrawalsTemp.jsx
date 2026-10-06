import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/admin";

function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/withdrawals`);
      const data = await response.json();

      if (data.success) {
        setWithdrawals(data.withdrawals || []);
      } else {
        alert(data.message || "Withdrawals load nahi hue!");
      }
    } catch (error) {
      console.error("Withdrawal Error:", error);
      alert("Backend se connection nahi ho raha!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const approveWithdrawal = async (withdrawalId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/withdrawal/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            withdrawalId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Withdrawal approved successfully! ✅");
        fetchWithdrawals();
      } else {
        alert(data.message || "Withdrawal approve nahi hua!");
      }
    } catch (error) {
      console.error(error);
      alert("Server error!");
    }
  };

  const rejectWithdrawal = async (withdrawalId) => {
    const reason = window.prompt(
      "Withdrawal reject karne ka reason:"
    );

    if (!reason) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/withdrawal/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            withdrawalId,
            reason,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Withdrawal rejected ❌");
        fetchWithdrawals();
      } else {
        alert(data.message || "Withdrawal reject nahi hua!");
      }
    } catch (error) {
      console.error(error);
      alert("Server error!");
    }
  };

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Withdrawals</h1>
          <p>Manage driver withdrawal requests</p>
        </div>

        <div className="admin-profile">
          👤 Admin
        </div>
      </header>

      <section className="dashboard-card">

        <div className="card-header">
          <h2>Withdrawal Requests</h2>

          <button onClick={fetchWithdrawals}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <h3>Loading withdrawals...</h3>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="empty-state">
            <div>💰</div>
            <h3>No withdrawal requests</h3>
            <p>New requests will appear here.</p>
          </div>
        ) : (
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
                  <th style={tableHead}>Driver</th>
                  <th style={tableHead}>Amount</th>
                  <th style={tableHead}>Method</th>
                  <th style={tableHead}>Account</th>
                  <th style={tableHead}>Status</th>
                  <th style={tableHead}>Action</th>
                </tr>
              </thead>

              <tbody>
                {withdrawals.map((item) => (
                  <tr key={item._id}>

                    <td style={tableCell}>
                      {item.driverId || "N/A"}
                    </td>

                    <td style={tableCell}>
                      ₹{item.amount || 0}
                    </td>

                    <td style={tableCell}>
                      {item.withdrawalMethod || "bank"}
                    </td>

                    <td style={tableCell}>
                      {item.accountNumber || item.upiId || "N/A"}
                    </td>

                    <td style={tableCell}>
                      <strong>{item.status}</strong>
                    </td>

                    <td style={tableCell}>
                      {item.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              approveWithdrawal(item._id)
                            }
                            style={approveButton}
                          >
                            ✅ Approve
                          </button>

                          <button
                            onClick={() =>
                              rejectWithdrawal(item._id)
                            }
                            style={rejectButton}
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
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

const approveButton = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "6px",
};

const rejectButton = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default Withdrawals;