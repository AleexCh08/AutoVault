import React, { useState, useEffect } from 'react';
import { todayISO, addMonthsISO } from '../utils/helpers';

export function OdometerModal({ isOpen, onClose, currentOdo, updateState }) {
  const [val, setVal] = useState(currentOdo);
  
  useEffect(() => { setVal(currentOdo); }, [currentOdo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = Number(val);
    if (!isNaN(next) && next >= 0) {
      updateState({ odometer: Number(next.toFixed(1)) });
      onClose();
    }
  };

  return (
    <div className="modal-backdrop open">
      <div className="modal-panel">
        <div className="modal-header">
          <h3 className="section-title">Ajustar odómetro actual</h3>
          <button type="button" className="btn-ghost" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Lectura actual del tablero (km)</label>
            <input type="number" min="0" step="0.1" required value={val} onChange={e => setVal(e.target.value)} />
          </div>
          <div className="modal-footer" style={{ marginTop: '20px' }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-ghost" style={{ borderColor: 'var(--color-signal-green)', color: 'var(--color-signal-green)' }}>Guardar odómetro</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MaintModal({ isOpen, onClose, activeItem, currentOdo, updateState, maintenance }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (activeItem) {
      setFormData(activeItem);
    } else {
      setFormData({
        name: '', category: '', spec: '', lastKm: currentOdo, lastDate: todayISO(), intervalKm: '', intervalMonths: ''
      });
    }
  }, [activeItem, isOpen, currentOdo]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: formData.id || "maint_" + Date.now(),
      lastKm: Number(formData.lastKm),
      intervalKm: Number(formData.intervalKm),
      intervalMonths: Number(formData.intervalMonths)
    };

    if (activeItem) {
      updateState({ maintenance: maintenance.map(m => m.id === payload.id ? payload : m) });
    } else {
      updateState({ maintenance: [...maintenance, payload] });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop open">
      <div className="modal-panel">
        <div className="modal-header">
          <h3 className="section-title">{activeItem ? "Editar rubro" : "Nuevo rubro"}</h3>
          <button type="button" className="btn-ghost" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-grid">
            <div className="field full">
              <label>Componente o servicio</label>
              <input type="text" required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Categoría</label>
              <input type="text" required value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} />
            </div>
            <div className="field">
              <label>Especificación</label>
              <input type="text" value={formData.spec || ''} onChange={e => setFormData({ ...formData, spec: e.target.value })} />
            </div>
            <div className="field">
              <label>Km del último cambio</label>
              <input type="number" min="0" step="0.1" required value={formData.lastKm || ''} onChange={e => setFormData({ ...formData, lastKm: e.target.value })} />
            </div>
            <div className="field">
              <label>Fecha del último cambio</label>
              <input type="date" required value={formData.lastDate || ''} onChange={e => setFormData({ ...formData, lastDate: e.target.value })} />
            </div>
            <div className="field">
              <label>Intervalo (km)</label>
              <input type="number" min="100" step="100" required value={formData.intervalKm || ''} onChange={e => setFormData({ ...formData, intervalKm: e.target.value })} />
            </div>
            <div className="field">
              <label>Intervalo (meses)</label>
              <input type="number" min="1" step="1" required value={formData.intervalMonths || ''} onChange={e => setFormData({ ...formData, intervalMonths: e.target.value })} />
            </div>
          </div>
          <div className="modal-footer" style={{ marginTop: '20px' }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-ghost" style={{ borderColor: 'var(--color-signal-green)', color: 'var(--color-signal-green)' }}>Guardar rubro</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DocModal({ isOpen, onClose, activeItem, updateState, documents }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (activeItem) {
      setFormData({
        ...activeItem,
        hasQuarters: Array.isArray(activeItem.quarters) ? 'yes' : 'no'
      });
    } else {
      setFormData({
        name: '', entity: '', issueDate: todayISO(), expiryDate: addMonthsISO(todayISO(), 12), notes: '', hasQuarters: 'no'
      });
    }
  }, [activeItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const useQuarters = formData.hasQuarters === 'yes';
    const existing = documents.find(d => d.id === formData.id);
    
    const payload = {
      id: formData.id || "doc_" + Date.now(),
      name: formData.name.trim(),
      entity: formData.entity.trim(),
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      notes: formData.notes.trim(),
      quarters: useQuarters 
        ? (existing && Array.isArray(existing.quarters) ? existing.quarters : [false, false, false, false]) 
        : null
    };

    if (activeItem) {
      updateState({ documents: documents.map(d => d.id === payload.id ? payload : d) });
    } else {
      updateState({ documents: [...documents, payload] });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop open">
      <div className="modal-panel">
        <div className="modal-header">
          <h3 className="section-title">{activeItem ? "Actualizar documento legal" : "Nuevo documento legal"}</h3>
          <button type="button" className="btn-ghost" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-grid">
            <div className="field full">
              <label>Nombre del documento</label>
              <input type="text" required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Entidad / Referencia</label>
              <input type="text" required value={formData.entity || ''} onChange={e => setFormData({ ...formData, entity: e.target.value })} />
            </div>
            <div className="field">
              <label>Control de trimestres (T1-T4)</label>
              <select value={formData.hasQuarters || 'no'} onChange={e => setFormData({ ...formData, hasQuarters: e.target.value })}>
                <option value="no">Desactivado</option>
                <option value="yes">Activado (T1, T2, T3, T4)</option>
              </select>
            </div>
            <div className="field">
              <label>Fecha de emisión / pago</label>
              <input type="date" required value={formData.issueDate || ''} onChange={e => setFormData({ ...formData, issueDate: e.target.value })} />
            </div>
            <div className="field">
              <label>Fecha de vencimiento</label>
              <input type="date" required value={formData.expiryDate || ''} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
            </div>
            <div className="field full">
              <label>Observaciones / Número de póliza o planilla</label>
              <input type="text" value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            </div>
          </div>
          <div className="modal-footer" style={{ marginTop: '20px' }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-ghost" style={{ borderColor: 'var(--color-signal-green)', color: 'var(--color-signal-green)' }}>Guardar documento</button>
          </div>
        </form>
      </div>
    </div>
  );
}