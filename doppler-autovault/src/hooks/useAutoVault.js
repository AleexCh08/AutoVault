import { useState, useEffect } from 'react';

const STORAGE_KEY = "doppler_autovault_clean_v2";
const DEFAULT_STATE = {
  odometer: 0,
  vehicleSpec: {
    modelo: "Ford Laser GLXi",
    anio: 2000,
    motor: "FS9 DOHC 16V 1.8L",
    transmision: "Automática FWD",
    neumaticos: "185/65 R14",
    filtroAire: "Papel de celulosa",
    puertoDiag: "OBD-I",
    placa: "ACU-84T"
  },
  trips: [],
  maintenance: [],
  documents: []
};

export function useAutoVault() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;
      const parsed = JSON.parse(raw);
      return {
        odometer: Number(parsed.odometer) || 0,
        vehicleSpec: { ...DEFAULT_STATE.vehicleSpec, ...(parsed.vehicleSpec || {}), placa: "ACU-84T" },
        trips: Array.isArray(parsed.trips) ? parsed.trips : [],
        maintenance: Array.isArray(parsed.maintenance) ? parsed.maintenance : [],
        documents: Array.isArray(parsed.documents) ? parsed.documents : []
      };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetState = () => setState(DEFAULT_STATE);

  return { state, updateState, resetState };
}