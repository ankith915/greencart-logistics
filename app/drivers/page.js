// app/drivers/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverForm from '@/components/DriverForm';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/checkauth').then(res => { if (!res.ok) router.push('/login'); });
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    const res = await fetch('/api/drivers');
    if (!res.ok) return setDrivers([]);
    setDrivers(await res.json());
  };

  const addOrUpdate = async (payload) => {
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/drivers/${editing.id}` : '/api/drivers';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      if (editing) setDrivers(prev => prev.map(d => (d.id === updated.id ? updated : d)));
      else setDrivers(prev => [updated, ...prev]);
      setEditing(null);
      setShowForm(false);
    } catch (err) {
      alert(err.message || 'Error');
    }
  };

  const deleteDriver = async (id) => {
    if (!confirm('Delete this driver?')) return;
    const res = await fetch(`/api/drivers/${id}`, { method: 'DELETE' });
    if (res.ok) setDrivers(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Drivers</h1>
        <div>
          <button onClick={() => { setEditing(null); setShowForm(s => !s); }} className="bg-green-600 text-white px-4 py-2 rounded">
            {showForm ? 'Close' : 'New Driver'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded shadow">
          <DriverForm initialData={editing ?? {}} onSubmit={addOrUpdate} />
        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Shift Hours</th>
              <th className="p-3 text-left">Past Week</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d.id} className="border-t hover:bg-slate-50">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.shiftHours}</td>
                <td className="p-3">{(d.pastWeekHours || []).join(', ')}</td>
                <td className="p-3">
                  <button onClick={() => { setEditing(d); setShowForm(true); }} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => deleteDriver(d.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-slate-400">No drivers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
