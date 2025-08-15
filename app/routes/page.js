// app/routes/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RouteForm from '../../components/RouteForm';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const auth = await fetch('/api/auth/checkauth');
      if (!auth.ok) return router.push('/login');

      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    const res = await fetch('/api/routes');
    if (!res.ok) {
      alert('Failed to load routes');
      return;
    }
    setRoutes(await res.json());
  };

  const handleSaved = (route) => {
    // if editing, replace
    if (editing) {
      setRoutes((prev) => prev.map((r) => (r.id === route.id ? route : r)));
    } else {
      setRoutes((prev) => [...prev, route]);
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (r) => {
    setEditing(r);
    setShowForm(true);
  };

  const handleDelete = async (r) => {
    if (!confirm(`Delete route ${r.routeId}?`)) return;
    const res = await fetch(`/api/routes/${r.id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
      return;
    }
    setRoutes((prev) => prev.filter((x) => x.id !== r.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Routes</h1>
        <div>
          <button onClick={() => { setEditing(null); setShowForm((s) => !s); }} className="bg-green-600 text-white px-4 py-2 rounded">
            {showForm ? 'Close' : 'New Route'}
          </button>
        </div>
      </div>

      {showForm && (
        <RouteForm
          initial={editing}
          onCancel={() => { setEditing(null); setShowForm(false); }}
          onSaved={handleSaved}
        />
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Route ID</th>
              <th className="p-2 text-left">Distance (km)</th>
              <th className="p-2 text-left">Traffic</th>
              <th className="p-2 text-left">Base Time (min)</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.routeId}</td>
                <td className="p-2">{r.distanceKm}</td>
                <td className="p-2">
                  <span className={
                    r.trafficLevel === 'High' ? 'px-2 py-1 rounded bg-red-100 text-red-700' :
                    r.trafficLevel === 'Medium' ? 'px-2 py-1 rounded bg-yellow-100 text-yellow-700' :
                    'px-2 py-1 rounded bg-green-100 text-green-700'
                  }>
                    {r.trafficLevel}
                  </span>
                </td>
                <td className="p-2">{r.baseTimeMin}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(r)} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleDelete(r)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {routes.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No routes yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
