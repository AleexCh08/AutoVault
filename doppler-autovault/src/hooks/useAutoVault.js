import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://wfrpigvrcudmhqofwjdc.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmcnBpZ3ZyY3VkbWhxb2Z3amRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyOTExMzcsImV4cCI6MjEwODg2NzEzN30.iVuG8VTI6ql76yQqf7mlnvSyWLtGsG8f_niG-kDfVXc";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("¡ERROR CRÍTICO! Las credenciales de Supabase no están definidas en import.meta.env. Revisa las variables en Vercel.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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