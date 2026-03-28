import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { Zap, LogOut, Map, LayoutDashboard, Swords, Trophy, User } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/quests', label: 'Quests', icon: Map },
  { to: '/battle', label: 'Code Wars', icon: Swords },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
];

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-foreground tracking-wider text-sm">
            DSA<span className="text-primary">-QUEST</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-body font-semibold text-sm transition-colors ${
                  active
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-border">
          <span className="text-2xl">{user?.avatar}</span>
          <span className="text-foreground font-body font-semibold text-sm hidden sm:block">{user?.username}</span>
          <button
            onClick={() => { dispatch(logout()); navigate('/'); }}
            className="text-muted-foreground hover:text-destructive transition-colors ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center justify-around border-t border-border py-1">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-body ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
