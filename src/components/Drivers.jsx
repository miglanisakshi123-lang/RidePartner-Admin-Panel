import { useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/admin";

function Drivers({ drivers, loadingDrivers, fetchDrivers }) {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverDetails, setShowDriverDetails] = useState(false);

  // =========================
  // APPROVE DRIVER
  // =========================
  const approveDriver = async (driverId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driverId: driverId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Driver approved successfully! ✅");
        fetchDrivers();
      } else {
        alert(data.message || "Driver approve nahi hua!");
      }
    } catch (error) {
      console.error("Approve Error:", error);
      alert("Server error!");
    }
  };

  // =========================
  // REJECT DRIVER
  // =========================
  const rejectDriver = async (driverId) => {
    const reason = window.prompt(
      "Driver reject karne ka reason enter karo:"
    );

    if (!reason) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driverId: driverId,
          reason: reason,
          rejectedFields: [],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Driver rejected ❌");
        fetchDrivers();
      } else {
        alert(data.message || "Driver reject nahi hua!");
      }
    } catch (error) {
      console.error("Reject Error:", error);
      alert("Server error!");
    }
  };

  // =========================
  // BLOCK DRIVER
  // =========================
  const blockDriver = async (driverId) => {
    const confirmBlock = window.confirm(
      "Kya aap is driver ko block karna chahte hain?"
    );

    if (!confirmBlock) return;

    try {
      const response = await fetch(`${API_BASE_URL}/suspend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driverId: driverId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Driver blocked successfully! 🚫");
        fetchDrivers();
      } else {
        alert(data.message || "Driver block nahi hua!");
      }
    } catch (error) {
      console.error("Block Driver Error:", error);
      alert("Server error!");
    }
  };

  // =========================
  // UNBLOCK DRIVER
  // =========================
  const unblockDriver = async (driverId) => {
    const confirmUnblock = window.confirm(
      "Kya aap is driver ko unblock karna chahte hain?"
    );

    if (!confirmUnblock) return;

    try {
      const response = await fetch(`${API_BASE_URL}/unblock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driverId: driverId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Driver unblocked successfully! ✅");
        fetchDrivers();
      } else {
        alert(data.message || "Driver unblock nahi hua!");
      }
    } catch (error) {
      console.error("Unblock Driver Error:", error);
      alert("Server error!");
    }
  };

  // =========================
  // CLOSE DETAILS
  // =========================
  const closeDriverDetails = () => {
    setShowDriverDetails(false);
    setSelectedDriver(null);
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // =========================
  // MASK ACCOUNT NUMBER
  // =========================
  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "Not provided";

    const value = String(accountNumber);

    if (value.length <= 4) {
      return value;
    }

    return "******" + value.slice(-4);
  };

  return (
    <>
      {/* =========================
          TOP BAR
      ========================= */}
      <header className="topbar">
        <div>
          <h1>Drivers</h1>
          <p>Manage RidePartner drivers</p>
        </div>

        <div className="admin-profile">
          👤 Admin
        </div>
      </header>

      {/* =========================
          DRIVERS TABLE
      ========================= */}
      <section className="dashboard-card">

        <div className="card-header">
          <h2>All Drivers</h2>

          <button onClick={fetchDrivers}>
            🔄 Refresh
          </button>
        </div>

        {loadingDrivers ? (
          <div className="empty-state">
            <h3>Loading drivers...</h3>
          </div>
        ) : drivers.length === 0 ? (
          <div className="empty-state">
            <div>👨‍✈️</div>
            <h3>No drivers found</h3>
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
                  <th style={tableHead}>Name</th>
                  <th style={tableHead}>Phone</th>
                  <th style={tableHead}>Email</th>
                  <th style={tableHead}>Vehicle</th>
                  <th style={tableHead}>Status</th>
                  <th style={tableHead}>Action</th>
                </tr>
              </thead>

              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id}>

                    <td style={tableCell}>
                      {driver.name || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {driver.phone || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {driver.email || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {driver.vehicleType || "N/A"}
                    </td>

                    <td style={tableCell}>
                      <strong>
                        {driver.isVerified || "pending"}
                      </strong>
                    </td>

                    <td style={tableCell}>

                      <button
                        onClick={() => {
                          setSelectedDriver(driver);
                          setShowDriverDetails(true);
                        }}
                        style={viewButton}
                      >
                        👁️ View
                      </button>

                      {driver.isVerified === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              approveDriver(driver._id)
                            }
                            style={approveButton}
                          >
                            ✅ Approve
                          </button>

                          <button
                            onClick={() =>
                              rejectDriver(driver._id)
                            }
                            style={rejectButton}
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}

                      {driver.isVerified === "approved" && (
                        <button
                          onClick={() =>
                            blockDriver(driver._id)
                          }
                          style={blockButton}
                        >
                          🚫 Block
                        </button>
                      )}

                      {driver.isVerified === "rejected" && (
                        <span>❌ Rejected</span>
                      )}

                      {driver.isVerified === "blocked" && (
                        <button
                          onClick={() =>
                            unblockDriver(driver._id)
                          }
                          style={unblockButton}
                        >
                          🔓 Unblock
                        </button>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </section>

      {/* =========================
          DRIVER DETAILS POPUP
      ========================= */}

      {showDriverDetails && selectedDriver && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >

          <div
            style={{
              background: "white",
              width: "100%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "16px",
              padding: "25px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >

            {/* =========================
                HEADER
            ========================= */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >

              <div>
                <h2 style={{ margin: 0 }}>
                  👨‍✈️ Driver Details
                </h2>

                <p
                  style={{
                    marginTop: "5px",
                    color: "#666",
                  }}
                >
                  Complete driver information
                </p>
              </div>

              <button
                onClick={closeDriverDetails}
                style={closeIconButton}
              >
                ✕
              </button>

            </div>

            {/* =========================
                PROFILE PHOTO
            ========================= */}

            <div
              style={{
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              {selectedDriver.avatar ? (
                <img
                  src={selectedDriver.avatar}
                  alt="Driver"
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #f97316",
                  }}
                />
              ) : (
                <div style={avatarPlaceholder}>
                  👤
                </div>
              )}

              <h2
                style={{
                  margin: "10px 0 3px",
                }}
              >
                {selectedDriver.name || "N/A"}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                }}
              >
                Driver ID: {selectedDriver._id || "N/A"}
              </p>
            </div>

            {/* =========================
                PERSONAL INFORMATION
            ========================= */}

            <div style={sectionBox}>
              <h3 style={sectionTitle}>
                👤 Personal Information
              </h3>

              <InfoRow
                label="Name"
                value={selectedDriver.name}
              />

              <InfoRow
                label="Email"
                value={selectedDriver.email}
              />

              <InfoRow
                label="Phone"
                value={selectedDriver.phone}
              />

              <InfoRow
                label="Age"
                value={selectedDriver.age}
              />

              <InfoRow
                label="Gender"
                value={selectedDriver.gender}
              />

              <InfoRow
                label="Address"
                value={selectedDriver.address}
              />

              <InfoRow
                label="Account Created"
                value={formatDate(selectedDriver.createdAt)}
              />
            </div>

            {/* =========================
                VEHICLE INFORMATION
            ========================= */}

            <div style={sectionBox}>
              <h3 style={sectionTitle}>
                🚗 Vehicle Information
              </h3>

              <InfoRow
                label="Vehicle Type"
                value={selectedDriver.vehicleType}
              />

              <InfoRow
                label="Vehicle Number"
                value={
                  selectedDriver.vehicleNumber ||
                  "Not available in database"
                }
              />

              <InfoRow
                label="Availability"
                value={
                  selectedDriver.isAvailable
                    ? "Available"
                    : "Not Available"
                }
              />
            </div>

            <div style={sectionBox}>
              <h3 style={sectionTitle}>
                🛡️ Verification
              </h3>

              <InfoRow
                label="Status"
                value={selectedDriver.isVerified}
              />

              <InfoRow
                label="Resubmitted"
                value={
                  selectedDriver.isResubmitted
                    ? "Yes"
                    : "No"
                }
              />

              <InfoRow
                label="Last Updated Document"
                value={selectedDriver.lastUpdatedDoc}
              />

              {selectedDriver.rejectionReason && (
                <InfoRow
                  label="Rejection Reason"
                  value={selectedDriver.rejectionReason}
                />
              )}

              {selectedDriver.rejectedFields &&
                selectedDriver.rejectedFields.length > 0 && (
                  <InfoRow
                    label="Rejected Fields"
                    value={selectedDriver.rejectedFields.join(", ")}
                  />
                )}
            </div>

            {/* =========================
                DOCUMENTS
            ========================= */}

            <div style={sectionBox}>
              <h3 style={sectionTitle}>
                📄 Documents
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >

                {selectedDriver.licensePhoto ? (
                  <a
                    href={selectedDriver.licensePhoto}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <button style={documentButton}>
                      📄 View Driving License
                    </button>
                  </a>
                ) : (
                  <span style={notAvailable}>
                    Driving License not uploaded
                  </span>
                )}

                {selectedDriver.rcPhoto ? (
                  <a
                    href={selectedDriver.rcPhoto}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <button style={documentButton}>
                      📄 View RC
                    </button>
                  </a>
                ) : (
                  <span style={notAvailable}>
                    RC not uploaded
                  </span>
                )}

              </div>
            </div>

            {/* =========================
                WALLET & FINANCE
            ========================= */}

            <div style={sectionBox}>
              <h3 style={sectionTitle}>
                💰 Wallet & Finance
              </h3>

              <InfoRow
                label="Wallet Balance"
                value={`₹${selectedDriver.walletBalance || 0}`}
              />

              <InfoRow
                label="Pending Balance"
                value={`₹${selectedDriver.pendingBalance || 0}`}
              />

              <InfoRow
                label="Penalty Due"
                value={`₹${selectedDriver.penaltyDue || 0}`}
              />

              <InfoRow
                label="Cancellation Count"
                value={selectedDriver.cancellationCount || 0}
              />
            </div>

            {/* =========================
                BANK DETAILS
            ========================= */}

            <div style={sectionBox}>
              <h3 style={sectionTitle}>
                🏦 Bank Details
              </h3>

              <InfoRow
                label="Account Holder"
                value={
                  selectedDriver.bankDetails?.accountHolderName
                }
              />

              <InfoRow
                label="Account Number"
                value={maskAccountNumber(
                  selectedDriver.bankDetails?.accountNumber
                )}
              />

              <InfoRow
                label="IFSC Code"
                value={
                  selectedDriver.bankDetails?.ifscCode
                }
              />
            </div>

            {/* =========================
                RATING
            ========================= */}

            <div style={sectionBox}>
              <h3 style={sectionTitle}>
                ⭐ Rating
              </h3>

              <InfoRow
                label="Rating"
                value={`⭐ ${selectedDriver.rating || 0}`}
              />

              <InfoRow
                label="Total Ratings"
                value={selectedDriver.totalRatings || 0}
              />
            </div>

            {/* =========================
                ACTIVITY
            ========================= */}

            <div style={sectionBox}>
              <h3 style={sectionTitle}>
                📊 Activity
              </h3>

              <InfoRow
                label="Available"
                value={
                  selectedDriver.isAvailable
                    ? "Yes"
                    : "No"
                }
              />

              <InfoRow
                label="Cancellation Count"
                value={
                  selectedDriver.cancellationCount || 0
                }
              />
            </div>

            {/* =========================
                CLOSE
            ========================= */}

            <button
              onClick={closeDriverDetails}
              style={closeButton}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}

// =========================
// REUSABLE INFO ROW
// =========================

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        padding: "10px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <strong
        style={{
          color: "#555",
          minWidth: "170px",
        }}
      >
        {label}
      </strong>

      <span
        style={{
          color: "#222",
          textAlign: "right",
          wordBreak: "break-word",
        }}
      >
        {value !== undefined &&
        value !== null &&
        value !== ""
          ? value
          : "N/A"}
      </span>
    </div>
  );
}

// =========================
// TABLE STYLES
// =========================

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

const viewButton = {
  background: "#f97316",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "6px",
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
  marginRight: "6px",
};

const blockButton = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "6px",
};

const unblockButton = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "6px",
};

const closeIconButton = {
  border: "none",
  background: "#f3f4f6",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "18px",
};

const sectionBox = {
  background: "#fafafa",
  border: "1px solid #eee",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "15px",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "10px",
  color: "#f97316",
};

const documentButton = {
  background: "#f97316",
  color: "white",
  border: "none",
  padding: "9px 13px",
  borderRadius: "7px",
  cursor: "pointer",
};

const notAvailable = {
  color: "#777",
  padding: "9px 0",
};

const closeButton = {
  width: "100%",
  marginTop: "10px",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  background: "#f97316",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

const avatarPlaceholder = {
  width: "110px",
  height: "110px",
  borderRadius: "50%",
  background: "#f3f4f6",
  border: "4px solid #f97316",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "45px",
};

export default Drivers;