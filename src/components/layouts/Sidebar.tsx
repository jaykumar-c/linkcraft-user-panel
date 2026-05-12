import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Link as LinkIcon,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials, generateAvatarColor } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Links', href: '/dashboard/links', icon: LinkIcon },
  { name: 'AI Bio', href: '/dashboard/ai-bio', icon: Sparkles },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-80 border-r bg-background p-6 transition-transform duration-300 lg:static lg:block lg:translate-x-0',
          !isOpen && '-translate-x-full lg:translate-x-0'
        )}
        style={{ borderColor: "hsl(var(--primary) / 0.1)" }}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))", boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)" }}>
                <span className="text-lg font-bold text-white">L</span>
              </div>
              <span className="text-xl font-bold">LinkCraft</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav label */}
          <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-3 px-2">Menu</p>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 relative',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-0.5'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="pt-4" style={{ borderTop: "1px solid hsl(var(--primary) / 0.1)" }}>
            <Link
              to="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 mb-3 hover:bg-accent/50 p-2 rounded-xl -mx-2 transition-all duration-200 cursor-pointer"
            >
              <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                <AvatarImage src={profile?.avatarUrl || profile?.avatar_url || profile?.avatar || user?.avatarUrl || user?.avatar_url || user?.avatar || undefined} />
                <AvatarFallback className={generateAvatarColor(profile?.displayName || profile?.display_name || user?.displayName || user?.display_name || 'User')}>
                  {getInitials(profile?.displayName || profile?.display_name || user?.displayName || user?.display_name || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile?.displayName || profile?.display_name || user?.displayName || user?.display_name}</p>
                <p className="text-xs text-muted-foreground truncate">@{profile?.username || user?.username}</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive transition-colors"
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
