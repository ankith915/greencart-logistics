// components/RouteForm.js
'use client';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';

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
    <form onSubmit={handleSubmit} className="bg-white p-3 rounded shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input required type="number" min="0" placeholder="Route ID" value={routeId} onChange={e => setRouteId(e.target.value)} />
        <Input required type="number" step="0.1" min="0" placeholder="Distance (km)" value={distanceKm} onChange={e => setDistanceKm(e.target.value)} />
        <Select value={trafficLevel} onChange={e => setTrafficLevel(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </Select>
        <Input required type="number" min="0" placeholder="Base time (min)" value={baseTimeMin} onChange={e => setBaseTimeMin(e.target.value)} />
      </div>

      <div className="flex gap-2 mt-3">
        <Button type="submit" className="mr-2" disabled={loading}>{initial ? 'Update' : 'Create'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
