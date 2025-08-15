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
      .then(setDrivers);
  }, [router]);

  const addOrUpdate = async (data) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/drivers/${editing._id}` : '/api/drivers';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setDrivers(editing ? drivers.map(d => d._id === updated._id ? updated : d) : [...drivers, updated]);
      setEditing(null);
    }
  };

  const deleteDriver = async (id) => {
    const res = await fetch(`/api/drivers/${id}`, { method: 'DELETE' });
    if (res.ok) setDrivers(drivers.filter(d => d._id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      <DriverForm onSubmit={addOrUpdate} initialData={editing} />
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Shift Hours</th>
            <th>Past Week</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(d => (
            <tr key={d._id}>
              <td>{d.name}</td>
              <td>{d.shift_hours}</td>
              <td>{d.past_week_hours.join(', ')}</td>
              <td>
                <button onClick={() => setEditing(d)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => deleteDriver(d._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}