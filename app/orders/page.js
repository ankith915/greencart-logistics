// app/orders/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OrderForm from '../../components/OrderForm';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
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
    const res = await fetch('/api/orders');
    if (!res.ok) {
      alert('Failed to load orders');
      return;
    }
    setOrders(await res.json());
  };

  const handleSaved = (order) => {
    if (editing) setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    else setOrders((prev) => [...prev, order]);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (o) => {
    setEditing(o);
    setShowForm(true);
  };

  const handleDelete = async (o) => {
    if (!confirm(`Delete order ${o.orderId}?`)) return;
    const res = await fetch(`/api/orders/${o.id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
      return;
    }
    setOrders((prev) => prev.filter((x) => x.id !== o.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div>
          <button onClick={() => { setEditing(null); setShowForm((s) => !s); }} className="bg-green-600 text-white px-4 py-2 rounded">
            {showForm ? 'Close' : 'New Order'}
          </button>
        </div>
      </div>

      {showForm && (
        <OrderForm
          initial={editing}
          onCancel={() => { setEditing(null); setShowForm(false); }}
          onSaved={handleSaved}
        />
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Value (₹)</th>
              <th className="p-2 text-left">Route</th>
              <th className="p-2 text-left">Delivery Time</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.orderId}</td>
                <td className="p-2">₹{o.valueRs}</td>
                <td className="p-2">{o.routeId}</td>
                <td className="p-2">{o.deliveryTime}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(o)} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleDelete(o)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
