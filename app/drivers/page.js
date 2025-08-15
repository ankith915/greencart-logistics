'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverForm from '../../components/DriverForm';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [editing, setEditing] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/checkauth').then(res => { if (!res.ok) router.push('/login'); });
    fetch('/api/drivers')
      .then(res => res.json())
      .then(data => {
        // backend returns objects: { id, name, shiftHours, pastWeekHours }
        setDrivers(data || []);
      });
  }, [router]);

  const addOrUpdate = async (data) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/drivers/${editing.id}` : '/api/drivers';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      if (editing) {
        setDrivers(drivers.map(d => (d.id === updated.id ? updated : d)));
      } else {
        setDrivers(prev => [...prev, updated]);
      }
      setEditing(null);
    } else {
      const err = await res.json();
      alert(err?.error || 'Failed');
    }
  };

  const deleteDriver = async (id) => {
    const res = await fetch(`/api/drivers/${id}`, { method: 'DELETE' });
    if (res.ok) setDrivers(drivers.filter(d => d.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <DriverForm onSubmit={addOrUpdate} initialData={editing} />
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
