import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/admin";

function FinancialLedger() {
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLedger = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/financial-ledger`
      );

      const data = await response.json();

      console.log("FINANCIAL LEDGER:", data);

      if (response.ok && data.success) {
        setLedger(data);
      } else {
        alert(
          data.message || "Financial ledger load nahi hua!"
        );
      }
    } catch (error) {
      console.error("Financial Ledger Error:", error);
      alert("Backend se connection nahi ho raha!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Financial Ledger</h1>
          <p>RidePartner financial overview</p>
        </div>

        <div className="admin-profile">
          👤 Admin
        </div>
      </header>

      <section className="stats-grid">

        <div className="stat-card">
          <span>💰</span>
          <div>
            <p>Platform Revenue</p>
            <h2>
              ₹{ledger?.platformRevenue || 0}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <span>💸</span>
          <div>
            <p>Driver Earnings</p>
            <h2>
              ₹{ledger?.driverEarnings || 0}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <span>⚠️</span>
          <div>
            <p>Penalties</p>
            <h2>
              ₹{ledger?.penalties || 0}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <span>⚖️</span>
          <div>
            <p>Disputes</p>
            <h2>
              ₹{ledger?.disputes || 0}
            </h2>
          </div>
        </div>

      </section>

      <section className="dashboard-card">

        <div className="card-header">
          <h2>Financial Summary</h2>

          <button onClick={fetchLedger}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <h3>Loading financial data...</h3>
          </div>
        ) : !ledger ? (
          <div className="empty-state">
            <div>📒</div>
            <h3>No financial data</h3>
          </div>
        ) : (
          <div style={{ padding: "20px" }}>
            <p>
              <strong>Platform Revenue:</strong>{" "}
              ₹{ledger.platformRevenue || 0}
            </p>

            <p>
              <strong>Driver Earnings:</strong>{" "}
              ₹{ledger.driverEarnings || 0}
            </p>

            <p>
              <strong>Penalties:</strong>{" "}
              ₹{ledger.penalties || 0}
            </p>

            <p>
              <strong>Disputes:</strong>{" "}
              ₹{ledger.disputes || 0}
            </p>
          </div>
        )}

      </section>
    </>
  );
}

export default FinancialLedger;