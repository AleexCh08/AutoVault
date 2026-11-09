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
        <a href="/" className="brand-lockup" style={{ textDecoration: 'none' }}>
          <img src="/logo.jpg" alt="Doppler Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
          <span>Doppler AutoVault</span>
          <span className="brand-tag">{state.vehicleSpec.placa}</span>
        </a>
        
        <div className="header-actions">
          <button type="button" className="btn-ghost" onClick={handleExport} title="Exportar JSON">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span className="hide-on-mobile">Exportar</span>
          </button>
          
          <label className="btn-ghost" style={{ cursor: 'pointer' }} title="Importar JSON">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span className="hide-on-mobile">Importar</span>
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
          
          <button type="button" className="btn-danger-ghost" onClick={() => {
            if(window.confirm("¿Vaciar todos los registros?")) resetState();
          }} title="Vaciar todo">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span className="hide-on-mobile">Vaciar todo</span>
          </button>
        </div>
      </div>
    </header>
  );
}