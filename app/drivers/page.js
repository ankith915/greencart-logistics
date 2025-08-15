// app/drivers/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverForm from '../../components/DriverForm';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [editing, setEditing] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // auth guard
    fetch('/api/auth/checkauth').then(res => { if (!res.ok) router.push('/login'); });
    // load drivers
    fetch('/api/drivers')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load drivers');
        return res.json();
      })
      .then(data => setDrivers(data || []))
      .catch(err => {
        console.error(err);
        setDrivers([]);
      });
  }, [router]);

  // create or update (Prisma uses id)
  const addOrUpdate = async (payload) => {
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/drivers/${editing.id}` : '/api/drivers';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed');
      }
      const updated = await res.json();
      if (editing) {
        setDrivers(prev => prev.map(d => (d.id === updated.id ? updated : d)));
      } else {
        setDrivers(prev => [...prev, updated]);
      }
      setEditing(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteDriver = async (id) => {
    if (!confirm('Delete this driver?')) return;
    const res = await fetch(`/api/drivers/${id}`, { method: 'DELETE' });
    if (res.ok) setDrivers(prev => prev.filter(d => d.id !== id));
    else {
      const err = await res.json().catch(() => ({}));
      alert(err?.error || 'Delete failed');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* pass empty object when editing is null to avoid null props */}
      <DriverForm onSubmit={addOrUpdate} initialData={editing ?? {}} />
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Shift Hours</th>
              <th className="p-2 text-left">Past Week</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.shiftHours}</td>
                <td className="p-2">{(d.pastWeekHours || []).join(', ')}</td>
                <td className="p-2">
                  <button onClick={() => setEditing(d)} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => deleteDriver(d.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No drivers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
