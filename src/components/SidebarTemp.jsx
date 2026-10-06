function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "drivers", icon: "👨‍✈️", label: "Drivers" },
    { id: "rides", icon: "🚗", label: "Rides" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "withdrawals", icon: "💰", label: "Withdrawals" },
    { id: "payments", icon: "💳", label: "Payments" },
    { id: "ledger", icon: "📒", label: "Financial Ledger" },
    { id: "whatsapp", icon: "📱", label: "WhatsApp" },
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        🚗 <span>RidePartner</span>
      </div>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu ${
              activePage === item.id ? "active" : ""
            }`}
            onClick={() => setActivePage(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <button className="logout">
        🚪 Logout
      </button>

    </aside>
  );
}

export default Sidebar;