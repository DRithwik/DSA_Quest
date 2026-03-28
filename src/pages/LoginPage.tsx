import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/store/authSlice';
import { Zap } from 'lucide-react';

const mockUser = {
  id: '1',
  username: 'CodeWarrior',
  email: 'warrior@dsaquest.dev',
  level: 7,
  xp: 340,
  xpToNext: 650,
  streak: 12,
  avatar: '🧙‍♂️',
  joinedDate: '2024-01-15',
  skills: { Arrays: 72, Graphs: 45, DP: 30, Trees: 55, Strings: 60, 'Bit Manipulation': 20 },
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    await new Promise(r => setTimeout(r, 800));
    dispatch(login({ user: { ...mockUser, email: email || mockUser.email }, token: 'mock-jwt-token-xyz' }));
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-grid-pattern relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-primary">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-wider text-foreground">
              DSA<span className="text-primary text-glow-primary">-QUEST</span>
            </h1>
          </div>
          <p className="text-muted-foreground font-body text-lg">Enter the realm of algorithms</p>
        </div>

        {/* Form card */}
        <div className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-body font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="warrior@dsaquest.dev"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-display font-bold py-3 rounded-lg glow-primary hover:brightness-110 transition-all disabled:opacity-50 tracking-wider uppercase text-sm"
            >
              {loading ? 'Entering...' : 'Enter the Quest'}
            </button>
          </form>
          <p className="text-center mt-6 text-muted-foreground font-body">
            No account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-semibold">
              Join the Guild
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
