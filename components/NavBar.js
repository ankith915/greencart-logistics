'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const router = useRouter();

  // components/NavBar.js (only the handleLogout part)
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    // After server clears the cookie, force route to login
    router.push('/login');
  };


  return (
    <nav className="bg-blue-600 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/simulation">Simulation</Link></li>
        <li><Link href="/history">History</Link></li>
        <li><Link href="/drivers">Drivers</Link></li>
        <li><Link href="/routes">Routes</Link></li>
        <li><Link href="/orders">Orders</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}