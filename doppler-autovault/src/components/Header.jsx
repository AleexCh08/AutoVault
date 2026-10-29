import React from 'react';
import { todayISO } from '../utils/helpers';

export default function Header({ state, updateState, resetState }) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autovault_ACU-84T_${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        updateState(imported);
      } catch (err) {
        alert("Archivo JSON inválido.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header className="glass-header">
      <div className="header-inner">
        <div className="brand-lockup">
          <img src="/logo.jpg" alt="Doppler Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
          <span>Doppler AutoVault</span>
          <span className="brand-tag">{state.vehicleSpec.placa}</span>
        </div>
        <div className="header-actions">
          <button type="button" className="btn-ghost" onClick={handleExport}>Exportar JSON</button>
          <label className="btn-ghost" style={{ cursor: 'pointer' }}>
            Importar JSON
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
          <button type="button" className="btn-danger-ghost" onClick={() => {
            if(window.confirm("¿Vaciar todos los registros?")) resetState();
          }}>Vaciar todo</button>
        </div>
      </div>
    </header>
  );
}