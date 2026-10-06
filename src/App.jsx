import { useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./components/SidebarTemp";
import Dashboard from "./components/Dashboard";
import DriversPage from "./components/Drivers";
import Withdrawals from "./components/WithdrawalsTemp";
import Rides from "./components/Rides";
import Users from "./components/Users";
import Payments from "./components/Payments";
import FinancialLedger from "./components/FinancialLedger";
import WhatsApp from "./components/WhatsApp";

const API_BASE_URL = "http://localhost:3000/api/admin";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  // =========================
  // FETCH DRIVERS
  // =========================

  const fetchDrivers = async () => {
    try {
      setLoadingDrivers(true);

      const response = await fetch(`${API_BASE_URL}/drivers`);
      const data = await response.json();

      if (data.success) {
        setDrivers(data.drivers || []);
      } else {
        alert("Drivers load nahi ho paaye!");
      }
    } catch (error) {
      console.error("Driver Fetch Error:", error);
      alert("Backend se connection nahi ho raha!");
    } finally {
      setLoadingDrivers(false);
    }
  };

  useEffect(() => {
    if (activePage === "drivers") {
      fetchDrivers();
    }
  }, [activePage]);

  // =========================
  // PAGE
  // =========================

  const renderPage = () => {
    switch (activePage) {

      case "dashboard":
        return <Dashboard drivers={drivers} />;

      case "drivers":
        return (
          <DriversPage
            drivers={drivers}
            loadingDrivers={loadingDrivers}
            fetchDrivers={fetchDrivers}
          />
        );

      case "rides":
        return <Rides />;

      case "users":
        return <Users />;

      case "withdrawals":
        return <Withdrawals />;

      case "payments":
        return <Payments />;

      case "ledger":
        return <FinancialLedger />;

      case "whatsapp":
        return <WhatsApp />;

      default:
        return <Dashboard drivers={drivers} />;
    }
  };

  return (
    <div className="admin-layout">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;