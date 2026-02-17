import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/types';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  roles: Role[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'PROPERTY_MANAGER', 'TECH'] },
  { to: '/properties', label: 'Properties', icon: '🏢', roles: ['ADMIN', 'PROPERTY_MANAGER'] },
  { to: '/work-orders', label: 'Work Orders', icon: '🔧', roles: ['ADMIN', 'PROPERTY_MANAGER', 'TECH'] },
  { to: '/invoices', label: 'Billing', icon: '💰', roles: ['ADMIN', 'PROPERTY_MANAGER'] },
  { to: '/settings', label: 'Settings', icon: '⚙️', roles: ['ADMIN'] },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gray-900 text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold">
            S&E
          </div>
          <span className="text-sm font-semibold leading-tight">
            Maintenance<br />Manager
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-gray-400 hover:text-white lg:hidden"
        >
          ✕
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 px-4 py-3">
        <p className="text-xs text-gray-500">S&E Texas Services Inc</p>
      </div>
    </aside>
  );
}
