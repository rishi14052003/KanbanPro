import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/tasks', label: 'Tasks', icon: '✅' },
    { path: '/team', label: 'Teams', icon: '👥' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];
  
  return (
    <aside className={`fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            {isOpen && (
              <span className="text-xl font-bold text-text-primary">TaskForge</span>
            )}
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        
        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
              <span className="text-text-primary font-medium">JD</span>
            </div>
            {isOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">John Doe</p>
                <p className="text-xs text-text-secondary">john@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
