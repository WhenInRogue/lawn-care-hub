import { Link } from "react-router-dom";
import ApiService from "@/services/ApiService";

const Sidebar = () => {
  const isAuth = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();

  const logout = () => {
    ApiService.logout();
  };

  return (
    <div className="sidebar">
      <h1 className="ims">IMS</h1>
      <ul className="nav-links">
        {isAuth && (
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/supplyTransactions">Supply Usage</Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to="/supply">Supplies</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/checkInSupply">Check-In</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/checkOutSupply">Check-out</Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to="/equipment">Equipment</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/equipmentTransactions">Equipment Usage</Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to="/start-maintenance">Start Maintenance</Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to="/end-maintenance">End Maintenance</Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to="/maintenanceRecords">Maintenance Records</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link onClick={logout} to="/login">
              Logout
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
