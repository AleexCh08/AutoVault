import React from 'react';
import { evaluateDocument } from '../utils/evaluators';

export default function DocumentsControl({ documents, updateState, onEditDoc }) {
  const deleteDocument = (id) => {
    updateState({ documents: documents.filter(d => d.id !== id) });
  };

  const toggleQuarter = (docId, quarterIdx) => {
    updateState({
      documents: documents.map(doc => {
        if (doc.id === docId && Array.isArray(doc.quarters)) {
          const newQuarters = [...doc.quarters];
          newQuarters[quarterIdx] = !newQuarters[quarterIdx];
          return { ...doc, quarters: newQuarters };
        }
        return doc;
      })
    });
  };

  return (
    <section>
      <div className="section-header">
        <div>
          <span className="eyebrow">Control normativo</span>
          <h2 className="section-title">Documentos legales y trimestres</h2>
          <p className="section-subtitle">Fechas de expedición, vencimiento y control de trimestres municipales.</p>
        </div>
        <button type="button" className="btn-ghost" onClick={() => onEditDoc(null)}>+ Nuevo documento legal</button>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state">Sin documentos legales cargados. Usa el botón para registrar RCV, Certificado Médico, Licencia o Trimestres.</div>
      ) : (
        <div className="cards-grid">
          {documents.map(doc => {
            const ev = evaluateDocument(doc);
            const badgeClass = ev.status === "due" ? "badge-due" : (ev.status === "warn" ? "badge-warn" : "badge-ok");

            return (
              <div className="item-card" key={doc.id}>
                <div>
                  <div className="item-top">
                    <div>
                      <div className="item-title">{doc.name}</div>
                      <div className="item-meta">{doc.entity.toUpperCase()}{doc.notes ? " · " + doc.notes : ""}</div>
                    </div>
                    <span className={`badge ${badgeClass}`}>{ev.label}</span>
                  </div>

                  <div className="stats-pair" style={{ marginTop: '12px' }}>
                    <div className="stat-cell">
                      <span>EMISIÓN / ÚLTIMO PAGO</span>
                      <span>{doc.issueDate}</span>
                    </div>
                    <div className="stat-cell">
                      <span>FECHA DE VENCIMIENTO</span>
                      <span>{doc.expiryDate}</span>
                    </div>
                  </div>
                  
                  {Array.isArray(doc.quarters) && doc.quarters.length === 4 && (
                    <div style={{ marginTop: '12px' }}>
                      <span className="spec-label">ESTADO DE TRIMESTRES MUNICIPALES</span>
                      <div className="quarters-row">
                        {doc.quarters.map((paid, idx) => (
                          <button 
                            key={idx} 
                            type="button" 
                            className={`q-btn ${paid ? "active" : ""}`} 
                            onClick={() => toggleQuarter(doc.id, idx)}
                          >
                            T{idx + 1}: {paid ? "PAGADO" : "PENDIENTE"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button type="button" className="btn-inline" onClick={() => onEditDoc(doc)}>Actualizar fechas / datos →</button>
                  <button type="button" className="btn-danger-ghost" onClick={() => deleteDocument(doc.id)}>Eliminar</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}