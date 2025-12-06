import { Link, useNavigate } from "react-router-dom";
import ApiService from "@/services/ApiService";
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  ClipboardList, 
  User, 
  LogOut,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings,
  Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const navigate = useNavigate();
  const isAuth = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();

  const handleLogout = () => {
    ApiService.logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: isAuth },
    { to: "/supplyTransactions", label: "Supply Usage", icon: ClipboardList, show: isAuth },
    { to: "/supply", label: "Supplies", icon: Package, show: isAdmin },
    { to: "/checkInSupply", label: "Check-In", icon: ArrowDownToLine, show: isAuth },
    { to: "/checkOutSupply", label: "Check-Out", icon: ArrowUpFromLine, show: isAuth },
    { to: "/equipment", label: "Equipment", icon: Wrench, show: isAdmin },
    { to: "/equipmentTransactions", label: "Equipment Usage", icon: ClipboardList, show: isAuth },
    { to: "/start-maintenance", label: "Start Maintenance", icon: Settings, show: isAdmin },
    { to: "/end-maintenance", label: "End Maintenance", icon: Settings, show: isAdmin },
    { to: "/maintenanceRecords", label: "Maintenance Records", icon: ClipboardList, show: isAdmin },
    { to: "/profile", label: "Profile", icon: User, show: isAuth },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 gradient-dark text-sidebar-foreground flex flex-col shadow-elevated z-50">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">LawnCare99</h1>
            <p className="text-xs text-sidebar-foreground/60">Inventory System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) =>
            item.show ? (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                    "hover:bg-sidebar-accent group"
                  )}
                >
                  <item.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ) : null
          )}
        </ul>
      </nav>

      {isAuth && (
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
