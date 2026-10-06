import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/admin";

function WhatsApp() {
  const [reports, setReports] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [target, setTarget] = useState("all");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [whatsappStats, setWhatsappStats] = useState({
    totalSent: 0,
    totalFailed: 0,
  });

  // ==============================
  // FETCH WHATSAPP REPORTS
  // ==============================
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/whatsapp-reports`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch WhatsApp reports"
        );
      }

      setReports(data.logs || []);

      setWhatsappStats({
        totalSent: data.stats?.totalSent || 0,
        totalFailed: data.stats?.totalFailed || 0,
      });
    } catch (error) {
      console.error("WhatsApp Report Error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // FETCH APPROVED DRIVERS
  // ==============================
  const fetchDrivers = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/drivers`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const approvedDrivers = (data.drivers || []).filter(
          (driver) => driver.isVerified === "approved"
        );

        setDrivers(approvedDrivers);
      }
    } catch (error) {
      console.error("Driver Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchDrivers();
  }, []);

  // ==============================
  // SEND WHATSAPP
  // ==============================
  const handleSendWhatsApp = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    if (
      target === "specific" &&
      !selectedDriver
    ) {
      setError("Please select a driver.");
      return;
    }

    try {
      setSending(true);

      const body = {
        target,
        message: message.trim(),
      };

      if (target === "specific") {
        body.driverIds = [selectedDriver];
      }

      const response = await fetch(
        `${API_BASE_URL}/send-whatsapp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to send WhatsApp message"
        );
      }

      setSuccess(
        data.message || "WhatsApp notification sent successfully!"
      );

      setMessage("");
      setSelectedDriver("");

      // Reports ko dobara load karo
      await fetchReports();
    } catch (error) {
      console.error("Send WhatsApp Error:", error);

      setError(
        error.message || "Failed to send WhatsApp message"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* ==============================
          TOP BAR
      ============================== */}
      <header className="topbar">
        <div>
          <h1>WhatsApp</h1>
          <p>
            Admin WhatsApp notifications and reports
          </p>
        </div>

        <div className="admin-profile">
          👤 Admin
        </div>
      </header>

      {/* ==============================
          STATS
      ============================== */}
      <section className="stats-grid">

        <div className="stat-card">
          <span>📱</span>

          <div>
            <p>Total Messages</p>
            <h2>{reports.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>📊</span>

          <div>
            <p>Total Reports</p>
            <h2>{reports.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>✅</span>

          <div>
            <p>Sent</p>
            <h2>{whatsappStats.totalSent}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>❌</span>

          <div>
            <p>Failed</p>
            <h2>{whatsappStats.totalFailed}</h2>
          </div>
        </div>

      </section>

      {/* ==============================
          SEND WHATSAPP
      ============================== */}
      <section className="dashboard-card">

        <div className="card-header">
          <div>
            <h2>Send WhatsApp Notification</h2>
            <p>
              Send a notification to approved drivers
            </p>
          </div>
        </div>

        <form onSubmit={handleSendWhatsApp}>

          {/* TARGET */}
          <div style={formGroup}>
            <label style={label}>
              Send To
            </label>

            <select
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                setSelectedDriver("");
              }}
              style={input}
            >
              <option value="all">
                All Approved Drivers
              </option>

              <option value="specific">
                Specific Driver
              </option>
            </select>
          </div>

          {/* SPECIFIC DRIVER */}
          {target === "specific" && (
            <div style={formGroup}>
              <label style={label}>
                Select Driver
              </label>

              <select
                value={selectedDriver}
                onChange={(e) =>
                  setSelectedDriver(e.target.value)
                }
                style={input}
              >
                <option value="">
                  Select a driver
                </option>

                {drivers.map((driver) => (
                  <option
                    key={driver._id}
                    value={driver._id}
                  >
                    {driver.name} - {driver.phone}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* MESSAGE */}
          <div style={formGroup}>
            <label style={label}>
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Write your WhatsApp message..."
              rows="5"
              style={textarea}
            />
          </div>

          {/* SUCCESS */}
          {success && (
            <div style={successBox}>
              ✅ {success}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div style={errorBox}>
              ❌ {error}
            </div>
          )}

          {/* SEND BUTTON */}
          <button
            type="submit"
            disabled={sending}
            style={{
              ...sendButton,
              opacity: sending ? 0.6 : 1,
              cursor: sending
                ? "not-allowed"
                : "pointer",
            }}
          >
            {sending
              ? "⏳ Sending..."
              : "📱 Send WhatsApp"}
          </button>

        </form>

      </section>

      {/* ==============================
          REPORTS
      ============================== */}
      <section className="dashboard-card">

        <div className="card-header">
          <div>
            <h2>WhatsApp Reports</h2>
            <p>
              WhatsApp notification activity
            </p>
          </div>

          <button onClick={fetchReports}>
            🔄 Refresh
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="empty-state">
            <div>⏳</div>
            <h3>Loading WhatsApp reports...</h3>
            <p>Please wait.</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && reports.length === 0 && (
          <div className="empty-state">
            <div>⚠️</div>
            <h3>Unable to load reports</h3>
            <p>{error}</p>

            <button onClick={fetchReports}>
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          reports.length === 0 && (
            <div className="empty-state">
              <div>📱</div>

              <h3>No WhatsApp reports</h3>

              <p>
                WhatsApp activity will appear here
                when notifications are sent.
              </p>
            </div>
          )}

        {/* TABLE */}
        {!loading &&
          reports.length > 0 && (
            <div style={{ overflowX: "auto" }}>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >

                <thead>
                  <tr>
                    <th style={tableHead}>
                      Date
                    </th>

                    <th style={tableHead}>
                      Driver
                    </th>

                    <th style={tableHead}>
                      Phone
                    </th>

                    <th style={tableHead}>
                      Status
                    </th>

                    <th style={tableHead}>
                      Message
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {reports.map(
                    (report, index) => (
                      <tr
                        key={
                          report._id ||
                          index
                        }
                      >

                        {/* DATE */}
                        <td style={tableCell}>
                          {report.createdAt
                            ? new Date(
                                report.createdAt
                              ).toLocaleString(
                                "en-IN"
                              )
                            : "N/A"}
                        </td>

                        {/* DRIVER */}
                        <td style={tableCell}>
                          {report.driver?.name ||
                            "N/A"}
                        </td>

                        {/* PHONE */}
                        <td style={tableCell}>
                          {report.phone ||
                            report.driver?.phone ||
                            "N/A"}
                        </td>

                        {/* STATUS */}
                        <td style={tableCell}>

                          <span
                            style={{
                              padding:
                                "5px 10px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "12px",
                              fontWeight:
                                "600",

                              background:
                                report.status ===
                                "sent"
                                  ? "#e8f7ee"
                                  : report.status ===
                                    "failed"
                                  ? "#fdecec"
                                  : "#fff4e5",

                              color:
                                report.status ===
                                "sent"
                                  ? "#16834b"
                                  : report.status ===
                                    "failed"
                                  ? "#d93025"
                                  : "#d97706",
                            }}
                          >
                            {report.status ||
                              "N/A"}
                          </span>

                        </td>

                        {/* MESSAGE */}
                        <td style={tableCell}>
                          {report.message ||
                            "N/A"}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

      </section>
    </>
  );
}

/* ==============================
   STYLES
============================== */

const formGroup = {
  marginBottom: "20px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
};

const input = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const textarea = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
  resize: "vertical",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const sendButton = {
  background: "#ff7a00",
  color: "#fff",
  border: "none",
  padding: "12px 22px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
};

const successBox = {
  background: "#e8f7ee",
  color: "#16834b",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "15px",
};

const errorBox = {
  background: "#fdecec",
  color: "#d93025",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "15px",
};

const tableHead = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "2px solid #eee",
};

const tableCell = {
  padding: "14px",
  borderBottom: "1px solid #eee",
};

export default WhatsApp;