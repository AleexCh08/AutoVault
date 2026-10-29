import React from 'react';

export default function VehicleSpec({ spec }) {
  return (
    <div className="card">
      <span className="eyebrow">Ficha técnica del vehículo</span>
      <h1 className="hero-title">
        Ford Laser <span className="gradient-text">GLXi 1.8L</span>
      </h1>
      <div className="spec-grid">
        <div className="spec-item"><span className="spec-label">AÑO</span><span className="spec-value">{spec.anio}</span></div>
        <div className="spec-item"><span className="spec-label">MOTOR</span><span className="spec-value">{spec.motor}</span></div>
        <div className="spec-item"><span className="spec-label">TRANSMISIÓN</span><span className="spec-value">{spec.transmision}</span></div>
        <div className="spec-item"><span className="spec-label">PLACA</span><span className="spec-value">{spec.placa}</span></div>
        <div className="spec-item"><span className="spec-label">NEUMÁTICOS</span><span className="spec-value">{spec.neumaticos}</span></div>
        <div className="spec-item"><span className="spec-label">FILTRO DE AIRE</span><span className="spec-value">{spec.filtroAire}</span></div>
        <div className="spec-item"><span className="spec-label">PUERTO DIAGNÓSTICO</span><span className="spec-value">{spec.puertoDiag}</span></div>
        <div className="spec-item"><span className="spec-label">ESTADO</span><span className="spec-value">Operativo</span></div>
      </div>
    </div>
  );
}