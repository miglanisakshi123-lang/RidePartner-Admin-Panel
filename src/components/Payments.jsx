import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/admin";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    refundedPayments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/payments`);

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch payments");
      }

      setPayments(data.payments || []);

      setStats({
        totalPayments: data.stats?.totalPayments || 0,
        successfulPayments: data.stats?.successfulPayments || 0,
        pendingPayments: data.stats?.pendingPayments || 0,
        refundedPayments: data.stats?.refundedPayments || 0,
      });
    } catch (err) {
      console.error("Payment fetch error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "status-badge success";

      case "refunded":
        return "status-badge refunded";

      case "unpaid":
        return "status-badge pending";

      default:
        return "status-badge";
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <header className="topbar">
        <div>
          <h1>Payments</h1>
          <p>Manage RidePartner payment transactions</p>
        </div>

        <div className="admin-profile">
          👤 Admin
        </div>
      </header>

      {/* STATS */}
      <section className="stats-grid">

        <div className="stat-card">
          <span>💳</span>

          <div>
            <p>Total Payments</p>
            <h2>₹{stats.totalPayments.toLocaleString("en-IN")}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>✅</span>

          <div>
            <p>Successful</p>
            <h2>
              ₹{stats.successfulPayments.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <span>⏳</span>

          <div>
            <p>Pending</p>
            <h2>
              ₹{stats.pendingPayments.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <span>↩️</span>

          <div>
            <p>Refunded</p>
            <h2>
              ₹{stats.refundedPayments.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

      </section>

      {/* PAYMENT TABLE */}
      <section className="dashboard-card">

        <div className="card-header">
          <div>
            <h2>Payment Transactions</h2>
            <p>All passenger payment records</p>
          </div>

          <button onClick={fetchPayments}>
            🔄 Refresh
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="empty-state">
            <div>⏳</div>
            <h3>Loading payments...</h3>
            <p>Please wait.</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="empty-state">
            <div>⚠️</div>
            <h3>Unable to load payments</h3>
            <p>{error}</p>

            <button onClick={fetchPayments}>
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && payments.length === 0 && (
          <div className="empty-state">
            <div>💳</div>
            <h3>No payment records</h3>
            <p>Payment transactions will appear here.</p>
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && payments.length > 0 && (
          <div className="table-container">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Passenger</th>
                  <th>Driver</th>
                  <th>Ride ID</th>
                  <th>Amount</th>
                  <th>Commission</th>
                  <th>Driver Earning</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {payments.map((payment, index) => (
                  <tr key={payment.paymentId !== "N/A"
                    ? payment.paymentId
                    : `${payment.rideId}-${index}`}>

                    {/* PAYMENT ID */}
                    <td>
                      <strong>
                        {payment.paymentId}
                      </strong>
                    </td>

                    {/* PASSENGER */}
                    <td>
                      {payment.passenger ? (
                        <>
                          <strong>
                            {payment.passenger.name || "N/A"}
                          </strong>

                          <small>
                            {payment.passenger.phone || "N/A"}
                          </small>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    {/* DRIVER */}
                    <td>
                      {payment.driver ? (
                        <>
                          <strong>
                            {payment.driver.name || "N/A"}
                          </strong>

                          <small>
                            {payment.driver.phone || "N/A"}
                          </small>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    {/* RIDE ID */}
                    <td>
                      <span className="ride-id">
                        {payment.rideId
                          ? payment.rideId.toString().slice(-8)
                          : "N/A"}
                      </span>
                    </td>

                    {/* AMOUNT */}
                    <td>
                      <strong>
                        ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    {/* COMMISSION */}
                    <td>
                      ₹
                      {Number(
                        payment.commission || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    {/* DRIVER EARNING */}
                    <td>
                      ₹
                      {Number(
                        payment.driverEarning || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className={getStatusClass(payment.paymentStatus)}>
                        {payment.paymentStatus}
                      </span>
                    </td>

                    {/* DATE */}
                    <td>
                      {formatDate(payment.paymentDate)}
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

export default Payments;