import React from 'react';
import { formatNumber } from '../utils/helpers';
import { evaluateMaintenance, evaluateDocument } from '../utils/evaluators';

export default function OdometerPanel({ odometer, maintenance, documents, onOpenOdo }) {
  const maintAlerts = maintenance.filter(m => evaluateMaintenance(m, odometer).status !== 'ok').length;
  const docAlerts = documents.filter(d => evaluateDocument(d).status !== 'ok').length;

  return (
    <div className="card odometer-panel">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="eyebrow">Odómetro principal</span>
          <button type="button" className="btn-inline" onClick={onOpenOdo}>
            Ajustar lectura base →
          </button>
        </div>
        <div className="odometer-display">
          <span>{formatNumber(odometer)}</span><span className="odometer-unit">km</span>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi-box">
          <span className="kpi-num">{maintAlerts}</span>
          <span className="kpi-caption">MANTENIMIENTOS POR VENCER / VENCIDOS</span>
        </div>
        <div className="kpi-box">
          <span className="kpi-num">{docAlerts}</span>
          <span className="kpi-caption">DOCUMENTOS POR RENOVAR / VENCIDOS</span>
        </div>
      </div>
    </div>
  );
}