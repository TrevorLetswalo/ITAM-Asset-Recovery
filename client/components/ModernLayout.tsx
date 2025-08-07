import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  List, 
  AlertTriangle, 
  Mail, 
  BarChart3, 
  Settings,
  Search,
  Bell,
  User,
  Menu,
  X,
  HeadphonesIcon,
  ChevronDown,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: LayoutDashboard,
    description: 'Overview & Analytics'
  },
  { 
    name: 'Recovery Queue', 
    path: '/recovery-queue', 
    icon: List,
    description: 'Asset Management'
  },
  { 
    name: 'SLA Breaches', 
    path: '/sla-breaches', 
    icon: AlertTriangle,
    description: 'Critical Alerts',
    badge: '3'
  },
  { 
    name: 'Self Service Portal', 
    path: '/self-service', 
    icon: HeadphonesIcon,
    description: 'User Portal',
    highlight: true
  },
  { 
    name: 'Email Templates', 
    path: '/email-templates', 
    icon: Mail,
    description: 'Communication'
  },
  { 
    name: 'Reports', 
    path: '/reports', 
    icon: BarChart3,
    description: 'Analytics & Insights'
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: Settings,
    description: 'Configuration'
  },
];

export function ModernLayout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar - Sticky */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        "glass-nav border-r border-glass-border lg:sticky lg:top-0 lg:h-screen",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        sidebarCollapsed ? "w-20" : "w-72"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-20 items-center px-6 border-b border-glass-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-recovery-accent to-recovery-highlight rounded-xl flex items-center justify-center shadow-medium">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-white font-poppins font-semibold text-lg tracking-tight">
                    Asset Recovery
                  </h1>
                  <p className="text-gray-300 text-xs">IT Management Console</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    "hover:bg-white/10 hover:backdrop-blur-lg hover:scale-[1.02]",
                    isActive
                      ? "bg-gradient-to-r from-recovery-accent to-recovery-highlight text-white shadow-medium scale-[1.02]"
                      : "text-gray-300 hover:text-white",
                    item.highlight && !isActive ? "bg-recovery-highlight/20 border border-recovery-highlight/30" : ""
                  )}
                >
                  <Icon className={cn(
                    "flex-shrink-0 h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  )} />
                  
                  {!sidebarCollapsed && (
                    <>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className={cn(
                          "text-xs mt-0.5 transition-colors",
                          isActive ? "text-white/80" : "text-gray-400 group-hover:text-gray-300"
                        )}>
                          {item.description}
                        </p>
                      </div>
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-4 py-4 border-t border-glass-border">
            {!sidebarCollapsed ? (
              <div className="space-y-3">
                <div className="glass-card p-3 rounded-lg">
                  <div className="text-xs text-gray-300 text-center">
                    <span className="block font-medium">v1.0.0</span>
                    <span className="text-gray-400">IT Asset Recovery Console</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(true)}
                  className="w-full text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Collapse
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(false)}
                className="w-full text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Navigation */}
        <header className="glass-card border-b border-glass-border h-20 flex items-center justify-between px-6 shadow-soft">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Enhanced Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets, users, asset tags..."
                className="w-80 pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-recovery-accent focus:border-transparent shadow-soft transition-all duration-200 focus:shadow-medium"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="relative text-gray-600 hover:text-gray-900"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-gray-600 hover:text-gray-900"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-medium">
                3
              </span>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <div className="w-8 h-8 bg-gradient-to-br from-recovery-accent to-recovery-highlight rounded-xl flex items-center justify-center shadow-soft">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <span className="text-sm font-medium">Trevor Letswalo</span>
                  <span className="text-xs text-gray-500 block">Administrator</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content with enhanced styling */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
