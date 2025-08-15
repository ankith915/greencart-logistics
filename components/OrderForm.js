// components/OrderForm.js
'use client';
import { useState, useEffect } from 'react';

export default function OrderForm({ initial = null, onCancel = () => {}, onSaved = () => {} }) {
  const [orderId, setOrderId] = useState(initial?.orderId ?? '');
  const [valueRs, setValueRs] = useState(initial?.valueRs ?? '');
  const [routeId, setRouteId] = useState(initial?.routeId ?? '');
  const [deliveryTime, setDeliveryTime] = useState(initial?.deliveryTime ?? '');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOrderId(initial?.orderId ?? '');
    setValueRs(initial?.valueRs ?? '');
    setRouteId(initial?.routeId ?? '');
    setDeliveryTime(initial?.deliveryTime ?? '');
    (async () => {
      try {
        const r = await fetch('/api/routes');
        const data = await r.json();
        setRoutes(data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        order_id: Number(orderId),
        value_rs: Number(valueRs),
        route_id: Number(routeId),
        delivery_time: deliveryTime,
      };
      const method = initial ? 'PUT' : 'POST';
      const url = initial ? `/api/orders/${initial.id}` : '/api/orders';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to save order');
      }
      const data = await res.json();
      onSaved(data);
      if (!initial) {
        setOrderId('');
        setValueRs('');
        setRouteId('');
        setDeliveryTime('');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          required
          type="number"
          min="0"
          placeholder="Order ID (numeric)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          required
          type="number"
          min="0"
          placeholder="Value (₹)"
          value={valueRs}
          onChange={(e) => setValueRs(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          required
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select route</option>
          {routes.map((r) => (
            <option key={r.id} value={r.routeId}>
              {r.routeId} — {r.trafficLevel} — {r.distanceKm} km
            </option>
          ))}
        </select>
        <input
          required
          type="text"
          placeholder="Delivery Time (HH:MM)"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <div className="flex gap-2 mt-3">
        <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {initial ? 'Update Order' : 'Create Order'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
          Cancel
        </button>
      </div>
    </form>
  );
}
