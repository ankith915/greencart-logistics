// components/NavBar.js
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Home, Truck, Map, Clock, Users, FileText } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';

export default function NavBar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const NavLink = ({ href, children }) => (
    <Link href={href} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100">
      {children}
    </Link>
  );

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold">GC</div>
            <div>
              <div className="font-semibold">GreenCart</div>
              <div className="text-xs text-slate-500">Logistics</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-6">
            <NavLink href="/dashboard"><Home size={16} /> Dashboard</NavLink>
            <NavLink href="/simulation"><Truck size={16} /> Simulation</NavLink>
            <NavLink href="/history"><Clock size={16} /> History</NavLink>
            <NavLink href="/drivers"><Users size={16} /> Drivers</NavLink>
            <NavLink href="/routes"><Map size={16} /> Routes</NavLink>
            <NavLink href="/orders"><FileText size={16} /> Orders</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-sm text-slate-600">Signed in as <strong className="ml-1">admin</strong></div>
          <Avatar>AD</Avatar>
          <Button onClick={handleLogout} className="ml-2" variant="ghost">
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
