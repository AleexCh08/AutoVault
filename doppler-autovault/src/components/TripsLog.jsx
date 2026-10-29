import React, { useState } from 'react';
import { todayISO, formatNumber } from '../utils/helpers';

export default function TripsLog({ odometer, trips, updateState }) {
  const [date, setDate] = useState(todayISO());
  const [mode, setMode] = useState('delta');
  const [km, setKm] = useState('');
  const [route, setRoute] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = Number(km);
    if (!date || isNaN(val) || val <= 0 || !route.trim()) return;

    let kmAdded = 0;
    let odometerAfter = odometer;

    if (mode === "delta") {
      kmAdded = val;
      odometerAfter = Number((odometer + val).toFixed(1));
    } else {
      if (val <= odometer) {
        alert(`La lectura directa debe ser superior al odómetro actual (${odometer} km).`);
        return;
      }
      kmAdded = Number((val - odometer).toFixed(1));
      odometerAfter = Number(val.toFixed(1));
    }

    const newTrip = {
      id: "trip_" + Date.now(),
      date,
      route: route.trim(),
      kmAdded,
      odometerAfter
    };

    updateState({
      odometer: odometerAfter,
      trips: [newTrip, ...trips]
    });

    setKm('');
    setRoute('');
  };

  const deleteTrip = (id) => {
    updateState({ trips: trips.filter(t => t.id !== id) });
  };

  return (
    <section>
      <div className="section-header">
        <div>
          <span className="eyebrow">Control de rodaje</span>
          <h2 className="section-title">Bitácora de uso por salida</h2>
          <p className="section-subtitle">Registra kilómetros recorridos en el viaje o el nuevo total del tablero.</p>
        </div>
      </div>

      <div className="card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Fecha</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Modo de cálculo</label>
            <select value={mode} onChange={e => setMode(e.target.value)}>
              <option value="delta">Sumar km recorridos (+Km)</option>
              <option value="absolute">Lectura directa de odómetro</option>
            </select>
          </div>
          <div className="field">
            <label>{mode === 'delta' ? 'Kilómetros recorridos' : 'Nueva lectura (km)'}</label>
            <input type="number" min="1" step="0.1" required value={km} onChange={e => setKm(e.target.value)} placeholder={mode === 'delta' ? 'Ej. 24' : `Mayor a ${odometer}`} />
          </div>
          <div className="field">
            <label>Ruta / Motivo</label>
            <input type="text" required value={route} onChange={e => setRoute(e.target.value)} placeholder="Ej. UCV / Quinta Crespo" />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button type="submit" className="btn-primary">Registrar recorrido →</button>
          </div>
        </form>

        <div style={{ marginTop: '24px' }}>
          {trips.length === 0 ? (
            <div className="empty-state">Sin recorridos registrados. Ingresa tu primer viaje arriba.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Ruta / Uso</th>
                    <th>Distancia</th>
                    <th>Odómetro resultante</th>
                    <th style={{ textAlign: 'right' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map(t => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td>{t.route}</td>
                      <td style={{ color: 'var(--color-signal-green)', fontWeight: 500 }}>+{formatNumber(t.kmAdded)} km</td>
                      <td>{formatNumber(t.odometerAfter)} km</td>
                      <td style={{ textAlign: 'right' }}>
                        <button type="button" className="btn-danger-ghost" onClick={() => deleteTrip(t.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}