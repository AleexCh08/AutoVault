import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
  const [state, setState] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVault = async () => {
      const { data, error } = await supabase
        .from('vault')
        .select('data')
        .eq('id', 'ford_laser')
        .single();

      if (data && data.data) {
        setState({
          odometer: data.data.odometer || 0,
          vehicleSpec: { ...DEFAULT_STATE.vehicleSpec, ...(data.data.vehicleSpec || {}) },
          trips: data.data.trips || [],
          maintenance: data.data.maintenance || [],
          documents: data.data.documents || []
        });
      }
      setLoading(false);
    };
    fetchVault();
  }, []);

  const updateState = async (updates) => {
    const newState = { ...state, ...updates };
    setState(newState);

    await supabase
      .from('vault')
      .upsert({ id: 'ford_laser', data: newState });
  };

  const resetState = async () => {
    setState(DEFAULT_STATE);
    await supabase
      .from('vault')
      .upsert({ id: 'ford_laser', data: DEFAULT_STATE });
  };

  return { state, updateState, resetState, loading };
}