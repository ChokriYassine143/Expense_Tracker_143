
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  CreditCard, 
  DollarSign, 
  Home, 
  LogOut, 
  PieChart,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, end, onClick }) => {
  return (
    <NavLink 
      to={to} 
      end={end}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-md transition-colors
        ${isActive 
          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const SidebarContent: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="h-full flex flex-col py-4">
      <div className="px-3 mb-8">
        <h1 className="text-xl font-bold text-sidebar-foreground">ExpenseTracker</h1>
      </div>
      
      <div className="flex-1 px-2 space-y-1">
        <SidebarLink 
          to="/dashboard" 
          icon={<Home size={20} />} 
          label="Dashboard" 
          end
          onClick={onLinkClick}
        />
        <SidebarLink 
          to="/dashboard/expenses" 
          icon={<CreditCard size={20} />} 
          label="Expenses" 
          onClick={onLinkClick}
        />
        <SidebarLink 
          to="/dashboard/income" 
          icon={<DollarSign size={20} />} 
          label="Income" 
          onClick={onLinkClick}
        />
        <SidebarLink 
          to="/dashboard/analytics" 
          icon={<BarChart3 size={20} />} 
          label="Analytics" 
          onClick={onLinkClick}
        />
      </div>
      
      <div className="mt-auto px-2 py-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export const AppSidebar = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40">
            <BarChart3 size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-sidebar border-r border-sidebar-border">
          <SidebarContent onLinkClick={() => document.body.click()} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden md:block w-64 h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0">
      <SidebarContent />
    </div>
  );
};
