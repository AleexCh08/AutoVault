import React from 'react';
import { formatNumber, todayISO } from '../utils/helpers';
import { evaluateMaintenance } from '../utils/evaluators';

export default function MaintenanceMatrix({ maintenance, odometer, updateState, onEditMaint }) {
  const deleteMaintenance = (id) => {
    updateState({ maintenance: maintenance.filter(m => m.id !== id) });
  };

  const registerServiceNow = (id) => {
    updateState({
      maintenance: maintenance.map(m => m.id === id ? { ...m, lastKm: odometer, lastDate: todayISO() } : m)
    });
  };

  return (
    <section>
      <div className="section-header">
        <div>
          <span className="eyebrow">Control mecánico y fluidos</span>
          <h2 className="section-title">Matriz de mantenimiento preventivo</h2>
          <p className="section-subtitle">Agrega cada componente con su intervalo en kilómetros y meses.</p>
        </div>
        <button type="button" className="btn-ghost" onClick={() => onEditMaint(null)}>+ Nuevo rubro preventivo</button>
      </div>

      {maintenance.length === 0 ? (
        <div className="empty-state">Sin rubros de mantenimiento cargados.</div>
      ) : (
        <div className="cards-grid">
          {maintenance.map(item => {
            const ev = evaluateMaintenance(item, odometer);
            const badgeClass = ev.status === "due" ? "badge-due" : (ev.status === "warn" ? "badge-warn" : "badge-ok");
            const barColor = ev.status === "due" ? "var(--color-ember-orange)" : (ev.status === "warn" ? "var(--color-lavender-spark)" : "var(--color-signal-green)");

            return (
              <div className="item-card" key={item.id}>
                <div>
                  <div className="item-top">
                    <div>
                      <div className="item-title">{item.name}</div>
                      <div className="item-meta">{item.category.toUpperCase()}{item.spec ? " · " + item.spec : ""}</div>
                    </div>
                    <span className={`badge ${badgeClass}`}>{ev.label}</span>
                  </div>

                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: `${ev.ratioKm}%`, background: barColor }}></div>
                  </div>

                  <div className="stats-pair">
                    <div className="stat-cell">
                      <span>ÚLTIMO CAMBIO</span>
                      <span>{formatNumber(item.lastKm)} km ({item.lastDate})</span>
                    </div>
                    <div className="stat-cell">
                      <span>PRÓXIMO POR KM</span>
                      <span>{formatNumber(ev.nextKm)} km ({ev.kmRemaining >= 0 ? `faltan ${formatNumber(ev.kmRemaining)} km` : `excedido por ${formatNumber(Math.abs(ev.kmRemaining))} km`})</span>
                    </div>
                    <div className="stat-cell">
                      <span>INTERVALO CONFIGURADO</span>
                      <span>Cada {formatNumber(item.intervalKm)} km / {item.intervalMonths} meses</span>
                    </div>
                    <div className="stat-cell">
                      <span>VENCIMIENTO POR FECHA</span>
                      <span>{ev.dueDate} ({ev.daysLeft >= 0 ? `${ev.daysLeft} días` : "vencido"})</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button type="button" className="btn-inline" onClick={() => registerServiceNow(item.id)}>
                    Marcar cambio hoy ({formatNumber(odometer)} km) →
                  </button>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => onEditMaint(item)}>Editar</button>
                    <button type="button" className="btn-danger-ghost" onClick={() => deleteMaintenance(item.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}