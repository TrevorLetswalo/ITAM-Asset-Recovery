import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Queue, 
  AlertTriangle, 
  Mail, 
  BarChart3, 
  Settings,
  Search,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Recovery Queue', path: '/recovery-queue', icon: Queue },
  { name: 'SLA Breaches', path: '/sla-breaches', icon: AlertTriangle },
  { name: 'Email Templates', path: '/email-templates', icon: Mail },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-recovery-bg">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-recovery-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-recovery-dark-light">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-recovery-accent rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">Asset Recovery</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-recovery-accent text-white shadow-lg"
                      : "text-gray-300 hover:bg-recovery-dark-light hover:text-white"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-4 py-4 border-t border-recovery-dark-light">
            <div className="text-xs text-gray-400 text-center">
              v1.0.0 • IT Asset Recovery Console
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets, users, or tickets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Profile */}
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-recovery-accent rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium">Admin User</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-recovery-bg">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
