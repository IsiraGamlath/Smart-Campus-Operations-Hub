import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Ticket, 
  Settings, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  User as UserIcon,
  Search,
  ChevronRight
} from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../ui";

const SidebarItem = ({ icon: Icon, label, to, active, collapsed }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
      active 
        ? "bg-primary-50 text-primary-600 font-semibold shadow-sm shadow-primary-100" 
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon size={20} className={cn("transition-colors", active ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")} />
    {!collapsed && <span className="text-sm">{label}</span>}
    {active && !collapsed && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-500" />}
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
        {label}
      </div>
    )}
  </Link>
);

const Navbar = ({ onToggleSidebar, isSidebarCollapsed, user }) => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search tickets, IDs..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="h-6 w-[1px] bg-slate-200"></div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || "Isira User"}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{user?.role || "ADMIN"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-primary-50 flex items-center justify-center text-primary-600 font-bold overflow-hidden shadow-sm">
            {user?.name ? user.name.charAt(0) : <UserIcon size={20} />}
          </div>
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children, user }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/tickets" },
    { icon: PlusCircle, label: "Create Ticket", to: "/tickets/create" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-200">
              <Ticket size={20} />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-slate-900 truncate">Smart Hub</span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to}
              {...item}
              active={location.pathname === item.to}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-3">
          {/* Database Status */}
          <div className="px-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">MongoDB Atlas Connected</span>
          </div>

          <div className="flex items-center gap-3 px-3 py-1 text-slate-400">
             <Settings size={20} />
             {!collapsed && <span className="text-xs">v1.2.0-stable</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        collapsed ? "ml-20" : "ml-64"
      )}>
        <Navbar 
          onToggleSidebar={() => setCollapsed(!collapsed)} 
          isSidebarCollapsed={collapsed} 
          user={user}
        />
        
        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
