import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/store/authSlice';
import { Zap } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    dispatch(login({
      user: {
        id: '1',
        username: username || 'NewWarrior',
        email: email || 'new@dsaquest.dev',
        level: 1,
        xp: 0,
        xpToNext: 100,
        streak: 0,
        avatar: '⚡',
        joinedDate: new Date().toISOString().split('T')[0],
        skills: { Arrays: 0, Graphs: 0, DP: 0, Trees: 0, Strings: 0, 'Bit Manipulation': 0 },
      },
      token: 'mock-jwt-token-new',
    }));
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-grid-pattern relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-primary">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-wider text-foreground">
              DSA<span className="text-primary text-glow-primary">-QUEST</span>
            </h1>
          </div>
          <p className="text-muted-foreground font-body text-lg">Create your warrior profile</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">Join the Guild</h2>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-body font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="CodeWarrior"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
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
              {loading ? 'Creating...' : 'Begin Your Quest'}
            </button>
          </form>
          <p className="text-center mt-6 text-muted-foreground font-body">
            Already a warrior?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
