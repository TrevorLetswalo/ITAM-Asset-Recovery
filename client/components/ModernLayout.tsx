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
  HeadphonesIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import ChatAssistant from './ChatAssistant';

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

  const handleNotifications = () => {
    alert('🔔 Notifications Center\n\nRecent notifications:\n\n• 3 SLA breaches require attention\n• New asset recovery request submitted\n• System backup completed\n• 2 pending approvals');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert('🔍 Search functionality would be implemented here');
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

      {/* Left Vertical Navigation Bar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        "w-72 lg:sticky lg:top-0 lg:h-screen",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ backgroundColor: '#F0E4D7' }} // Sandy beige background
      >
        <div className="flex h-full flex-col">
          {/* User Info Section - Teal background */}
          <div 
            className="flex items-center px-6 py-6 border-b border-white/20"
            style={{ backgroundColor: '#4CA1A3' }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  Trevor Letswalo
                </h2>
                <p className="text-white/80 text-sm">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
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
                    "hover:scale-[1.02]",
                    isActive
                      ? "shadow-lg scale-[1.02]"
                      : "hover:shadow-md",
                    item.highlight && !isActive ? "border-2 border-opacity-30" : ""
                  )}
                  style={{
                    backgroundColor: isActive ? '#FF6F61' : 'transparent',
                    color: '#05445E', // Navy text
                    borderColor: item.highlight && !isActive ? '#FF6F61' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#FF6F61';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#05445E';
                    }
                  }}
                >
                  <Icon className={cn(
                    "flex-shrink-0 h-5 w-5 transition-colors",
                    isActive ? "text-white" : ""
                  )} />
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "font-medium",
                        isActive ? "text-white" : ""
                      )}>{item.name}</span>
                      {item.badge && (
                        <Badge 
                          className="text-white text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#FF6F61' }}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs mt-0.5 transition-colors opacity-70",
                      isActive ? "text-white" : ""
                    )}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-4 py-4 border-t border-white/20">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
              <div className="text-xs text-center" style={{ color: '#05445E' }}>
                <span className="block font-medium">v1.0.0</span>
                <span className="opacity-70">IT Asset Recovery Console</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Full Background Color */}
        <header 
          className="h-16 flex items-center px-6"
          style={{ 
            backgroundColor: '#85D1DB', // Full background color corner to corner
            borderBottom: '1px solid rgba(76, 161, 163, 0.2)'
          }}
        >
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:text-white/80 mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Title - Left aligned, white, smaller font */}
          <h1 className="text-white font-medium text-lg mr-8">
            IT Asset Recovery Dashboard
          </h1>

          {/* Search bar - Decreased size */}
          <div className="flex-1 flex justify-center max-w-xs">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:border-white focus:outline-none transition-all duration-200"
                style={{
                  boxShadow: '0 2px 8px rgba(5, 68, 94, 0.1)'
                }}
              />
            </form>
          </div>

          {/* Refresh and Notification - Far right */}
          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert('🔄 Refreshing dashboard data...')}
              className="text-white hover:text-white/80 hover:bg-white/10 rounded-xl"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotifications}
              className="relative text-white hover:text-white/80 hover:bg-white/10 rounded-xl"
            >
              <Bell className="h-5 w-5" />
              <span
                className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#FF6F61' }}
              >
                3
              </span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50/30 to-blue-100/20">
          <div className="p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}
