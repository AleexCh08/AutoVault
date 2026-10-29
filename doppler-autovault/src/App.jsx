import React, { useState } from 'react';
import { useAutoVault } from './hooks/useAutoVault';
import Header from './components/Header';
import VehicleSpec from './components/VehicleSpec';
import OdometerPanel from './components/OdometerPanel';
import TripsLog from './components/TripsLog';
import MaintenanceMatrix from './components/MaintenanceMatrix';
import DocumentsControl from './components/DocumentsControl';
import { OdometerModal, MaintModal, DocModal } from './components/Modals';

function App() {
  const { state, updateState, resetState, loading } = useAutoVault();
  
  const [modals, setModals] = useState({ odo: false, maint: false, doc: false });
  const [activeMaint, setActiveMaint] = useState(null);
  const [activeDoc, setActiveDoc] = useState(null);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <span style={{ color: 'var(--color-ash-veil)', fontSize: 'var(--text-body)', fontWeight: 500, letterSpacing: '0.03em' }}>
          Sincronizando datos del vehículo...
        </span>
      </div>
    );
  }

  const openMaint = (item) => {
    setActiveMaint(item);
    setModals({ ...modals, maint: true });
  };

  const openDoc = (item) => {
    setActiveDoc(item);
    setModals({ ...modals, doc: true });
  };

  return (
    <>
      <Header state={state} updateState={updateState} resetState={resetState} />
      <main className="container">
        <section className="hero-grid">
          <VehicleSpec spec={state.vehicleSpec} />
          <OdometerPanel 
            odometer={state.odometer} 
            maintenance={state.maintenance} 
            documents={state.documents} 
            onOpenOdo={() => setModals({ ...modals, odo: true })} 
          />
        </section>
        
        <TripsLog odometer={state.odometer} trips={state.trips} updateState={updateState} />
        
        <MaintenanceMatrix 
          maintenance={state.maintenance} 
          odometer={state.odometer} 
          updateState={updateState} 
          onEditMaint={openMaint} 
        />
        
        <DocumentsControl
          documents={state.documents}
          updateState={updateState}
          onEditDoc={openDoc}
        />
      </main>

      <OdometerModal 
        isOpen={modals.odo} 
        onClose={() => setModals({ ...modals, odo: false })} 
        currentOdo={state.odometer} 
        updateState={updateState} 
      />

      <MaintModal 
        isOpen={modals.maint} 
        onClose={() => setModals({ ...modals, maint: false })} 
        activeItem={activeMaint} 
        currentOdo={state.odometer} 
        updateState={updateState} 
        maintenance={state.maintenance} 
      />

      <DocModal
        isOpen={modals.doc}
        onClose={() => setModals({ ...modals, doc: false })}
        activeItem={activeDoc}
        updateState={updateState}
        documents={state.documents}
      />
    </>
  );
}

export default App;