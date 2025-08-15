// components/RouteForm.js
'use client';
import { useState, useEffect } from 'react';

export default function RouteForm({ initial = null, onCancel = () => {}, onSaved = () => {} }) {
  const [routeId, setRouteId] = useState(initial?.routeId ?? '');
  const [distanceKm, setDistanceKm] = useState(initial?.distanceKm ?? '');
  const [trafficLevel, setTrafficLevel] = useState(initial?.trafficLevel ?? 'Medium');
  const [baseTimeMin, setBaseTimeMin] = useState(initial?.baseTimeMin ?? '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRouteId(initial?.routeId ?? '');
    setDistanceKm(initial?.distanceKm ?? '');
    setTrafficLevel(initial?.trafficLevel ?? 'Medium');
    setBaseTimeMin(initial?.baseTimeMin ?? '');
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        route_id: Number(routeId),
        distance_km: Number(distanceKm),
        traffic_level: trafficLevel,
        base_time_min: Number(baseTimeMin),
      };
      const method = initial ? 'PUT' : 'POST';
      const url = initial ? `/api/routes/${initial.id}` : '/api/routes';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to save route');
      }
      const data = await res.json();
      onSaved(data);
      // reset if it was a create
      if (!initial) {
        setRouteId('');
        setDistanceKm('');
        setTrafficLevel('Medium');
        setBaseTimeMin('');
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
          placeholder="Route ID (numeric)"
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          required
          type="number"
          step="0.1"
          min="0"
          placeholder="Distance (km)"
          value={distanceKm}
          onChange={(e) => setDistanceKm(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={trafficLevel}
          onChange={(e) => setTrafficLevel(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          required
          type="number"
          min="0"
          placeholder="Base Time (minutes)"
          value={baseTimeMin}
          onChange={(e) => setBaseTimeMin(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <div className="flex gap-2 mt-3">
        <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {initial ? 'Update Route' : 'Create Route'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
          Cancel
        </button>
      </div>
    </form>
  );
}
